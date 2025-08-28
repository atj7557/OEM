"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Eye } from "lucide-react"

interface Vehicle {
  id: string
  model: string
  health: "good" | "warning" | "critical"
  lastContact: string
  soc: number
  activeWarnings: number
  simDataUsed: number
  location: string
}

const mockVehicles: Vehicle[] = [
  {
    id: "BLX57819",
    model: "EV Pro 2024",
    health: "critical",
    lastContact: "2m ago",
    soc: 73,
    activeWarnings: 2,
    simDataUsed: 85,
    location: "San Francisco, CA",
  },
  {
    id: "EV-2024-001",
    model: "EV Compact 2024",
    health: "warning",
    lastContact: "5m ago",
    soc: 45,
    activeWarnings: 1,
    simDataUsed: 62,
    location: "Los Angeles, CA",
  },
  {
    id: "EV-2024-002",
    model: "EV Pro 2024",
    health: "good",
    lastContact: "1m ago",
    soc: 89,
    activeWarnings: 0,
    simDataUsed: 34,
    location: "Seattle, WA",
  },
  {
    id: "EV-2024-003",
    model: "EV Compact 2024",
    health: "good",
    lastContact: "3m ago",
    soc: 67,
    activeWarnings: 0,
    simDataUsed: 78,
    location: "Portland, OR",
  },
]

const healthConfig = {
  good: { color: "bg-green-500", label: "Good" },
  warning: { color: "bg-orange-500", label: "Warning" },
  critical: { color: "bg-red-500", label: "Critical" },
}

export function VehiclesTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fleet Vehicles</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search vehicles..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Health</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">SoC</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Warnings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">SIM Usage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{vehicle.id}</div>
                      <div className="text-sm text-gray-500">{vehicle.model}</div>
                    </div>
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
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Progress value={vehicle.simDataUsed} className="w-16" />
                      <span className="text-sm">{vehicle.simDataUsed}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{vehicle.location}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
