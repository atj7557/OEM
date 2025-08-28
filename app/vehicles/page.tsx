"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Eye, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Vehicle {
  id: string
  model: string
  type: string
  health: "good" | "warning" | "critical"
  lastContact: string
  soc: number
  activeWarnings: number
  simDataUsed: number
  location: string
  odometer: number
  firmware: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "BLX57819",
    model: "EV Pro 2024",
    type: "Sedan",
    health: "critical",
    lastContact: "2m ago",
    soc: 73,
    activeWarnings: 2,
    simDataUsed: 85,
    location: "San Francisco, CA",
    odometer: 15420,
    firmware: "v2.1.3",
  },
  {
    id: "EV-2024-001",
    model: "EV Compact 2024",
    type: "Hatchback",
    health: "warning",
    lastContact: "5m ago",
    soc: 45,
    activeWarnings: 1,
    simDataUsed: 62,
    location: "Los Angeles, CA",
    odometer: 8750,
    firmware: "v2.1.2",
  },
  {
    id: "EV-2024-002",
    model: "EV Pro 2024",
    type: "Sedan",
    health: "good",
    lastContact: "1m ago",
    soc: 89,
    activeWarnings: 0,
    simDataUsed: 34,
    location: "Seattle, WA",
    odometer: 22100,
    firmware: "v2.1.3",
  },
  {
    id: "EV-2024-003",
    model: "EV SUV 2024",
    type: "SUV",
    health: "good",
    lastContact: "3m ago",
    soc: 67,
    activeWarnings: 0,
    simDataUsed: 78,
    location: "Portland, OR",
    odometer: 12890,
    firmware: "v2.1.3",
  },
]

const healthConfig = {
  good: { color: "bg-green-500", label: "Good" },
  warning: { color: "bg-orange-500", label: "Warning" },
  critical: { color: "bg-red-500", label: "Critical" },
}

export default function VehiclesPage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  return (
    <div className="space-y-6">
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search vehicles..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
              </SelectContent>
            </Select>
            <Select>
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
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet ({mockVehicles.length} vehicles)</CardTitle>
        </CardHeader>
        <CardContent>
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
                {mockVehicles.map((vehicle) => (
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
                        <Progress value={vehicle.soc} className="w-16" />
                        <span className="text-sm font-medium">{vehicle.soc}%</span>
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
                    <td className="py-3 px-4 text-sm">{vehicle.odometer.toLocaleString()} km</td>
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
