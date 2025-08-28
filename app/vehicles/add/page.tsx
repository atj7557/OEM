"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

const vehicleTypes = [
  { id: "EVP-2024", name: "EV Pro 2024" },
  { id: "EVC-2024", name: "EV Compact 2024" },
  { id: "EVS-2024", name: "EV SUV 2024" },
  { id: "EVV-2024", name: "EV Van 2024" },
]

const deviceModels = [
  { id: "obd-pro-v3", name: "OBD Pro V3" },
  { id: "obd-compact-v2", name: "OBD Compact V2" },
  { id: "obd-advanced-v4", name: "OBD Advanced V4" },
]

const simCards = [
  { id: "sim-001", name: "SIM-001 (Available)" },
  { id: "sim-002", name: "SIM-002 (Available)" },
  { id: "sim-003", name: "SIM-003 (Available)" },
]

export default function AddVehiclePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="text-gray-600">Register a new vehicle and OBD telemetry device</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleId">Vehicle ID</Label>
                <Input id="vehicleId" placeholder="e.g., BLX57820" />
              </div>
              <div>
                <Label htmlFor="vin">VIN Number</Label>
                <Input id="vin" placeholder="17-character VIN" maxLength={17} pattern="[A-HJ-NPR-Z0-9]{17}" />
                <p className="text-xs text-gray-500 mt-1">VIN must be exactly 17 characters, no spaces</p>
              </div>
            </div>

            <div>
              <Label htmlFor="model">Vehicle Model</Label>
              <Input id="model" placeholder="e.g., EV Pro 2024" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Vehicle Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Manufacturing Year</Label>
                <Input id="year" type="number" placeholder="2024" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                <Input id="batteryCapacity" type="number" placeholder="75" />
              </div>
              <div>
                <Label htmlFor="maxSpeed">Max Speed (km/h)</Label>
                <Input id="maxSpeed" type="number" placeholder="180" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Additional vehicle details..." />
            </div>
          </CardContent>
        </Card>

        {/* OBD Device Information */}
        <Card>
          <CardHeader>
            <CardTitle>OBD Telemetry Device</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deviceId">Device ID</Label>
              <Input id="deviceId" placeholder="e.g., OBD-2024-001" />
            </div>

            <div>
              <Label htmlFor="deviceModel">Device Model</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select device model" />
                </SelectTrigger>
                <SelectContent>
                  {deviceModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmware">Firmware Version</Label>
                <Input id="firmware" placeholder="v2.1.3" />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" placeholder="SN123456789" />
              </div>
            </div>

            <div>
              <Label htmlFor="simCard">SIM Card</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Assign SIM card" />
                </SelectTrigger>
                <SelectContent>
                  {simCards.map((sim) => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="canBaudRate">CAN Bus Baud Rate</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select baud rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="250k">250 kbps</SelectItem>
                  <SelectItem value="500k">500 kbps</SelectItem>
                  <SelectItem value="1m">1 Mbps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reportingInterval">Reporting Interval (seconds)</Label>
              <Input id="reportingInterval" type="number" placeholder="30" />
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Initial Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Initial Location</Label>
                <Input id="location" placeholder="e.g., San Francisco, CA" />
              </div>
              <div>
                <Label htmlFor="odometer">Current Odometer (km)</Label>
                <Input id="odometer" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="soc">Current SoC (%)</Label>
                <Input id="soc" type="number" placeholder="100" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" id="enableAlerts" className="rounded" />
              <Label htmlFor="enableAlerts">Enable automatic alerts and warnings</Label>
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" id="enableOta" className="rounded" />
              <Label htmlFor="enableOta">Enable OTA updates</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/vehicles">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
