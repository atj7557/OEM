"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Car,
  Settings,
  AlertTriangle,
  Wrench,
  Smartphone,
  Download,
  BarChart3,
  Home,
  Search,
  Plus,
  List,
  FileText,
  Clock,
  History,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "Analytics", icon: BarChart3, url: "/analytics" },
    ],
  },
  {
    title: "Fleet Management",
    items: [
      { title: "Vehicles", icon: Car, url: "/vehicles" },
      { title: "Vehicle Types", icon: List, url: "/vehicle-types" },
      { title: "Add Vehicle", icon: Plus, url: "/vehicles/add" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { title: "Alerts & Warnings", icon: AlertTriangle, url: "/alerts" },
      { title: "Create Warning", icon: FileText, url: "/alerts/create" },
    ],
  },
  {
    title: "Maintenance",
    items: [
      { title: "Overview", icon: Wrench, url: "/maintenance" },
      { title: "Scheduled", icon: Clock, url: "/maintenance/scheduled" },
      { title: "History", icon: History, url: "/maintenance/history" },
    ],
  },
  {
    title: "Connectivity",
    items: [
      { title: "SIM Management", icon: Smartphone, url: "/sims" },
      { title: "OTA Updates", icon: Download, url: "/ota" },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", icon: Settings, url: "/settings" }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">OEM Diagnostics</h2>
            <p className="text-xs text-gray-500">Fleet Management</p>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search vehicles..." className="pl-10" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
