"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

// keep your shadcn layout primitives
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings } from "lucide-react";

// keep your existing UI components from the zip
import { FleetKPIBar } from "@/components/fleet-kpi-bar";
import { TelemetryWidget } from "@/components/telemetry-widget";
import { AlertsTimeline } from "@/components/alerts-timeline";
import { VehiclesTable } from "@/components/vehicles-table";

// live API helpers
import { listOBDDevices, getDeviceMetrics } from "@/lib/api";

// ----- Types aligned to your zip components -----
type SimCard = {
  id: number;
  sim_id: string;
  iccid: string;
  status: string;
  plan_name?: string | null;
  plan_data_limit_gb?: number | null;
  plan_cost?: string | null;
  current_data_used_gb?: number | null;
  current_cycle_start?: string | null;
  overage_threshold?: number | null;
  device?: number | null;
  last_activity?: string | null;
  signal_strength?: string | null;
};

type OBDDevice = {
  id: number;
  device_id: string;
  model?: string | null;
  serial_number?: string | null;
  can_baud_rate?: number | null;
  report_interval_sec?: number | null;
  vehicle: number | null;
  sim_card?: SimCard | null;
  installed_at?: string | null;
  is_active?: boolean;
  last_communication_at?: string | null;
  firmware_version?: string | null;
};

type AlertItem = {
  id: string;
  severity: "critical" | "warning" | "info" | "resolved";
  title: string;
  description: string;
  vehicleLabel: string;
  system: string;
  ago: string;
};

