"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Battery, Thermometer, Gauge, Zap, MapPin } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TelemetryData {
  vehicleId: string
  soc: number
  speed: number
  temperature: {
    battery: number
    inverter: number
    cabin: number
    ambient: number
  }
  power: {
    consumption: number
    regen: number
  }
  location: {
    lat: number
    lng: number
    address: string
  }
  lastUpdate: string
}

const mockData: TelemetryData = {
  vehicleId: "BLX57819",
  soc: 73,
  speed: 65,
  temperature: {
    battery: 32,
    inverter: 45,
    cabin: 22,
    ambient: 18,
  },
  power: {
    consumption: 18.5,
    regen: 2.3,
  },
  location: {
    lat: 37.7749,
    lng: -122.4194,
    address: "San Francisco, CA",
  },
  lastUpdate: "2 seconds ago",
}

export function TelemetryWidget({ data = mockData }: { data?: TelemetryData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Battery SoC */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">State of Charge</CardTitle>
          <Battery className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.soc}%</div>
          <Progress value={data.soc} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">Estimated range: {Math.round(data.soc * 4.2)} km</p>
        </CardContent>
      </Card>

      {/* Speed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
          <Gauge className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.speed} km/h</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Max: 85
            </Badge>
            <Badge variant="outline" className="text-xs">
              Avg: 52
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Power */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Power Flow</CardTitle>
          <Zap className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-red-600">Consumption</span>
              <span className="font-medium">{data.power.consumption} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-600">Regeneration</span>
              <span className="font-medium">{data.power.regen} kW</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temperatures</CardTitle>
          <Thermometer className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Battery</span>
              <span className="font-medium">{data.temperature.battery}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Inverter</span>
              <span className="font-medium">{data.temperature.inverter}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Cabin</span>
              <span className="font-medium">{data.temperature.cabin}°C</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location</CardTitle>
          <MapPin className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">{data.location.address}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}
          </div>
          <Badge variant="secondary" className="mt-2 text-xs">
            Updated {data.lastUpdate}
          </Badge>
        </CardContent>
      </Card>

      {/* Efficiency */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
          <Zap className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">16.8</div>
          <p className="text-xs text-muted-foreground">kWh/100km</p>
          <Badge variant="default" className="mt-2 text-xs">
            Target: 18.5 kWh/100km
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
