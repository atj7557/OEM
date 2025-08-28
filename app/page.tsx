"use client"

import { Suspense } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { FleetKPIBar } from "../components/fleet-kpi-bar"
import { TelemetryWidget } from "../components/telemetry-widget"
import { AlertsTimeline } from "../components/alerts-timeline"
import { VehiclesTable } from "../components/vehicles-table"
import { Separator } from "@/components/ui/separator"
import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function DashboardLoading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1" />
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-50">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-gray-200 rounded animate-pulse" />
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">Fleet Dashboard</h1>
            <p className="text-sm text-gray-500">Real-time diagnostics and fleet management</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">3</Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
              <p className="text-gray-600">Real-time diagnostics and fleet management</p>
            </div>

            {/* Fleet KPIs */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h2>
              <FleetKPIBar />
            </section>

            {/* Real-time Telemetry */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Telemetry - Vehicle BLX57819</h2>
              <TelemetryWidget />
            </section>

            {/* Alerts and Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AlertsTimeline />
              </div>
              <div className="lg:col-span-2">
                <VehiclesTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
