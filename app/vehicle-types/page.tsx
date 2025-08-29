// app/vehicles/add/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  listVehicleTypes,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from "@/lib/api";

type VehicleType = {
  id: number | string;
  name: string;
  description?: string | null;
};

export default function Page() {
  const [items, setItems] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search/filter
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        String(t.id).includes(q)
    );
  }, [items, query]);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const resp = await listVehicleTypes();
      const rows: any[] = Array.isArray(resp?.results)
        ? resp.results
        : Array.isArray(resp)
        ? resp
        : [];
      setItems(
        rows.map((r) => ({
          id: r.id,
          name: r.name ?? r.title ?? `Type ${r.id}`,
          description: r.description ?? r.notes ?? "",
        }))
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load vehicle types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const openEdit = (row: VehicleType) => {
    setEditId(row.id);
    setEditName(row.name);
    setEditDesc(row.description || "");
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
      const payload = {
        name: createName.trim(),
        description: createDesc.trim() || undefined,
      };
      if (!payload.name) {
        setError("Name is required.");
        setCreating(false);
        return;
      }
      const created = await createVehicleType(payload);
      // Optimistic add
      const newItem: VehicleType = {
        id: created?.id ?? Math.random().toString(36).slice(2),
        name: created?.name ?? payload.name,
        description: created?.description ?? payload.description ?? "",
      };
      setItems((prev) => [newItem, ...prev]);
      setCreateOpen(false);
      setCreateName("");
      setCreateDesc("");
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
      const payload = {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      };
      if (!payload.name) {
        setError("Name is required.");
        setUpdating(false);
        return;
      }
      const updated = await updateVehicleType(editId, payload);
      setItems((prev) =>
        prev.map((it) =>
          it.id === editId
            ? {
                id: updated?.id ?? editId,
                name: updated?.name ?? payload.name,
                description: updated?.description ?? payload.description ?? "",
              }
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
      await deleteVehicleType(deleteId);
      setItems((prev) => prev.filter((it) => it.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete vehicle type");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-gray-600">Define and manage vehicle categories for your fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading} title="Refresh">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Create */}
          <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) { setError(""); } }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Vehicle Type</DialogTitle>
              </DialogHeader>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="vt-name">Name *</Label>
                  <Input
                    id="vt-name"
                    placeholder="e.g., EV Pro 2024"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vt-desc">Description</Label>
                  <Textarea
                    id="vt-desc"
                    placeholder="Optional description"
                    value={createDesc}
                    onChange={(e) => setCreateDesc(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => { setCreateOpen(false); setError(""); }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating ? "Creating…" : "Create"}
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
              placeholder="Search by name, description, or id…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Types {loading ? "(loading…)" : `(${filtered.length})`}</CardTitle>
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
                  <TableHead className="w-28">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-gray-500">
                      No vehicle types found.
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-gray-500">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}

                {filtered.map((row) => (
                  <TableRow key={row.id} className="border-b hover:bg-gray-50">
                    <TableCell className="text-sm text-gray-500">{row.id}</TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {row.description || <span className="text-gray-400">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Edit */}
                      <Dialog
                        open={editOpen && editId === row.id}
                        onOpenChange={(o) => {
                          if (!o) {
                            setEditOpen(false);
                            setError("");
                          } else {
                            openEdit(row);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(row)} title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Vehicle Type</DialogTitle>
                          </DialogHeader>

                          {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                              {error}
                            </div>
                          )}

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Name *</Label>
                              <Input
                                id="edit-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-desc">Description</Label>
                              <Textarea
                                id="edit-desc"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                              />
                            </div>
                          </div>

                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => { setEditOpen(false); setError(""); }}
                              disabled={updating}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleUpdate} disabled={updating}>
                              {updating ? "Saving…" : "Save"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete */}
                      <Dialog
                        open={deleteOpen && deleteId === row.id}
                        onOpenChange={(o) => {
                          if (!o) {
                            setDeleteOpen(false);
                            setError("");
                          } else {
                            openDelete(row);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openDelete(row)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Vehicle Type</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm text-gray-600">
                            Are you sure you want to delete <b>{row.name}</b>? This action cannot be undone.
                          </div>
                          {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                              {error}
                            </div>
                          )}
                          <DialogFooter className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => { setDeleteOpen(false); setError(""); }}
                              disabled={deleting}
                            >
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
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
          </div>
        </CardContent>
      </Card>

      {/* Tiny debug */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
            {JSON.stringify({ count: items.length, filtered: filtered.length, loading, error }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