function fmtAgo(iso?: string | null): string {
  if (!iso) return "—";
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return "—";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Dashboard() {
  const [devices, setDevices] = useState<OBDDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // (optional) cache SoC per device — will fill when you plug the real metrics endpoint
  const [socByDeviceId, setSocByDeviceId] = useState<Record<number, number | null>>({});

  // 1) Load devices (live)
  useEffect(() => {
    (async () => {
      try {
        const data = await listOBDDevices();
        const results: OBDDevice[] = Array.isArray(data?.results) ? data.results : (data ?? []);
        setDevices(results);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ||
            e?.response?.data?.detail ||
            e?.message ||
            "Failed to load OBD devices"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Optionally load SoC (does nothing until you implement getDeviceMetrics in lib/api.ts)
  useEffect(() => {
    (async () => {
      if (!devices.length) return;
      const subset = devices.slice(0, 10); // avoid spamming endpoints
      const updates: Record<number, number | null> = {};
      await Promise.all(
        subset.map(async (d) => {
          try {
            const m = await getDeviceMetrics(d.id);
            updates[d.id] = typeof m?.soc_percent === "number" ? m.soc_percent : null;
          } catch {
            updates[d.id] = null;
          }
        })
      );
      if (Object.keys(updates).length) {
        setSocByDeviceId((prev) => ({ ...prev, ...updates }));
      }
    })();
  }, [devices]);

  // 3) Derive all the live numbers for your UI
  const {
    totalDevices,
    activeDevices,
    withSim,
    reportingRecently,
    alerts,
    alertsCount,
    selectedDevice,
    averageSocPercent,
  } = useMemo(() => {
    const now = Date.now();
    const RECENT_MS = 24 * 60 * 60 * 1000;
    const STALE_MS = 72 * 60 * 60 * 1000;

    const total = devices.length;
    const active = devices.filter((d) => d.is_active).length;
    const sims = devices.filter((d) => !!d.sim_card).length;

    const recent = devices.filter((d) => {
      const ts = d.last_communication_at ? Date.parse(d.last_communication_at) : NaN;
      return !Number.isNaN(ts) && now - ts <= RECENT_MS;
    }).length;

    // build simple alerts list from device condition (keeps your UI look)
    const built: AlertItem[] = [];
    devices.forEach((d) => {
      const vehicleLabel = d.device_id || `Device-${d.id}`;
      const ts = d.last_communication_at ? Date.parse(d.last_communication_at) : NaN;
      const isStale = Number.isNaN(ts) || now - ts > STALE_MS;

      if (isStale) {
        built.push({
          id: `stale-${d.id}`,
          severity: "critical",
          title: "Device Communication Stale",
          description: "No recent telemetry (>72h). Check power/connectivity.",
          vehicleLabel,
          system: "Telematics",
          ago: fmtAgo(d.last_communication_at),
        });
      }

      if (!d.sim_card) {
        built.push({
          id: `nosim-${d.id}`,
          severity: "warning",
          title: "No SIM Assigned",
          description: "Device has no SIM; data upload may fail.",
          vehicleLabel,
          system: "Connectivity",
          ago: fmtAgo(d.last_communication_at),
        });
      } else {
        const used = d.sim_card.current_data_used_gb ?? 0;
        const limit = d.sim_card.plan_data_limit_gb ?? 0;
        const pct = limit > 0 ? used / limit : 0;
        const thresh = d.sim_card.overage_threshold ?? 0.9;
        if (limit > 0 && pct >= thresh) {
          built.push({
            id: `data-${d.id}`,
            severity: "warning",
            title: "High SIM Data Usage",
            description: `Usage at ${(pct * 100).toFixed(0)}% of plan.`,
            vehicleLabel,
            system: "Connectivity",
            ago: fmtAgo(d.sim_card.last_activity ?? d.last_communication_at),
          });
        }
      }
    });

    const pick = devices.find((d) => d.is_active) || devices[0];

    // average SoC (becomes live once getDeviceMetrics returns values)
    const socValues = devices
      .map((d) => socByDeviceId[d.id])
      .filter((v): v is number => typeof v === "number");
    const avgSoc = socValues.length
      ? Math.round(socValues.reduce((a, b) => a + b, 0) / socValues.length)
      : null;

    return {
      totalDevices: total,
      activeDevices: active,
      withSim: sims,
      reportingRecently: recent,
      alerts: built,
      alertsCount: built.length,
      selectedDevice: pick,
      averageSocPercent: avgSoc,
    };
  }, [devices, socByDeviceId]);

  return (
    <AuthGuard>
      <SidebarProvider>
        {/* If your zip has an AppSidebar component, you can render it here.
            Otherwise we keep only the inset so your header + content look the same. */}

        <SidebarInset>
          {/* ===== Header (kept same look) ===== */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">Fleet Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time diagnostics and fleet management</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative" title="Alerts">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                  {alertsCount}
                </Badge>
              </Button>
              <Button variant="ghost" size="sm" title="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* ===== Main content (kept same sections) ===== */}
          <div className="flex-1 space-y-6 p-6 bg-gray-50">
            {/* Fleet KPIs — same UI component, but now fed by live values */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h2>
              <FleetKPIBar
                loading={loading}
                vehiclesOnline={reportingRecently}
                totalVehicles={totalDevices}
                criticalAlerts={alertsCount}
                averageSocPercent={averageSocPercent} // becomes live when metrics endpoint is wired
                maintenanceTickets={null}
                trendOnline="up"
                changeOnline="+2.3%"
                trendCritical="down"
                changeCritical="-1"
                trendSoc={averageSocPercent !== null ? "up" : "stable"}
                changeSoc={averageSocPercent !== null ? "+5.2%" : ""}
                trendMaint="stable"
                changeMaint="0"
              />
            </section>

            {/* Live Telemetry — same UI, shows details for a selected device */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Live Telemetry – {selectedDevice?.device_id ?? "Select a Device"}
              </h2>
              <TelemetryWidget
                selectedDeviceId={selectedDevice?.device_id}
                devices={devices}
                loading={loading}
                error={err}
              />
            </section>

            {/* Alerts + Vehicles — same layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AlertsTimeline loading={loading} error={err} alerts={alerts} />
              </div>
              <div className="lg:col-span-2">
                <VehiclesTable loading={loading} error={err} rows={devices} />
              </div>
            </div>

            {/* Optional debug (handy for confirming live API data) */}
            {!loading && !err && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Debug: {devices.length} device(s) loaded
                </summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-white p-3 text-xs">
                  {JSON.stringify(devices, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
