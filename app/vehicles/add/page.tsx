// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ArrowLeft, Save, Plus } from "lucide-react";

// import {
//   createOBDDevice,
//   listSIMCards,
//   listVehicles,
//   listVehiclesType,
//   createSIM,
// } from "@/lib/api";

// // shadcn dialog
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";

// const deviceModels = [
//   { id: "obd-pro-v3", name: "OBD Pro V3" },
//   { id: "obd-compact-v2", name: "OBD Compact V2" },
//   { id: "obd-advanced-v4", name: "OBD Advanced V4" },
// ];

// export default function AddVehiclePage() {
//   const router = useRouter();

//   // Vehicle
//   const [vehicleCode, setVehicleCode] = useState("");
//   const [vin, setVin] = useState("");
//   const [model, setModel] = useState("");
//   const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
//   const [year, setYear] = useState<string>("");
//   const [batteryCapacity, setBatteryCapacity] = useState<string>("");
//   const [maxSpeed, setMaxSpeed] = useState<string>("");
//   const [description, setDescription] = useState("");

//   // Vehicle type list
//   const [vehicleTypes, setVehicleTypes] = useState<
//     { id: string; name: string }[]
//   >([]);
//   const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);

//   // Device fields
//   const [deviceId, setDeviceId] = useState("");
//   const [deviceModel, setDeviceModel] = useState<string | undefined>(undefined);
//   const [firmware, setFirmware] = useState("");
//   const [serialNumber, setSerialNumber] = useState("");
//   const [canBaud, setCanBaud] = useState<string | undefined>(undefined);
//   const [reportingInterval, setReportingInterval] = useState<string>("");

//   // Initial config
//   const [location, setLocation] = useState("");
//   const [odometer, setOdometer] = useState<string>("");
//   const [soc, setSoc] = useState<string>("");
//   const [enableAlerts, setEnableAlerts] = useState(false);
//   const [enableOta, setEnableOta] = useState(false);

//   // API selects
//   const [simOptions, setSimOptions] = useState<{ id: string; label: string }[]>(
//     []
//   );
//   const [vehicleOptions, setVehicleOptions] = useState<
//     { id: string; label: string }[]
//   >([]);
//   const [selectedSimPk, setSelectedSimPk] = useState<string | undefined>(
//     undefined
//   );
//   const [selectedVehiclePk, setSelectedVehiclePk] = useState<
//     string | undefined
//   >(undefined);

//   const [loadingSims, setLoadingSims] = useState(false);
//   const [loadingVehicles, setLoadingVehicles] = useState(false);

//   // Submit & error
//   const [submitting, setSubmitting] = useState(false);
//   const [err, setErr] = useState<string>("");

//   // New SIM dialog
//   const [simDialogOpen, setSimDialogOpen] = useState(false);
//   const [simForm, setSimForm] = useState({
//     sim_id: "",
//     iccid: "",
//     plan_name: "",
//     plan_data_limit_gb: "",
//     plan_cost: "",
//     current_cycle_start: "",
//     status: "available",
//   });
//   const [simSubmitting, setSimSubmitting] = useState(false);
//   const [simError, setSimError] = useState<string>("");

