"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Plus, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listVehicles, listVehiclesType, deleteVehicleType } from "@/lib/api";

interface Vehicle {
  id: number;
  vin: string;
  model: string;
  make: string;
  vehicle_type: number;
  health_status: "Good" | "Warning" | "Critical";
  current_battery_level: number;
  mileage_km: number;
}

interface VehicleType {
  id: number;
  name: string;
}

const healthConfig = {
  Good: { color: "bg-green-500", label: "Good" },
  Warning: { color: "bg-orange-500", label: "Warning" },
  Critical: { color: "bg-red-500", label: "Critical" },
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedHealth, setSelectedHealth] = useState<string>("all");

  // fetch vehicles with filters
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await listVehicles(); // no args
      let filtered = data;
      console.log("filtered", filtered);
      if (searchTerm) {
        filtered = filtered.filter((v: Vehicle) =>
          v.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedType !== "all") {
        filtered = filtered.filter(
          (v: Vehicle) => String(v.vehicle_type) === selectedType
        );
      }
      if (selectedHealth !== "all") {
        filtered = filtered.filter(
          (v: Vehicle) => v.health_status === selectedHealth
        );
      }

      setVehicles(filtered);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch vehicle types
  const fetchVehicleTypes = async () => {
    try {
      const data = await listVehiclesType();
      setVehicleTypes(data);
    } catch (err) {
      console.error("Error fetching vehicle types:", err);
    }
  };

  useEffect(() => {
    fetchVehicleTypes();
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Vehicles</h1>
          <p className="text-gray-600">Manage and monitor your vehicle fleet</p>
        </div>
        <Link href="/vehicles/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by model..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vehicle type filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Health filter */}
          <Select value={selectedHealth} onValueChange={setSelectedHealth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Health Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={fetchVehicles}
            className="bg-gray-700 hover:bg-gray-800"
          >
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet ({vehicles.length} vehicles)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Make
                    </th>
                    {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th> */}
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Health
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      SoC
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Mileage
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      {/* VIN + model */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          className="block"
                        >
                          <div>
                            <div className="font-medium text-blue-600 hover:underline">
                              {vehicle.vin}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehicle.model}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Make */}
                      <td className="py-3 px-4">
                        {vehicle.make || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      {/* Vehicle type */}
                      {/* <td className="py-3 px-4">
                        {vehicleTypes.find((t) => t.id === vehicle.vehicle_type)?.name || "Unknown"}
                      </td> */}

                      {/* Health */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              healthConfig[vehicle.health_status].color
                            }`}
                          />
                          <span className="text-sm">
                            {healthConfig[vehicle.health_status].label}
                          </span>
                        </div>
                      </td>

                      {/* Battery */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={vehicle.current_battery_level}
                            className="w-16"
                          />
                          <span className="text-sm font-medium">
                            {vehicle.current_battery_level}%
                          </span>
                        </div>
                      </td>

                      {/* Mileage */}
                      <td className="py-3 px-4 text-sm">
                        {vehicle.mileage_km.toLocaleString()} km
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/vehicles/${vehicle.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/vehicles/add?id=${vehicle.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this vehicle?"
                                )
                              ) {
                                try {
                                  await deleteVehicleType(vehicle.id); // call API
                                  alert("Vehicle deleted successfully");
                                  fetchVehicles(); // refresh list
                                } catch (err) {
                                  console.error("Delete failed:", err);
                                  alert("Failed to delete vehicle");
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
