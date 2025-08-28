"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const socData = [
  { time: "00:00", soc: 85 },
  { time: "04:00", soc: 78 },
  { time: "08:00", soc: 65 },
  { time: "12:00", soc: 45 },
  { time: "16:00", soc: 72 },
  { time: "20:00", soc: 89 },
]

const efficiencyData = [
  { vehicle: "EV Pro", efficiency: 16.8 },
  { vehicle: "EV Compact", efficiency: 14.2 },
  { vehicle: "EV SUV", efficiency: 19.5 },
  { vehicle: "EV Van", efficiency: 22.1 },
]

const alertsData = [
  { name: "Battery", value: 35, color: "#ef4444" },
  { name: "TPMS", value: 25, color: "#f97316" },
  { name: "Charging", value: 20, color: "#eab308" },
  { name: "Motor", value: 15, color: "#22c55e" },
  { name: "Other", value: 5, color: "#6b7280" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive fleet performance analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247,892 km</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Energy Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,456 kWh</div>
            <p className="text-xs text-green-600">-3.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17.2 kWh/100km</div>
            <p className="text-xs text-green-600">+2.1% improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-green-600">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet SoC Trend (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                soc: {
                  label: "State of Charge",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={socData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="soc" stroke="var(--color-soc)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Efficiency by Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: {
                  label: "Efficiency (kWh/100km)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="efficiency" fill="var(--color-efficiency)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {alertsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Speed</span>
                <span className="text-lg font-bold">52.3 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Max Speed Recorded</span>
                <span className="text-lg font-bold">127 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Charging Sessions</span>
                <span className="text-lg font-bold">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Regenerative Energy</span>
                <span className="text-lg font-bold">12,456 kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
