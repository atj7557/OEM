"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TelemetryWidget } from "../../../components/telemetry-widget"
import {
  ArrowLeft,
  Battery,
  Thermometer,
  Zap,
  MapPin,
  Calendar,
  AlertTriangle,
  Download,
  RotateCcw,
  Play,
} from "lucide-react"

interface VehicleDetails {
  id: string
  vin: string
  model: string
  type: string
  status: "online" | "offline" | "maintenance"
  lastContact: string
  location: string
  odometer: number
  firmware: string
  soc: number
  batteryTemp: number
  motorTemp: number
  speed: number
  health: "good" | "warning" | "critical"
  simCard: string
  deviceId: string
}

const mockVehicleDetails: VehicleDetails = {
  id: "BLX57819",
  vin: "TMEV2024BLX578190",
  model: "EV Pro 2024",
  type: "Sedan",
  status: "online",
  lastContact: "2 minutes ago",
  location: "Mumbai, MH",
  odometer: 15420,
  firmware: "v2.1.3",
  soc: 73,
  batteryTemp: 32,
  motorTemp: 45,
  speed: 0,
  health: "critical",
  simCard: "SIM-001",
  deviceId: "OBD-2024-001",
}

const recentAlerts = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "Battery Temperature Critical",
    timestamp: "2024-01-20 14:32:15",
    status: "active",
  },
  {
    id: "ALT-005",
    severity: "warning",
    title: "Tire Pressure Low",
    timestamp: "2024-01-20 12:15:30",
    status: "acknowledged",
  },
]

const maintenanceHistory = [
  {
    id: "MNT-H-001",
    type: "10,000km Service",
    date: "2024-01-15",
    status: "completed",
    cost: 4200,
  },
  {
    id: "MNT-H-002",
    type: "Battery Check",
    date: "2023-12-20",
    status: "completed",
    cost: 1500,
  },
]

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const statusConfig = {
    online: { color: "bg-green-500", label: "Online", badge: "default" },
    offline: { color: "bg-red-500", label: "Offline", badge: "destructive" },
    maintenance: { color: "bg-yellow-500", label: "Maintenance", badge: "secondary" },
  }

  const healthConfig = {
    good: { color: "bg-green-500", label: "Good" },
    warning: { color: "bg-orange-500", label: "Warning" },
    critical: { color: "bg-red-500", label: "Critical" },
  }

  const statusConf = statusConfig[mockVehicleDetails.status]
  const healthConf = healthConfig[mockVehicleDetails.health]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{mockVehicleDetails.id}</h1>
            <Badge variant={statusConf.badge as any} className="text-xs">
              <div className={`w-2 h-2 rounded-full ${statusConf.color} mr-1`} />
              {statusConf.label} • {mockVehicleDetails.lastContact}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {mockVehicleDetails.firmware}
            </Badge>
          </div>
          <p className="text-gray-600">
            {mockVehicleDetails.model} • VIN: {mockVehicleDetails.vin}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Send OTA
          </Button>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Remote Diagnostics
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reboot ECU
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Battery className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockVehicleDetails.soc}%</p>
                <p className="text-sm text-gray-600">State of Charge</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Thermometer className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockVehicleDetails.batteryTemp}°C</p>
                <p className="text-sm text-gray-600">Battery Temp</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockVehicleDetails.speed}</p>
                <p className="text-sm text-gray-600">Speed (km/h)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{mockVehicleDetails.odometer.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Odometer (km)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="telemetry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="telemetry">Live Telemetry</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
        </TabsList>

        <TabsContent value="telemetry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Vehicle Data</CardTitle>
            </CardHeader>
            <CardContent>
              <TelemetryWidget />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Alerts</CardTitle>
                <Link href="/alerts">
                  <Button variant="outline" size="sm">
                    View All Alerts
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${alert.severity === "critical" ? "text-red-600" : "text-orange-600"}`}
                      />
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>{alert.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Maintenance History</CardTitle>
                <Link href="/maintenance/history">
                  <Button variant="outline" size="sm">
                    View Full History
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{record.cost.toLocaleString()}</p>
                      <Badge variant="default" className="text-xs">
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connectivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SIM & Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">SIM Card</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SIM ID:</span>
                      <Link
                        href={`/sims/${mockVehicleDetails.simCard}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {mockVehicleDetails.simCard}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Signal:</span>
                      <span className="text-sm">-65 dBm (Excellent)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Used:</span>
                      <span className="text-sm">8.5 GB / 10 GB</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">OBD Device</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Device ID:</span>
                      <span className="text-sm">{mockVehicleDetails.deviceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Firmware:</span>
                      <span className="text-sm">{mockVehicleDetails.firmware}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Ping:</span>
                      <span className="text-sm">{mockVehicleDetails.lastContact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
