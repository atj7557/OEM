// app/vehicles/add/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  listVehiclesType,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from "@/lib/api";

type VehicleType = {
  id: number;
  code: string;
  name: string;
  category: string;
  drivetrain: string;
  battery_capacity_kwh: number;
  motor_power_kw: number;
  wltp_range_km: number;
  status: string;
  description?: string;
};

export default function Page() {
  const [items, setItems] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<VehicleType>>({
    code: "",
    name: "",
    category: "",
    drivetrain: "",
    battery_capacity_kwh: 0,
    motor_power_kw: 0,
    wltp_range_km: 0,
    status: "active",
    description: "",
  });

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<VehicleType>>({});

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search/filter
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items1, setItems1] = useState<any[]>([]);
const [rowsPerPage] = useState(10);
const [totalCount, setTotalCount] = useState(0);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState("");

  // const rowsPerPage = 10;
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        String(t.id).includes(q)
    );
  }, [items, query]);

const fetchPage = async (pageNum: number) => {
  setLoading(true);
  setError("");
  try {
    const resp = await listVehiclesType(pageNum);

    const rows: any[] = Array.isArray(resp?.results)
      ? resp.results
      : Array.isArray(resp)
      ? resp
      : [];

    setItems(
      rows.map((r) => ({
        id: r.id,
        code: r.code ?? "",
        name: r.name ?? `Type ${r.id}`,
        category: r.category ?? "",
        drivetrain: r.drivetrain ?? "",
        battery_capacity_kwh: r.battery_capacity_kwh ?? 0,
        motor_power_kw: r.motor_power_kw ?? 0,
        wltp_range_km: r.wltp_range_km ?? 0,
        status: r.status ?? "inactive",
        description: r.description ?? "",
      }))
    );

    setTotalCount(resp.count ?? rows.length); // backend usually returns count
    setPage(pageNum);
  } catch (e: any) {
    setError(e?.message || "Failed to load vehicle types");
  } finally {
    setLoading(false);
  }
};

