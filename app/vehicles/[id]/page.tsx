"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TelemetryWidget } from "@/components/telemetry-widget";
import {
  ArrowLeft,
  Battery,
  Thermometer,
  Zap,
  MapPin,
  RotateCcw,
  Play,
} from "lucide-react";

import { getVehicle } from "@/lib/api"; // 👈 your API call

interface Vehicle {
  id: number;
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  battery_capacity_kwh: number;
  current_battery_level: number;
  mileage_km: number;
  warranty_expiry_date: string;
  status: string;
  color: string;
  seating_capacity: number;
  fuel_type: string;
  transmission_type: string;
  latitude: number;
  longitude: number;
  efficiency_km_per_kwh: number;
  health_status: string;
  speed_kph: number;
  online_status: string;
  vehicle_type: string;
}

export default function VehicleDetailsPage() {
  const params = useParams();
  const id = Number(params?.id);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getVehicle(id); // 👈 response has { vehicle, latest_obd, recent_alerts }
        setVehicle(res.vehicle); // ✅ only take `vehicle`
      } catch (err) {
        console.error("Error fetching vehicle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading vehicle details...</p>;
  if (!vehicle) return <p>Vehicle not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
            <Badge variant="outline" className="text-xs">
              {vehicle.status}
            </Badge>
          </div>
          <p className="text-gray-600">
            VIN: {vehicle.vin} • Plate: {vehicle.license_plate}
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Remote Diagnostics
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reboot ECU
          </Button>
        </div> */}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Battery className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">
                {vehicle.current_battery_level}%
              </p>
              <p className="text-sm text-gray-600">Battery</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{vehicle.health_status}</p>
              <p className="text-sm text-gray-600">Health</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{vehicle.speed_kph}</p>
              <p className="text-sm text-gray-600">Speed (km/h)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-lg font-bold">
                {vehicle.mileage_km.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Odometer (km)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Vehicle Info</TabsTrigger>
          {/* <TabsTrigger value="telemetry">Telemetry</TabsTrigger> */}
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Make: {vehicle.make}</p>
              <p>Model: {vehicle.model}</p>
              <p>Type: {vehicle.vehicle_type}</p>
              <p>Year: {vehicle.year}</p>
              <p>Color: {vehicle.color}</p>
              <p>Fuel: {vehicle.fuel_type}</p>
              <p>Transmission: {vehicle.transmission_type}</p>
              <p>
                Warranty Expiry:{" "}
                {new Date(vehicle.warranty_expiry_date).toLocaleDateString()}
              </p>
              <p>Efficiency: {vehicle.efficiency_km_per_kwh} km/kWh</p>
              <p>Seating: {vehicle.seating_capacity}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="telemetry">
          <Card>
            <CardHeader>
              <CardTitle>Live Telemetry</CardTitle>
            </CardHeader>
            <CardContent>
              <TelemetryWidget
                selectedDeviceId={vehicle.id.toString()}
                devices={[vehicle]}
                loading={false}
                error={""}
              />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
