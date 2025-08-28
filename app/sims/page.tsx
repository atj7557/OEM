"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Smartphone, Wifi, DollarSign, Activity } from "lucide-react"

interface SIMCard {
  id: string
  iccid: string
  status: "active" | "inactive" | "suspended"
  assignedDevice: string | null
  vehicleId: string | null
  dataUsed: number
  dataLimit: number
  plan: string
  cost: number
  signalStrength: number
  lastActivity: string
}

const mockSIMs: SIMCard[] = [
  {
    id: "SIM-001",
    iccid: "8901260123456789012",
    status: "active",
    assignedDevice: "OBD-2024-001",
    vehicleId: "BLX57819",
    dataUsed: 8.5,
    dataLimit: 10,
    plan: "10GB Monthly",
    cost: 25,
    signalStrength: -65,
    lastActivity: "2 minutes ago",
  },
  {
    id: "SIM-002",
    iccid: "8901260123456789013",
    status: "active",
    assignedDevice: "OBD-2024-002",
    vehicleId: "EV-2024-001",
    dataUsed: 6.2,
    dataLimit: 10,
    plan: "10GB Monthly",
    cost: 25,
    signalStrength: -72,
    lastActivity: "5 minutes ago",
  },
  {
    id: "SIM-003",
    iccid: "8901260123456789014",
    status: "inactive",
    assignedDevice: null,
    vehicleId: null,
    dataUsed: 0,
    dataLimit: 5,
    plan: "5GB Monthly",
    cost: 15,
    signalStrength: 0,
    lastActivity: "Never",
  },
  {
    id: "SIM-004",
    iccid: "8901260123456789015",
    status: "suspended",
    assignedDevice: "OBD-2024-004",
    vehicleId: "EV-2024-004",
    dataUsed: 10,
    dataLimit: 10,
    plan: "10GB Monthly",
    cost: 25,
    signalStrength: -80,
    lastActivity: "1 hour ago",
  },
]

const statusConfig = {
  active: { color: "bg-green-500", label: "Active", badge: "default" },
  inactive: { color: "bg-gray-500", label: "Inactive", badge: "secondary" },
  suspended: { color: "bg-red-500", label: "Suspended", badge: "destructive" },
}

export default function SIMsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SIM Management</h1>
          <p className="text-gray-600">Manage SIM cards and data plans for OBD devices</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add SIM Card
        </Button>
      </div>

      {/* SIM Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSIMs.length}</p>
                <p className="text-sm text-gray-600">Total SIM Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSIMs.filter((s) => s.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active SIMs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Wifi className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">24.7 GB</p>
                <p className="text-sm text-gray-600">Total Data Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">$90</p>
                <p className="text-sm text-gray-600">Monthly Cost</p>
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
              <Input placeholder="Search SIM cards..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Data Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="5gb">5GB Monthly</SelectItem>
                <SelectItem value="10gb">10GB Monthly</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SIM Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>SIM Cards ({mockSIMs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">SIM ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ICCID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Data Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Signal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSIMs.map((sim) => {
                  const config = statusConfig[sim.status]
                  const usagePercentage = (sim.dataUsed / sim.dataLimit) * 100

                  return (
                    <tr key={sim.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{sim.id}</td>
                      <td className="py-3 px-4 font-mono text-sm">{sim.iccid}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${config.color}`} />
                          <Badge variant={config.badge as any} className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {sim.assignedDevice ? (
                          <div>
                            <div className="font-medium">{sim.assignedDevice}</div>
                            <div className="text-sm text-gray-500">{sim.vehicleId}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={usagePercentage} className="w-16" />
                            <span className="text-sm font-medium">
                              {sim.dataUsed}GB / {sim.dataLimit}GB
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{sim.plan}</div>
                          <div className="text-sm text-gray-500">${sim.cost}/month</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {sim.signalStrength > 0 ? (
                          <div>
                            <div className="font-medium">{sim.signalStrength} dBm</div>
                            <div className="text-sm text-gray-500">
                              {sim.signalStrength > -70 ? "Excellent" : sim.signalStrength > -85 ? "Good" : "Poor"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            <span className="text-gray-400">No signal</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">{sim.lastActivity}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                          {sim.status === "active" && (
                            <Button variant="outline" size="sm">
                              Suspend
                            </Button>
                          )}
                          {sim.status === "suspended" && (
                            <Button variant="outline" size="sm">
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
