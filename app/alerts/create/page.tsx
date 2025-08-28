"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

export default function CreateWarningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/alerts">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Alerts
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Warning Rule</h1>
          <p className="text-gray-600">Define conditions for automatic alert generation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Warning Rule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input id="ruleName" placeholder="e.g., Battery Temperature Critical" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe when this warning should trigger..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="system">System Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="battery">Battery Management</SelectItem>
                    <SelectItem value="motor">Motor Control</SelectItem>
                    <SelectItem value="charging">Charging System</SelectItem>
                    <SelectItem value="tpms">TPMS</SelectItem>
                    <SelectItem value="thermal">Thermal Management</SelectItem>
                    <SelectItem value="safety">Safety Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="vehicleTypes">Apply to Vehicle Types</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicle Types</SelectItem>
                  <SelectItem value="sedan">Sedan Only</SelectItem>
                  <SelectItem value="suv">SUV Only</SelectItem>
                  <SelectItem value="hatchback">Hatchback Only</SelectItem>
                  <SelectItem value="van">Van Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Warning Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Condition 1</h4>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battery_temp">Battery Temperature</SelectItem>
                      <SelectItem value="motor_temp">Motor Temperature</SelectItem>
                      <SelectItem value="soc">State of Charge</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="voltage">Battery Voltage</SelectItem>
                      <SelectItem value="current">Battery Current</SelectItem>
                      <SelectItem value="tire_pressure">Tire Pressure</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">Greater than</SelectItem>
                      <SelectItem value="lt">Less than</SelectItem>
                      <SelectItem value="eq">Equal to</SelectItem>
                      <SelectItem value="gte">Greater than or equal</SelectItem>
                      <SelectItem value="lte">Less than or equal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Value" />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>

            <div>
              <Label htmlFor="logic">Condition Logic</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select logic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">All conditions must be true (AND)</SelectItem>
                  <SelectItem value="or">Any condition can be true (OR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Trigger Duration (seconds)</Label>
              <Input id="duration" type="number" placeholder="30" />
              <p className="text-xs text-gray-500 mt-1">How long the condition must persist before triggering</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notification">Notification Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard Alert</SelectItem>
                    <SelectItem value="email">Email Notification</SelectItem>
                    <SelectItem value="sms">SMS Alert</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="all">All Methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cooldown">Cooldown Period (minutes)</Label>
                <Input id="cooldown" type="number" placeholder="60" />
              </div>
            </div>

            <div>
              <Label htmlFor="recipients">Alert Recipients</Label>
              <Input id="recipients" placeholder="admin@company.com, support@company.com" />
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" id="autoResolve" className="rounded" />
              <Label htmlFor="autoResolve">Auto-resolve when conditions are no longer met</Label>
            </div>

            <div className="flex items-center gap-4">
              <input type="checkbox" id="enabled" className="rounded" defaultChecked />
              <Label htmlFor="enabled">Enable this warning rule</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/alerts">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Create Warning Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
