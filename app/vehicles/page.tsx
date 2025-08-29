"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Eye, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { listOBDDevices } from "@/lib/api"

// ---------- Types matching your table UI ----------
interface VehicleRow {
  id: string
  model: string
  type: string
  health: "good" | "warning" | "critical"
  lastContact: string
  soc?: number | null
  activeWarnings: number
  simDataUsed?: number | null
  location: string
  odometer?: number | null
  firmware: string
}

// Raw API types (subset we use)
type SimCard = {
  sim_id: string
  status?: string | null
  plan_data_limit_gb?: number | null
  current_data_used_gb?: number | null
  last_activity?: string | null
  overage_threshold?: number | null
}
type OBDDevice = {
  id: number
  device_id: string
  model?: string | null
  vehicle: number | null
  firmware_version?: string | null
  last_communication_at?: string | null
  is_active?: boolean
  sim_card?: SimCard | null
}

// ---------- Helpers ----------
const healthConfig = {
  good: { color: "bg-green-500", label: "Good" },
  warning: { color: "bg-orange-500", label: "Warning" },
  critical: { color: "bg-red-500", label: "Critical" },
}

function fmtAgo(iso?: string | null): string {
  if (!iso) return "—"
  const ts = Date.parse(iso)
  if (Number.isNaN(ts)) return "—"
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function deriveTypeFromModel(model?: string | null): string {
  const m = (model || "").toLowerCase()
  if (m.includes("suv")) return "SUV"
  if (m.includes("hatch")) return "Hatchback"
  if (m.includes("sedan") || m.includes("pro")) return "Sedan"
  return "—"
}

function deriveHealth(last?: string | null): "good" | "warning" | "critical" {
  if (!last) return "critical"
  const ts = Date.parse(last)
  if (Number.isNaN(ts)) return "critical"
  const diff = Date.now() - ts
  if (diff > 72 * 60 * 60 * 1000) return "critical"
  if (diff > 24 * 60 * 60 * 1000) return "warning"
  return "good"
}

function deriveWarnings(d: OBDDevice): number {
  let w = 0
  // stale comms
  if (deriveHealth(d.last_communication_at) === "critical") w++
  // no SIM
  if (!d.sim_card) w++
  // high data usage
  const used = d.sim_card?.current_data_used_gb ?? 0
  const limit = d.sim_card?.plan_data_limit_gb ?? 0
  const threshold = d.sim_card?.overage_threshold ?? 0.9
  if (limit > 0 && used / limit >= threshold) w++
  return w
}

// ---------- Component ----------
export default function VehiclesPage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Live API state
  const [devices, setDevices] = useState<OBDDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>("")

  // Filters (UI only; keeps your layout/UX)
  const [q, setQ] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [healthFilter, setHealthFilter] = useState<string>("all")

  // Debug info
  const [debug, setDebug] = useState<{
    apiBase?: string
    tokenPresent?: boolean
    fetched?: boolean
    count?: number
    errors?: string[]
  }>({ errors: [] })

  const load = useCallback(async () => {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://joulepoint.platform-api-test.joulepoint.com"
    const tokenPresent =
      typeof window !== "undefined" && !!localStorage.getItem("access_token")

    setLoading(true)
    setErr("")

    try {
      const data = await listOBDDevices()
      const results: OBDDevice[] = Array.isArray(data?.results) ? data.results : (data ?? [])
      setDevices(results)
      setDebug((d) => ({
        ...d,
        apiBase,
        tokenPresent,
        fetched: true,
        count: results.length,
      }))
      console.log("Vehicles (live):", results)
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Failed to load OBD devices"
      setErr(message)
      setDebug((d) => ({
        ...d,
        apiBase,
        tokenPresent,
        fetched: false,
        errors: [...(d.errors || []), message],
      }))
      console.error("listOBDDevices error:", message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Map API -> your table row model (keep your UI)
  const rows: VehicleRow[] = useMemo(() => {
    return devices.map((d) => {
      const model = d.model ?? "—"
      const type = deriveTypeFromModel(d.model)
      const health = deriveHealth(d.last_communication_at)
      const lastContact = fmtAgo(d.last_communication_at)
      const activeWarnings = deriveWarnings(d)
      const firmware = d.firmware_version ?? "—"
      const simUsedPct = (() => {
        const used = d.sim_card?.current_data_used_gb ?? 0
        const limit = d.sim_card?.plan_data_limit_gb ?? 0
        if (!limit) return null
        return Math.round((used / limit) * 100)
      })()

      return {
        id: d.device_id,
        model,
        type,
        health,
        lastContact,
        soc: null,            // SoC becomes real when you wire getDeviceMetrics; for now "—"
        activeWarnings,
        simDataUsed: simUsedPct,
        location: "—",        // no location field in provided API; keep placeholder
        odometer: null,       // no odometer in provided API; keep placeholder
        firmware,
      } as VehicleRow
    })
  }, [devices])

  // Apply search & select filters (client-side, keeps your UI behavior)
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    return rows.filter((v) => {
      const textOk =
        !text ||
        v.id.toLowerCase().includes(text) ||
        v.model.toLowerCase().includes(text) ||
        v.type.toLowerCase().includes(text)

      const typeOk = typeFilter === "all" || v.type.toLowerCase() === typeFilter
      const healthOk = healthFilter === "all" || v.health === (healthFilter as any)

      return textOk && typeOk && healthOk
    })
  }, [rows, q, typeFilter, healthFilter])

  return (
    <div className="space-y-6">
      {/* Header (unchanged) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Vehicles</h1>
          <p className="text-gray-600">Manage and monitor your vehicle fleet</p>
        </div>
        <Link href="/vehicles/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Filters (keep same UI) */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                className="pl-10"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="—">—</SelectItem>
              </SelectContent>
            </Select>

            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Health Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Optional: advanced filters container (kept collapsed for now) */}
          {showAdvancedFilters && (
            <div className="mt-4 text-sm text-gray-500">
              {/* add your extra filters here later; kept to preserve your toggle */}
              No additional filters yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicles Table (same UI, real data) */}
      <Card>
        <CardHeader>
          <CardTitle>
            Vehicle Fleet ({loading ? "…" : filtered.length} vehicles)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {err ? (
            <div className="text-sm text-red-600 mb-3">{err}</div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Health</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">SoC</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Warnings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Odometer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Firmware</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(loading ? [] : filtered).map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        <div>
                          <div className="font-medium text-blue-600 hover:underline">{vehicle.id}</div>
                          <div className="text-sm text-gray-500">{vehicle.model}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="outline">{vehicle.type}</Badge>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${healthConfig[vehicle.health].color}`} />
                        <span className="text-sm">{healthConfig[vehicle.health].label}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm">{vehicle.lastContact}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={typeof vehicle.soc === "number" ? vehicle.soc : 0} className="w-16" />
                        <span className="text-sm font-medium">
                          {typeof vehicle.soc === "number" ? `${vehicle.soc}%` : "—"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {vehicle.activeWarnings > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {vehicle.activeWarnings}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-sm">
                      {typeof vehicle.odometer === "number" ? `${vehicle.odometer.toLocaleString()} km` : "—"}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {vehicle.firmware}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {!loading && !err && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-sm text-gray-500">
                      No vehicles match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Loading state row */}
            {loading && (
              <div className="py-6 text-center text-sm text-gray-500">Loading vehicles…</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug panel (to verify real API data) */}
      <Card>
        <CardHeader>
          <CardTitle>Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-gray-500">API Base</div>
              <div className="font-mono break-all">{debug.apiBase ?? "—"}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-gray-500">Access Token Present</div>
              <div className="font-medium">{debug.tokenPresent ? "Yes" : "No"}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-gray-500">Fetched</div>
              <div className={`font-medium ${debug.fetched ? "text-emerald-600" : "text-red-600"}`}>
                {debug.fetched ? "Success" : "Failed"}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-gray-500">Devices Count</div>
              <div className="font-medium">{debug.count ?? "—"}</div>
            </div>
            <div className="rounded-xl border p-3 md:col-span-3">
              <div className="text-xs text-gray-500">Errors</div>
              <div className="font-mono text-xs whitespace-pre-wrap">
                {debug.errors && debug.errors.length ? debug.errors.join("\n") : "—"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Sample Device JSON</div>
            <pre className="max-h-64 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
              {devices[0] ? JSON.stringify(devices[0], null, 2) : "—"}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