//   // Load SIMs
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoadingSims(true);
//         const resp = await listSIMCards();
//         const sims = Array.isArray(resp?.results)
//           ? resp.results
//           : Array.isArray(resp)
//           ? resp
//           : [];
//         const mapped = sims
//           .map((s: any) => {
//             const id = s?.id;
//             const simId = s?.sim_id || s?.iccid || `SIM-${id}`;
//             if (typeof id !== "number" && typeof id !== "string") return null;
//             return { id: String(id), label: simId };
//           })
//           .filter(Boolean) as { id: string; label: string }[];
//         if (mounted) setSimOptions(mapped);
//       } finally {
//         if (mounted) setLoadingSims(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Load vehicle types
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoadingVehicleTypes(true);
//         const resp = await listVehiclesType();
//         const types = Array.isArray(resp?.results)
//           ? resp.results
//           : Array.isArray(resp)
//           ? resp
//           : [];
//         const mapped = types
//           .map((t: any) => {
//             const id = t?.id;
//             const name = t?.name || t?.type_name || `Type ${id}`;
//             if (!id) return null;
//             return { id: String(id), name };
//           })
//           .filter(Boolean) as { id: string; name: string }[];
//         if (mounted) setVehicleTypes(mapped);
//       } finally {
//         if (mounted) setLoadingVehicleTypes(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Load Vehicles
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoadingVehicles(true);
//         const resp = await listVehicles();
//         const vehicles = Array.isArray(resp?.results)
//           ? resp.results
//           : Array.isArray(resp)
//           ? resp
//           : [];
//         const mapped = vehicles
//           .map((v: any) => {
//             const id = v?.id;
//             const label =
//               v?.name ||
//               v?.registration_number ||
//               v?.vin ||
//               v?.external_id ||
//               `Vehicle ${id}`;
//             if (typeof id !== "number" && typeof id !== "string") return null;
//             return { id: String(id), label };
//           })
//           .filter(Boolean) as { id: string; label: string }[];
//         if (mounted) setVehicleOptions(mapped);
//       } finally {
//         if (mounted) setLoadingVehicles(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Map CAN select to integer
//   const canBaudNumber: number | undefined = useMemo(() => {
//     if (canBaud === "250k") return 250000;
//     if (canBaud === "500k") return 500000;
//     if (canBaud === "1m") return 1000000;
//     return undefined;
//   }, [canBaud]);

//   const onSubmit = async () => {
//     setErr("");
//     setSubmitting(true);

//     const payload: any = {
//       device_id: deviceId.trim(),
//     };
//     if (model.trim()) payload.model = model.trim();
//     if (firmware.trim()) payload.firmware_version = firmware.trim();
//     if (serialNumber.trim()) payload.serial_number = serialNumber.trim();
//     if (typeof canBaudNumber === "number")
//       payload.can_baud_rate = canBaudNumber;
//     if (reportingInterval && !Number.isNaN(Number(reportingInterval))) {
//       payload.report_interval_sec = Number(reportingInterval);
//     }
//     if (selectedVehiclePk && !Number.isNaN(Number(selectedVehiclePk))) {
//       payload.vehicle = Number(selectedVehiclePk);
//     }
//     if (selectedSimPk && !Number.isNaN(Number(selectedSimPk))) {
//       payload.sim_card = Number(selectedSimPk);
//     }

//     try {
//       await createOBDDevice(payload);
//       router.push("/vehicles");
//     } catch (e: any) {
//       const message = e?.message || "Failed to create vehicle/device";
//       setErr(message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // New SIM handlers
//   const handleSimField = (key: keyof typeof simForm, value: string) => {
//     setSimForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleCreateSim = async () => {
//     setSimError("");
//     setSimSubmitting(true);

//     try {
//       const payload = {
//         sim_id: simForm.sim_id.trim(), // <-- new field
//         iccid: simForm.iccid.trim(),
//         status: simForm.status || "active",
//         plan_name: simForm.plan_name.trim(),
//         plan_data_limit_gb: parseFloat(simForm.plan_data_limit_gb),
//         plan_cost: parseFloat(simForm.plan_cost),
//         current_data_used_gb: 0.0, // backend expects this
//         current_cycle_start: simForm.current_cycle_start,
//         device: selectedVehiclePk ? Number(selectedVehiclePk) : null, // link if needed
//       };

//       // simple validation
//       if (
//         !payload.sim_id ||
//         !payload.iccid ||
//         !payload.plan_name ||
//         !payload.plan_data_limit_gb ||
//         !payload.plan_cost ||
//         !payload.current_cycle_start
//       ) {
//         setSimError("All required fields must be filled");
//         setSimSubmitting(false);
//         return;
//       }

//       const created = await createSIM(payload);

//       // Add to dropdowncreateSIM
//       if (created?.id) {
//         const newOpt = {
//           id: String(created.id),
//           label: created.sim_id || created.iccid,
//         };
//         setSimOptions((opts) => [newOpt, ...opts]);
//         setSelectedSimPk(String(created.id));
//       }

