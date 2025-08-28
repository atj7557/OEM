"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const kpis = [
  {
    label: "Vehicles Online",
    value: "847",
    total: "892",
    percentage: 95,
    trend: "up",
    change: "+2.3%",
  },
  {
    label: "Critical Alerts",
    value: "3",
    total: null,
    percentage: null,
    trend: "down",
    change: "-1",
  },
  {
    label: "Average SoC",
    value: "73%",
    total: null,
    percentage: 73,
    trend: "up",
    change: "+5.2%",
  },
  {
    label: "Maintenance Tickets",
    value: "12",
    total: null,
    percentage: null,
    trend: "stable",
    change: "0",
  },
]

export function FleetKPIBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                    {kpi.total && <span className="text-sm text-gray-500">/{kpi.total}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {kpi.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                {kpi.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                {kpi.trend === "stable" && <Minus className="w-4 h-4 text-gray-400" />}
                <Badge
                  variant={kpi.trend === "up" ? "default" : kpi.trend === "down" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {kpi.change}
                </Badge>
              </div>
            </div>
            {kpi.percentage && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${kpi.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