// load first page on mount
useEffect(() => {
  fetchPage(1);
}, []);


  // useEffect(() => {
  //   refresh();
  // }, []);

  const openEdit = (row: VehicleType) => {
    setEditId(row.id);
    setEditForm(row);
    setEditOpen(true);
  };

  const openDelete = (row: VehicleType) => {
    setDeleteId(row.id);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError("");
    try {
      if (!createForm.name?.trim() || !createForm.code?.trim()) {
        setError("Code and Name are required.");
        setCreating(false);
        return;
      }
      const created = await createVehicleType(createForm);
      const newItem: VehicleType = {
        ...(createForm as VehicleType),
        id: created?.id ?? Math.random().toString(36).slice(2),
      };
      setItems((prev) => [newItem, ...prev]);
      setCreateOpen(false);
      setCreateForm({
        code: "",
        name: "",
        category: "",
        drivetrain: "",
        battery_capacity_kwh: 0,
        motor_power_kw: 0,
        wltp_range_km: 0,
        status: "active",
        description: "",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to create vehicle type");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (editId == null) return;
    setUpdating(true);
    setError("");
    try {
      if (!editForm.name?.trim() || !editForm.code?.trim()) {
        setError("Code and Name are required.");
        setUpdating(false);
        return;
      }
      const updated = await updateVehicleType(Number(editId), editForm); // 👈 ensure number
      setItems((prev) =>
        prev.map((it) =>
          it.id === Number(editId)
            ? { ...it, ...editForm, id: updated?.id ?? Number(editId) }
            : it
        )
      );
      setEditOpen(false);
      setEditId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to update vehicle type");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    setError("");
    try {
      await deleteVehicleType(Number(deleteId)); // 👈 ensure number
      setItems((prev) => prev.filter((it) => it.id !== Number(deleteId)));
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete vehicle type");
    } finally {
      setDeleting(false);
    }
  };
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, page]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-gray-600">
            Define and manage vehicle categories for your fleet
          </p>
        </div>
        <div className="flex items-center gap-2">
        

          {/* Create */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                New Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vehicle Type</DialogTitle>
                <DialogDescription>
                  Enter required vehicle type details
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={createForm.code}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, code: e.target.value })
                    }
                    placeholder="e.g., EV-VAN-01"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="e.g., Electric Delivery Van"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={createForm.category}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, category: e.target.value })
                    }
                    placeholder="e.g., Commercial"
                  />
                </div>
                <div>
                  <Label htmlFor="drivetrain">Drivetrain</Label>
                  <Input
                    id="drivetrain"
                    value={createForm.drivetrain}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        drivetrain: e.target.value,
                      })
                    }
                    placeholder="e.g., FWD"
                  />
                </div>
                <div>
                  <Label htmlFor="battery_capacity_kwh">
                    Battery Capacity (kWh)
                  </Label>
                  <Input
                    id="battery_capacity_kwh"
                    type="number"
                    value={createForm.battery_capacity_kwh}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        battery_capacity_kwh: parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g., 65"
                  />
                </div>
                <div>
                  <Label htmlFor="motor_power_kw">Motor Power (kW)</Label>
                  <Input
                    id="motor_power_kw"
                    type="number"
                    value={createForm.motor_power_kw}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        motor_power_kw: parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g., 150"
                  />
                </div>
                <div>
                  <Label htmlFor="wltp_range_km">WLTP Range (km)</Label>
                  <Input
                    id="wltp_range_km"
                    type="number"
                    value={createForm.wltp_range_km}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        wltp_range_km: parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g., 320"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={createForm.status}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, status: e.target.value })
                    }
                    placeholder="active / inactive"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Optional description of vehicle type"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateOpen(false);
                    setError("");
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                >
                  {creating ? "Creating…" : "Create Type"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              className="max-w-xs"
              placeholder="Search by code, name, description, or id…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Types {loading ? "(loading…)" : `(${filtered.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-3">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Drivetrain</TableHead>
                  <TableHead>Battery (kWh)</TableHead>
                  <TableHead>Motor (kW)</TableHead>
                  <TableHead>Range (km)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-sm text-gray-500">
                      No vehicle types found.
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-sm text-gray-500">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}

                {paginatedData.map((row) => (
                  <TableRow key={row.id} className="border-b hover:bg-gray-50">
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.drivetrain}</TableCell>
                    <TableCell>{row.battery_capacity_kwh}</TableCell>
                    <TableCell>{row.motor_power_kw}</TableCell>
                    <TableCell>{row.wltp_range_km}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {row.description || (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {/* ✅ Edit Dialog (unchanged) */}
                      <Dialog
                        open={editOpen && editId === row.id}
                        onOpenChange={setEditOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(row)}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {" "}
                          <DialogHeader>
                            {" "}
                            <DialogTitle>Edit Vehicle Type</DialogTitle>{" "}
                            <DialogDescription>
                              {" "}
                              Update details of the selected vehicle type{" "}
                            </DialogDescription>{" "}
                          </DialogHeader>{" "}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-code">Code *</Label>{" "}
                              <Input
                                id="edit-code"
                                value={editForm.code || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    code: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-name">Name *</Label>{" "}
                              <Input
                                id="edit-name"
                                value={editForm.name || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    name: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-category">
                                Category
                              </Label>{" "}
                              <Input
                                id="edit-category"
                                value={editForm.category || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    category: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-drivetrain">
                                Drivetrain
                              </Label>{" "}
                              <Input
                                id="edit-drivetrain"
                                value={editForm.drivetrain || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    drivetrain: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-battery">
                                Battery (kWh)
                              </Label>{" "}
                              <Input
                                id="edit-battery"
                                type="number"
                                value={editForm.battery_capacity_kwh || 0}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    battery_capacity_kwh: parseFloat(
                                      e.target.value
                                    ),
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-motor">
                                Motor (kW)
                              </Label>{" "}
                              <Input
                                id="edit-motor"
                                type="number"
                                value={editForm.motor_power_kw || 0}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    motor_power_kw: parseFloat(e.target.value),
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-range">
                                Range (km)
                              </Label>{" "}
                              <Input
                                id="edit-range"
                                type="number"
                                value={editForm.wltp_range_km || 0}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    wltp_range_km: parseFloat(e.target.value),
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <Label htmlFor="edit-status">Status</Label>{" "}
                              <Input
                                id="edit-status"
                                value={editForm.status || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    status: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                            <div className="md:col-span-2">
                              {" "}
                              <Label htmlFor="edit-description">
                                {" "}
                                Description{" "}
                              </Label>{" "}
                              <Textarea
                                id="edit-description"
                                value={editForm.description || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                  })
                                }
                              />{" "}
                            </div>{" "}
                          </div>{" "}
                          <DialogFooter className="mt-4">
                            {" "}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditOpen(false)}
                              disabled={updating}
                            >
                              {" "}
                              Cancel{" "}
                            </Button>{" "}
                            <Button
                              type="button"
                              onClick={handleUpdate}
                              disabled={updating}
                            >
                              {" "}
                              {updating ? "Updating…" : "Update Type"}{" "}
                            </Button>{" "}
                          </DialogFooter>{" "}
                        </DialogContent>
                      </Dialog>

                      {/* ✅ Delete Dialog (unchanged) */}
                      <Dialog
                        open={deleteOpen && deleteId === row.id}
                        onOpenChange={setDeleteOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDelete(row)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete vehicle type "
                              {row.name}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteOpen(false)}
                              disabled={deleting}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                              disabled={deleting}
                            >
                              {deleting ? "Deleting…" : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ✅ Pagination controls */}
           <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-2 gap-3">
  <span className="text-sm text-gray-600">
    Showing {(page - 1) * rowsPerPage + 1}–
    {Math.min(page * rowsPerPage, totalCount)} of {totalCount}
  </span>
  <div className="flex flex-wrap items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => fetchPage(page - 1)}
      disabled={page === 1}
    >
      Previous
    </Button>
    {Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i + 1).map(
      (p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => fetchPage(p)}
        >
          {p}
        </Button>
      )
    )}
    <Button
      variant="outline"
      size="sm"
      onClick={() => fetchPage(page + 1)}
      disabled={page >= Math.ceil(totalCount / rowsPerPage)}
    >
      Next
    </Button>
  </div>
</div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
