"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Download, Upload, AlertTriangle } from "lucide-react"

interface VehicleTypeDetailsProps {
  params: {
    id: string
  }
}

export default function VehicleTypeDetailsPage({ params }: VehicleTypeDetailsProps) {
  const vehicleType = {
    id: params.id,
    name: "EV Pro 2024",
    category: "Sedan",
    drivetrain: "RWD",
    batteryCapacity: 75,
    motorPower: 200,
    defaultFirmware: "v2.1.3",
    alertThresholds: {
      batteryTemp: 55,
      soc: 10,
      motorTemp: 85,
      tirePress: 28,
    },
    activeVehicles: 342,
    status: "active",
    specifications: {
      length: 4850,
      width: 1850,
      height: 1450,
      weight: 1800,
      topSpeed: 180,
      acceleration: 6.5,
      range: 450,
    },
    firmwareLineage: [
      { component: "BMS", version: "v4.2.1", status: "current" },
      { component: "VCU", version: "v12.1.0", status: "current" },
      { component: "Charger", version: "v6.3.2", status: "current" },
      { component: "TPMS", version: "v2.1.1", status: "current" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vehicle-types">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicle Types
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{vehicleType.name}</h1>
          <p className="text-gray-600">
            {vehicleType.category} • {vehicleType.drivetrain} • {vehicleType.activeVehicles} active vehicles
          </p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Edit Configuration
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicleType.activeVehicles}</div>
            <p className="text-sm text-gray-600">Active Vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicleType.batteryCapacity} kWh</div>
            <p className="text-sm text-gray-600">Battery Capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicleType.motorPower} kW</div>
            <p className="text-sm text-gray-600">Motor Power</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicleType.specifications.range} km</div>
            <p className="text-sm text-gray-600">WLTP Range</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="firmware">Firmware Lineage</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="vehicles">Active Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Physical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Length</p>
                    <p className="font-medium">{vehicleType.specifications.length} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Width</p>
                    <p className="font-medium">{vehicleType.specifications.width} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="font-medium">{vehicleType.specifications.height} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{vehicleType.specifications.weight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Top Speed</p>
                    <p className="font-medium">{vehicleType.specifications.topSpeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">0-100 km/h</p>
                    <p className="font-medium">{vehicleType.specifications.acceleration} s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Drivetrain</p>
                    <p className="font-medium">{vehicleType.drivetrain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{vehicleType.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="firmware" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Firmware Lineage</CardTitle>
              <p className="text-sm text-gray-600">Default firmware versions for new vehicles of this type</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleType.firmwareLineage.map((fw, index) => (
                  <div key={fw.component} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{fw.component.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{fw.component}</p>
                        <p className="text-sm text-gray-600">Version {fw.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{fw.status}</Badge>
                      <Button variant="outline" size="sm">
                        View Release Notes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alert Thresholds</CardTitle>
                  <p className="text-sm text-gray-600">Default warning and critical thresholds for this vehicle type</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Push to All Vehicles
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Battery Temperature</h4>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <p className="text-2xl font-bold">{vehicleType.alertThresholds.batteryTemp}°C</p>
                    <p className="text-sm text-gray-600">Triggers immediate alert</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Motor Temperature</h4>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <p className="text-2xl font-bold">{vehicleType.alertThresholds.motorTemp}°C</p>
                    <p className="text-sm text-gray-600">Triggers immediate alert</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">State of Charge</h4>
                      <Badge variant="secondary">Warning</Badge>
                    </div>
                    <p className="text-2xl font-bold">{vehicleType.alertThresholds.soc}%</p>
                    <p className="text-sm text-gray-600">Low battery warning</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Tire Pressure</h4>
                      <Badge variant="secondary">Warning</Badge>
                    </div>
                    <p className="text-2xl font-bold">{vehicleType.alertThresholds.tirePress} PSI</p>
                    <p className="text-sm text-gray-600">Minimum tire pressure</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Homologation Documents</CardTitle>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">E-Mark Certificate</p>
                    <p className="text-sm text-gray-600">EU Type Approval • Valid until 2026-12-31</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Safety Assessment Report</p>
                    <p className="text-sm text-gray-600">ISO 26262 ASIL-D • Version 2.1</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Vehicles ({vehicleType.activeVehicles})</CardTitle>
                <Link href={`/vehicles?type=${vehicleType.id}`}>
                  <Button variant="outline">View All Vehicles</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Click "View All Vehicles" to see the complete list of vehicles using this type configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
