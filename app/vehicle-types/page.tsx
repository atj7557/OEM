"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Upload, Download } from "lucide-react"

interface VehicleType {
  id: string
  name: string
  category: string
  drivetrain: string
  batteryCapacity: number
  motorPower: number
  defaultFirmware: string
  alertThresholds: {
    batteryTemp: number
    soc: number
    motorTemp: number
  }
  activeVehicles: number
  status: "active" | "deprecated"
}

const mockVehicleTypes: VehicleType[] = [
  {
    id: "EVP-2024",
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
    },
    activeVehicles: 342,
    status: "active",
  },
  {
    id: "EVC-2024",
    name: "EV Compact 2024",
    category: "Hatchback",
    drivetrain: "FWD",
    batteryCapacity: 50,
    motorPower: 150,
    defaultFirmware: "v2.1.2",
    alertThresholds: {
      batteryTemp: 50,
      soc: 15,
      motorTemp: 80,
    },
    activeVehicles: 156,
    status: "active",
  },
  {
    id: "EVS-2024",
    name: "EV SUV 2024",
    category: "SUV",
    drivetrain: "AWD",
    batteryCapacity: 100,
    motorPower: 300,
    defaultFirmware: "v2.1.3",
    alertThresholds: {
      batteryTemp: 60,
      soc: 10,
      motorTemp: 90,
    },
    activeVehicles: 89,
    status: "active",
  },
]

// Add loading component
function VehicleTypesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function VehicleTypesPage() {
  return (
    <Suspense fallback={<VehicleTypesLoading />}>
      <VehicleTypesContent />
    </Suspense>
  )
}

function VehicleTypesContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-gray-600">Manage vehicle configurations and default settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle Type
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockVehicleTypes.length}</div>
            <p className="text-sm text-gray-600">Total Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockVehicleTypes.filter((t) => t.status === "active").length}</div>
            <p className="text-sm text-gray-600">Active Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockVehicleTypes.reduce((sum, t) => sum + t.activeVehicles, 0)}</div>
            <p className="text-sm text-gray-600">Total Vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-gray-600">Firmware Versions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search vehicle types..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Types ({mockVehicleTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Type ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Drivetrain</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Battery</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Motor Power</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Firmware</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Active Vehicles</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockVehicleTypes.map((type) => (
                  <tr key={type.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{type.id}</td>
                    <td className="py-3 px-4">
                      <Link href={`/vehicle-types/${type.id}`} className="font-medium text-blue-600 hover:underline">
                        {type.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{type.category}</Badge>
                    </td>
                    <td className="py-3 px-4">{type.drivetrain}</td>
                    <td className="py-3 px-4">{type.batteryCapacity} kWh</td>
                    <td className="py-3 px-4">{type.motorPower} kW</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{type.defaultFirmware}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/vehicles?type=${type.id}`} className="text-blue-600 hover:underline">
                        {type.activeVehicles}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={type.status === "active" ? "default" : "secondary"}>{type.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
