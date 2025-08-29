// app/dashboard/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { FleetKPIBar } from "@/components/fleet-kpi-bar"
import { TelemetryWidget } from "@/components/telemetry-widget"
import { AlertsTimeline } from "@/components/alerts-timeline"
import { VehiclesTable } from "@/components/vehicles-table"
import { Separator } from "@/components/ui/separator"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { listOBDDevices, getDeviceMetrics, getDeviceLocation } from "@/lib/api"

// ---- Types ----
type SimCard = {
  sim_id: string
  status?: string | null
  plan_data_limit_gb?: number | null
  current_data_used_gb?: number | null
  last_activity?: string | null
  overage_threshold?: number | null
  signal_strength?: string | null
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

type AlertItem = {
  id: string
  severity: "critical" | "warning" | "info" | "resolved"
  title: string
  description: string
  vehicleLabel: string
  system: string
  ago: string
}

// ---- Helpers ----
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

export default function Dashboard() {
  // Live data
  const [devices, setDevices] = useState<OBDDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>("")

  // SoC + Location caches
  const [socByDeviceId, setSocByDeviceId] = useState<Record<number, number | null>>({})
  const [locationByDeviceId, setLocationByDeviceId] = useState<
    Record<number, { latitude?: number; longitude?: number; address?: string } | null>
  >({})

  // Debug
  const [debug, setDebug] = useState<{
    apiBase?: string
    tokenPresent?: boolean
    fetched?: boolean
    deviceCount?: number
    metricsFetched?: boolean
    locationsFetched?: boolean
    errors?: string[]
  }>({ errors: [] })

  // Fetch devices
  useEffect(() => {
    ;(async () => {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://joulepoint.platform-api-test.joulepoint.com"
      const tokenPresent = typeof window !== "undefined" && !!localStorage.getItem("access_token")

      try {
        const data = await listOBDDevices()
        const results: OBDDevice[] = Array.isArray(data?.results) ? data.results : (data ?? [])
        setDevices(results)
        setDebug((d) => ({
          ...d,
          apiBase,
          tokenPresent,
          fetched: true,
          deviceCount: results.length,
        }))
        console.log("OBD devices (live):", results)
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
    })()
  }, [])

  // Fetch SoC + Location for first N devices (avoid spamming)
  useEffect(() => {
    ;(async () => {
      if (!devices.length) return
      const subset = devices.slice(0, 10)

      // SoC
      try {
        const socUpdates: Record<number, number | null> = {}
        await Promise.all(
          subset.map(async (d) => {
            try {
              const m = await getDeviceMetrics(d.id) // { soc_percent }
              socUpdates[d.id] = typeof m?.soc_percent === "number" ? m.soc_percent : null
            } catch {
              socUpdates[d.id] = null
            }
          })
        )
        if (Object.keys(socUpdates).length) setSocByDeviceId((prev) => ({ ...prev, ...socUpdates }))
        setDebug((d) => ({ ...d, metricsFetched: true }))
        console.log("SoC metrics:", socUpdates)
      } catch {
        setDebug((d) => ({
          ...d,
          metricsFetched: false,
          errors: [...(d.errors || []), "SoC fetch failed"],
        }))
      }

      // Location
      try {
        const locUpdates: Record<number, { latitude?: number; longitude?: number; address?: string } | null> = {}
        await Promise.all(
          subset.map(async (d) => {
            try {
              const loc = await getDeviceLocation(d.id) // { latitude, longitude, address }
              locUpdates[d.id] = loc ?? null
            } catch {
              locUpdates[d.id] = null
            }
          })
        )
        if (Object.keys(locUpdates).length)
          setLocationByDeviceId((prev) => ({ ...prev, ...locUpdates }))
        setDebug((d) => ({ ...d, locationsFetched: true }))
        console.log("Locations:", locUpdates)
      } catch {
        setDebug((d) => ({
          ...d,
          locationsFetched: false,
          errors: [...(d.errors || []), "Location fetch failed"],
        }))
      }
    })()
  }, [devices])

  // KPIs, alerts, selection, avg SoC
  const {
    totalDevices,
    reportingRecently,
    alerts,
    alertsCount,
    selectedDevice,
    averageSocPercent,
  } = useMemo(() => {
    const now = Date.now()
    const RECENT_MS = 24 * 60 * 60 * 1000
    const STALE_MS = 72 * 60 * 60 * 1000

    const total = devices.length
    const recent = devices.filter((d) => {
      const ts = d.last_communication_at ? Date.parse(d.last_communication_at) : NaN
      return !Number.isNaN(ts) && now - ts <= RECENT_MS
    }).length

    const built: AlertItem[] = []
    devices.forEach((d) => {
      const vehicleLabel = d.device_id || `Device-${d.id}`
      const ts = d.last_communication_at ? Date.parse(d.last_communication_at) : NaN
      const isStale = Number.isNaN(ts) || now - ts > STALE_MS

      if (isStale) {
        built.push({
          id: `stale-${d.id}`,
          severity: "critical",
          title: "Device Communication Stale",
          description: "No recent telemetry (>72h). Check power/connectivity.",
          vehicleLabel,
          system: "Telematics",
          ago: fmtAgo(d.last_communication_at),
        })
      }

      if (!d.sim_card) {
        built.push({
          id: `nosim-${d.id}`,
          severity: "warning",
          title: "No SIM Assigned",
          description: "Device has no SIM; data upload may fail.",
          vehicleLabel,
          system: "Connectivity",
          ago: fmtAgo(d.last_communication_at),
        })
      } else {
        const used = d.sim_card.current_data_used_gb ?? 0
        const limit = d.sim_card.plan_data_limit_gb ?? 0
        const pct = limit > 0 ? used / limit : 0
        const thresh = d.sim_card.overage_threshold ?? 0.9
        if (limit > 0 && pct >= thresh) {
          built.push({
            id: `data-${d.id}`,
            severity: "warning",
            title: "High SIM Data Usage",
            description: `Usage at ${(pct * 100).toFixed(0)}% of plan.`,
            vehicleLabel,
            system: "Connectivity",
            ago: fmtAgo(d.sim_card.last_activity ?? d.last_communication_at),
          })
        }
      }
    })

    const pick = devices.find((d) => d.is_active) || devices[0]

    const socValues = devices
      .map((d) => socByDeviceId[d.id])
      .filter((v): v is number => typeof v === "number")
    const avgSoc = socValues.length
      ? Math.round(socValues.reduce((a, b) => a + b, 0) / socValues.length)
      : null

    return {
      totalDevices: total,
      reportingRecently: recent,
      alerts: built,
      alertsCount: built.length,
      selectedDevice: pick,
      averageSocPercent: avgSoc,
    }
  }, [devices, socByDeviceId])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">Fleet Dashboard</h1>
            <p className="text-sm text-gray-500">Real-time diagnostics and fleet management yt </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative" title="Alerts">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                {alertsCount}
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" title="Settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-6 bg-gray-50">
          {/* Fleet KPIs */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h2>
            <FleetKPIBar
              loading={loading}
              vehiclesOnline={reportingRecently}
              totalVehicles={totalDevices}
              criticalAlerts={alertsCount}
              averageSocPercent={averageSocPercent}
              maintenanceTickets={null}
              trendOnline="up"
              changeOnline="+2.3%"
              trendCritical="down"
              changeCritical="-1"
              trendSoc={averageSocPercent !== null ? "up" : "stable"}
              changeSoc={averageSocPercent !== null ? "+5.2%" : ""}
              trendMaint="stable"
              changeMaint="0"
            />
          </section>

          {/* Real-time Telemetry */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Live Telemetry - Vehicle {devices.length ? (devices[0]?.device_id ?? "—") : "—"}
            </h2>
            <TelemetryWidget
              selectedDeviceId={devices[0]?.device_id}
              devices={devices}
              loading={loading}
              error={err}
              socByDeviceId={socByDeviceId}
              locationByDeviceId={locationByDeviceId}
            />
          </section>

          {/* Alerts and Vehicles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AlertsTimeline loading={loading} error={err} alerts={alerts} />
            </div>
            <div className="lg:col-span-2">
              <VehiclesTable loading={loading} error={err} rows={devices} />
            </div>
          </div>

          {/* Debug */}
          <section className="rounded-2xl border bg-white p-4">
            <h3 className="text-sm font-semibold mb-2">Debug</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">API Base</div>
                <div className="font-mono break-all">{debug.apiBase ?? "—"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">Access Token Present</div>
                <div className="font-medium">{debug.tokenPresent ? "Yes" : "No"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">Devices Fetched</div>
                <div className={`font-medium ${debug.fetched ? "text-emerald-600" : "text-red-600"}`}>
                  {debug.fetched ? "Success" : "Failed"}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">Device Count</div>
                <div className="font-medium">{debug.deviceCount ?? "—"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">SoC Fetched</div>
                <div className="font-medium">
                  {debug.metricsFetched === undefined ? "—" : debug.metricsFetched ? "Yes" : "No"}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-gray-500">Location Fetched</div>
                <div className="font-medium">
                  {debug.locationsFetched === undefined ? "—" : debug.locationsFetched ? "Yes" : "No"}
                </div>
              </div>
              <div className="rounded-xl border p-3 md:col-span-3">
                <div className="text-xs text-gray-500">Errors</div>
                <div className="font-mono text-xs whitespace-pre-wrap">
                  {(debug.errors && debug.errors.length) ? debug.errors.join("\n") : "—"}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Sample Device JSON</div>
                <pre className="max-h-64 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
                  {devices[0] ? JSON.stringify(devices[0], null, 2) : "—"}
                </pre>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Sample Location / SoC</div>
                <pre className="max-h-64 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
                  {devices[0]
                    ? JSON.stringify(
                        {
                          soc: socByDeviceId[devices[0].id] ?? null,
                          location: locationByDeviceId[devices[0].id] ?? null,
                        },
                        null,
                        2
                      )
                    : "—"}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
