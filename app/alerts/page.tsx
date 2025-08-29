"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, AlertCircle, Info, CheckCircle, Search, Filter, Eye, EyeOff, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listAlerts } from "@/lib/api"

interface Alert {
  id: string
  severity: "critical" | "warning" | "info" | "resolved"
  title: string
  description: string
  vehicleId: string
  vehicleType: string
  timestamp: string
  system: string
  canDeviceId: string
  acknowledged: boolean
  ignored: boolean
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badge: "destructive",
  },
  warning: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badge: "secondary",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badge: "outline",
  },
  resolved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badge: "default",
  },
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await listAlerts()
        
        setAlerts(
          data.results.map((a: any) => ({
            id: String(a.id),
            severity: mapSeverity(a.severity, a.resolved),
            title: a.title ?? "Untitled Alert",
            description: a.message ?? "",
            vehicleId: a.vehicle_info?.license_plate ?? a.vehicle_info?.vin ?? "Unknown",
            vehicleType: a.vehicle_info?.vehicle_type ?? "N/A",
            timestamp: a.created_at ?? new Date().toISOString(),
            system: a.system ?? "",
            canDeviceId: a.device_id ?? "",
            acknowledged: a.read ?? false,
            ignored: a.ignored ?? false,
          }))
        )
      } catch (err: any) {
        setError(err.message || "Failed to fetch alerts")
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  // map API severity to UI categories
  const mapSeverity = (sev: string, resolved: boolean): Alert["severity"] => {
    if (resolved) return "resolved"
    switch (sev?.toLowerCase()) {
      case "high":
        return "critical"
      case "medium":
        return "warning"
      case "low":
        return "info"
      default:
        return "info"
    }
  }

  const handleIgnoreAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, ignored: true } : alert))
    )
  }

  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.ignored).length
  const warningCount = alerts.filter((a) => a.severity === "warning" && !a.ignored).length
  const infoCount = alerts.filter((a) => a.severity === "info" && !a.ignored).length
  const ignoredCount = alerts.filter((a) => a.ignored).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Warnings</h1>
          <p className="text-gray-600">Monitor and manage fleet alerts</p>
        </div>
        <Link href="/alerts/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Warning Rule
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" /><div><p className="text-2xl font-bold">{criticalCount}</p><p className="text-sm text-gray-600">Critical</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-600" /><div><p className="text-2xl font-bold">{warningCount}</p><p className="text-sm text-gray-600">Warning</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><Info className="w-5 h-5 text-blue-600" /><div><p className="text-2xl font-bold">{infoCount}</p><p className="text-sm text-gray-600">Info</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><EyeOff className="w-5 h-5 text-gray-600" /><div><p className="text-2xl font-bold">{ignoredCount}</p><p className="text-sm text-gray-600">Ignored</p></div></CardContent></Card>
      </div>

      {/* Error */}
      {error && <div className="text-red-600">{error}</div>}

      {/* Alerts list */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts ({alerts.filter((a) => !a.ignored).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {loading && <p className="text-gray-500">Loading alerts...</p>}
              {!loading &&
                alerts.map((alert) => {
                  const config = severityConfig[alert.severity]
                  const Icon = config.icon
                  return (
                    <div key={alert.id} className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${alert.ignored ? "opacity-50" : ""}`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <Badge variant={config.badge as any} className="text-xs">{alert.severity}</Badge>
                            {alert.acknowledged && <Badge variant="outline" className="text-xs">Acknowledged</Badge>}
                            {alert.ignored && <Badge variant="secondary" className="text-xs">Ignored</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                            <div><span className="font-medium">Vehicle:</span> {alert.vehicleId}</div>
                            <div><span className="font-medium">Type:</span> {alert.vehicleType}</div>
                            <div><span className="font-medium">System:</span> {alert.system}</div>
                            <div><span className="font-medium">Device:</span> {alert.canDeviceId}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{alert.timestamp}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" />View</Button>
                              {!alert.ignored && <Button variant="outline" size="sm" onClick={() => handleIgnoreAlert(alert.id)}><EyeOff className="w-4 h-4 mr-1" />Ignore</Button>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
