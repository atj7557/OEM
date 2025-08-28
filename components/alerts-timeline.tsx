"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
  id: string
  severity: "critical" | "warning" | "info" | "resolved"
  title: string
  description: string
  vehicleId: string
  timestamp: string
  system: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Battery Temperature Critical",
    description: "Battery pack temperature exceeded 55°C threshold",
    vehicleId: "BLX57819",
    timestamp: "2 minutes ago",
    system: "Battery Management",
  },
  {
    id: "2",
    severity: "warning",
    title: "Tire Pressure Low",
    description: "Front left tire pressure below recommended level",
    vehicleId: "EV-2024-001",
    timestamp: "15 minutes ago",
    system: "TPMS",
  },
  {
    id: "3",
    severity: "info",
    title: "Scheduled Maintenance Due",
    description: "Vehicle due for 10,000km service check",
    vehicleId: "EV-2024-003",
    timestamp: "1 hour ago",
    system: "Maintenance",
  },
  {
    id: "4",
    severity: "resolved",
    title: "Charging Port Issue",
    description: "Charging port communication restored",
    vehicleId: "BLX57819",
    timestamp: "2 hours ago",
    system: "Charging",
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

export function AlertsTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {mockAlerts.map((alert) => {
              const config = severityConfig[alert.severity]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <Badge variant={config.badge as any} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Vehicle: {alert.vehicleId}</span>
                        <span>System: {alert.system}</span>
                        <span>{alert.timestamp}</span>
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
  )
}
