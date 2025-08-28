"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, AlertCircle, Info, CheckCircle, Search, Filter, Eye, EyeOff, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

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

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "Battery Temperature Critical",
    description: "Battery pack temperature exceeded 55°C threshold in cell bank 3",
    vehicleId: "BLX57819",
    vehicleType: "Sedan",
    timestamp: "2024-01-20 14:32:15",
    system: "Battery Management",
    canDeviceId: "OBD-2024-001",
    acknowledged: false,
    ignored: false,
  },
  {
    id: "ALT-002",
    severity: "warning",
    title: "Tire Pressure Low",
    description: "Front left tire pressure below recommended level (28 PSI)",
    vehicleId: "EV-2024-001",
    vehicleType: "Hatchback",
    timestamp: "2024-01-20 14:15:30",
    system: "TPMS",
    canDeviceId: "OBD-2024-002",
    acknowledged: true,
    ignored: false,
  },
  {
    id: "ALT-003",
    severity: "info",
    title: "Scheduled Maintenance Due",
    description: "Vehicle due for 10,000km service check",
    vehicleId: "EV-2024-003",
    vehicleType: "SUV",
    timestamp: "2024-01-20 13:45:00",
    system: "Maintenance",
    canDeviceId: "OBD-2024-003",
    acknowledged: false,
    ignored: false,
  },
  {
    id: "ALT-004",
    severity: "critical",
    title: "Motor Overheating",
    description: "Motor temperature exceeded safe operating limits",
    vehicleId: "EV-2024-004",
    vehicleType: "Van",
    timestamp: "2024-01-20 12:20:45",
    system: "Motor Control",
    canDeviceId: "OBD-2024-004",
    acknowledged: false,
    ignored: true,
  },
]

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
  const [alerts, setAlerts] = useState(mockAlerts)

  const handleIgnoreAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, ignored: true } : alert)))
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

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{warningCount}</p>
                <p className="text-sm text-gray-600">Warning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{infoCount}</p>
                <p className="text-sm text-gray-600">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{ignoredCount}</p>
                <p className="text-sm text-gray-600">Ignored</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search alerts..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="battery">Battery Management</SelectItem>
                <SelectItem value="tpms">TPMS</SelectItem>
                <SelectItem value="motor">Motor Control</SelectItem>
                <SelectItem value="charging">Charging</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts ({alerts.filter((a) => !a.ignored).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity]
                const Icon = config.icon

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${
                      alert.ignored ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge variant={config.badge as any} className="text-xs">
                            {alert.severity}
                          </Badge>
                          {alert.acknowledged && (
                            <Badge variant="outline" className="text-xs">
                              Acknowledged
                            </Badge>
                          )}
                          {alert.ignored && (
                            <Badge variant="secondary" className="text-xs">
                              Ignored
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                          <div>
                            <span className="font-medium">Vehicle:</span> {alert.vehicleId}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {alert.vehicleType}
                          </div>
                          <div>
                            <span className="font-medium">System:</span> {alert.system}
                          </div>
                          <div>
                            <span className="font-medium">Device:</span> {alert.canDeviceId}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {!alert.acknowledged && (
                              <Button variant="outline" size="sm">
                                Acknowledge
                              </Button>
                            )}
                            {!alert.ignored && (
                              <Button variant="outline" size="sm" onClick={() => handleIgnoreAlert(alert.id)}>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Ignore
                              </Button>
                            )}
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