//       setSimDialogOpen(false);
//     } catch (err: any) {
//       setSimError(err?.message || "Failed to create SIM");
//     } finally {
//       setSimSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Link href="/vehicles">
//           <Button variant="ghost">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Vehicles
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
//           <p className="text-gray-600">
//             Register a new vehicle and OBD telemetry device
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Vehicle Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Vehicle Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {err && (
//               <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
//                 {err}
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="vehicleId">Vehicle ID (label)</Label>
//                 <Input
//                   id="vehicleId"
//                   placeholder="e.g., BLX57820"
//                   value={vehicleCode}
//                   onChange={(e) => setVehicleCode(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="vin">VIN Number</Label>
//                 <Input
//                   id="vin"
//                   placeholder="17-character VIN"
//                   maxLength={17}
//                   value={vin}
//                   onChange={(e) => setVin(e.target.value.toUpperCase())}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="model">Vehicle Model</Label>
//               <Input
//                 id="model"
//                 placeholder="e.g., EV Pro 2024"
//                 value={model}
//                 onChange={(e) => setModel(e.target.value)}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Vehicle Type</Label>
//                 <Select value={vehicleType} onValueChange={setVehicleType}>
//                   <SelectTrigger>
//                     <SelectValue
//                       placeholder={
//                         loadingVehicleTypes ? "Loading types..." : "Select type"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {vehicleTypes.map((type) => (
//                       <SelectItem key={type.id} value={type.id}>
//                         {type.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="year">Manufacturing Year</Label>
//                 <Input
//                   id="year"
//                   type="number"
//                   placeholder="2024"
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
//                 <Input
//                   id="batteryCapacity"
//                   type="number"
//                   placeholder="75"
//                   value={batteryCapacity}
//                   onChange={(e) => setBatteryCapacity(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="maxSpeed">Max Speed (km/h)</Label>
//                 <Input
//                   id="maxSpeed"
//                   type="number"
//                   placeholder="180"
//                   value={maxSpeed}
//                   onChange={(e) => setMaxSpeed(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Additional vehicle details..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label>Link to Existing Vehicle</Label>
//               <Select
//                 value={selectedVehiclePk}
//                 onValueChange={setSelectedVehiclePk}
//                 disabled={loadingVehicles || vehicleOptions.length === 0}
//               >
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={
//                       loadingVehicles ? "Loading vehicles..." : "Select vehicle"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {vehicleOptions.map((v) => (
//                     <SelectItem key={v.id} value={v.id}>
//                       {v.label} (id: {v.id})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* OBD Device Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle>OBD Telemetry Device</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="deviceId">Device ID *</Label>
//               <Input
//                 id="deviceId"
//                 placeholder="e.g., OBD-2024-001"
//                 value={deviceId}
//                 onChange={(e) => setDeviceId(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <Label>Device Model</Label>
//               <Select value={deviceModel} onValueChange={setDeviceModel}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select device model" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {deviceModels.map((m) => (
//                     <SelectItem key={m.id} value={m.id}>
//                       {m.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="firmware">Firmware Version</Label>
//                 <Input
//                   id="firmware"
//                   placeholder="v2.1.3"
//                   value={firmware}
//                   onChange={(e) => setFirmware(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="serialNumber">Serial Number</Label>
//                 <Input
//                   id="serialNumber"
//                   placeholder="SN123456789"
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex items-end gap-2">
//               <div className="flex-1">
//                 <Label>SIM Card</Label>
//                 <Select
//                   value={selectedSimPk}
//                   onValueChange={setSelectedSimPk}
//                   disabled={loadingSims}
//                 >
//                   <SelectTrigger>
//                     <SelectValue
//                       placeholder={
//                         loadingSims ? "Loading SIMs..." : "Assign SIM card"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {simOptions.map((sim) => (
//                       <SelectItem key={sim.id} value={sim.id}>
//                         {sim.label} (id: {sim.id})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* New SIM Button */}
//               <Dialog open={simDialogOpen} onOpenChange={setSimDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button type="button" variant="outline" className="mt-6">
//                     <Plus className="w-4 h-4 mr-1" />
//                     New SIM
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Create New SIM</DialogTitle>
//                     <DialogDescription>
//                       Enter required SIM details
//                     </DialogDescription>
//                   </DialogHeader>

//                   {simError && (
//                     <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
//                       {simError}
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="md:col-span-2">
//                       <Label htmlFor="iccid">ICCID *</Label>
//                       <Input
//                         id="iccid"
//                         value={simForm.iccid}
//                         onChange={(e) =>
//                           handleSimField("iccid", e.target.value)
//                         }
//                         placeholder="e.g., 8991..."
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="sim_id">SIM ID *</Label>
//                       <Input
//                         id="sim_id"
//                         value={simForm.sim_id || ""}
//                         onChange={(e) =>
//                           handleSimField("sim_id", e.target.value)
//                         }
//                         placeholder="e.g., SIM-V4-005"
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="plan_name">Plan Name *</Label>
//                       <Input
//                         id="plan_name"
//                         value={simForm.plan_name}
//                         onChange={(e) =>
//                           handleSimField("plan_name", e.target.value)
//                         }
//                         placeholder="e.g., Global 1GB"
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="plan_data_limit_gb">
//                         Plan Data Limit (GB) *
//                       </Label>
//                       <Input
//                         id="plan_data_limit_gb"
//                         type="number"
//                         value={simForm.plan_data_limit_gb}
//                         onChange={(e) =>
//                           handleSimField("plan_data_limit_gb", e.target.value)
//                         }
//                         placeholder="e.g., 5"
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="plan_cost">Plan Cost *</Label>
//                       <Input
//                         id="plan_cost"
//                         value={simForm.plan_cost}
//                         onChange={(e) =>
//                           handleSimField("plan_cost", e.target.value)
//                         }
//                         placeholder="e.g., 9.99"
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="current_cycle_start">
//                         Current Cycle Start *
//                       </Label>
//                       <Input
//                         id="current_cycle_start"
//                         type="date"
//                         value={simForm.current_cycle_start}
//                         onChange={(e) =>
//                           handleSimField("current_cycle_start", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <Label htmlFor="status">Status (optional)</Label>
//                       <Input
//                         id="status"
//                         value={simForm.status}
//                         onChange={(e) =>
//                           handleSimField("status", e.target.value)
//                         }
//                         placeholder="available / active / suspended"
//                       />
//                     </div>
//                   </div>

//                   <DialogFooter className="mt-4">
//                     <DialogClose asChild>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         disabled={simSubmitting}
//                       >
//                         Cancel
//                       </Button>
//                     </DialogClose>
//                     <Button
//                       type="button"
//                       onClick={handleCreateSim}
//                       disabled={simSubmitting}
//                     >
//                       {simSubmitting ? "Creating…" : "Create SIM"}
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             <div>
//               <Label>CAN Bus Baud Rate</Label>
//               <Select value={canBaud} onValueChange={setCanBaud}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select baud rate" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="250k">250 kbps</SelectItem>
//                   <SelectItem value="500k">500 kbps</SelectItem>
//                   <SelectItem value="1m">1 Mbps</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="reportingInterval">
//                 Reporting Interval (seconds)
//               </Label>
//               <Input
//                 id="reportingInterval"
//                 type="number"
//                 placeholder="30"
//                 value={reportingInterval}
//                 onChange={(e) => setReportingInterval(e.target.value)}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Configuration */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Initial Configuration</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <Label htmlFor="location">Initial Location</Label>
//                 <Input
//                   id="location"
//                   placeholder="e.g., San Francisco, CA"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="odometer">Current Odometer (km)</Label>
//                 <Input
//                   id="odometer"
//                   type="number"
//                   placeholder="0"
//                   value={odometer}
//                   onChange={(e) => setOdometer(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="soc">Current SoC (%)</Label>
//                 <Input
//                   id="soc"
//                   type="number"
//                   placeholder="100"
//                   value={soc}
//                   onChange={(e) => setSoc(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <input
//                 type="checkbox"
//                 id="enableAlerts"
//                 className="rounded"
//                 checked={enableAlerts}
//                 onChange={(e) => setEnableAlerts(e.target.checked)}
//               />
//               <Label htmlFor="enableAlerts">Enable automatic alerts</Label>
//             </div>

//             <div className="flex items-center gap-4">
//               <input
//                 type="checkbox"
//                 id="enableOta"
//                 className="rounded"
//                 checked={enableOta}
//                 onChange={(e) => setEnableOta(e.target.checked)}
//               />
//               <Label htmlFor="enableOta">Enable OTA updates</Label>
//             </div>

//             <div className="flex justify-end gap-4 pt-4">
//               <Link href="/vehicles">
//                 <Button variant="outline" disabled={submitting}>
//                   Cancel
//                 </Button>
//               </Link>
//               <Button
//                 className="bg-blue-600 hover:bg-blue-700"
//                 onClick={onSubmit}
//                 disabled={submitting}
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 {submitting ? "Saving…" : "Add Vehicle"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicle, listVehiclesType } from "@/lib/api";

export default function AddVehiclePage() {
  const router = useRouter();

  // State for form fields
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleType, setVehicleType] = useState<string | undefined>(undefined);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [currentBattery, setCurrentBattery] = useState("");
  const [mileage, setMileage] = useState("");
  const [warranty, setWarranty] = useState("");
  const [status, setStatus] = useState("available");
  const [color, setColor] = useState("");
  const [seating, setSeating] = useState("");
  const [fuelType, setFuelType] = useState("Electric");
  const [transmission, setTransmission] = useState("Automatic");
  const [efficiency, setEfficiency] = useState("");

  // Vehicle Types
  const [vehicleTypes, setVehicleTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Error & Loading
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load vehicle types
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTypes(true);
        const resp = await listVehiclesType();
        const types = Array.isArray(resp?.results)
          ? resp.results
          : Array.isArray(resp)
          ? resp
          : [];
        const mapped = types.map((t: any) => ({
          id: String(t.id),
          name: t.name || `Type ${t.id}`,
        }));
        if (mounted) setVehicleTypes(mapped);
      } finally {
        if (mounted) setLoadingTypes(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle submit
  const onSubmit = async () => {
    setErr("");
    setSubmitting(true);

    const payload = {
      vin,
      fleet_operator: 1, // assuming static for now
      license_plate: licensePlate,
      vehicle_type: vehicleType ? Number(vehicleType) : undefined,
      alerts_enabled: true,
      ota_enabled: true,
      firmware_versions: { main_os: "v4.2.0" },
      make,
      model,
      year: year ? Number(year) : undefined,
      battery_capacity_kwh: parseFloat(batteryCapacity),
      current_battery_level: parseFloat(currentBattery),
      mileage_km: mileage ? Number(mileage) : undefined,
      warranty_expiry_date: warranty,
      status,
      color,
      seating_capacity: seating ? Number(seating) : undefined,
      fuel_type: fuelType,
      transmission_type: transmission,
      efficiency_km_per_kwh: parseFloat(efficiency),
    };

    try {
      await createVehicle(payload);
      router.push("/vehicles");
    } catch (e: any) {
      setErr(e?.message || "Failed to add vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vehicles
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Vehicle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {err && <div className="text-red-600">{err}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>VIN *</Label>
              <Input value={vin} onChange={(e) => setVin(e.target.value)} />
            </div>
            <div>
              <Label>License Plate *</Label>
              <Input
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Type *</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingTypes ? "Loading types..." : "Select type"
                    }
                  />
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
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Make *</Label>
              <Input value={make} onChange={(e) => setMake(e.target.value)} />
            </div>
            <div>
              <Label>Model *</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>
              <Label>Warranty Expiry</Label>
              <Input
                type="date"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Battery Capacity (kWh)</Label>
              <Input
                type="number"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(e.target.value)}
              />
            </div>
            <div>
              <Label>Current Battery Level (%)</Label>
              <Input
                type="number"
                value={currentBattery}
                onChange={(e) => setCurrentBattery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mileage (km)</Label>
              <Input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            <div>
              <Label>Efficiency (km/kWh)</Label>
              <Input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Color</Label>
              <Input value={color} onChange={(e) => setColor(e.target.value)} />
            </div>
            <div>
              <Label>Seating Capacity</Label>
              <Input
                type="number"
                value={seating}
                onChange={(e) => setSeating(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fuel Type</Label>
              <Input
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              />
            </div>
            <div>
              <Label>Transmission</Label>
              <Input
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/vehicles">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={onSubmit} disabled={submitting}>
              <Save className="w-4 h-4 mr-2" />
              {submitting ? "Saving…" : "Add Vehicle"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
