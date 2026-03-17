"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { Search, ChevronsUpDown, X } from "lucide-react";

interface Permission {
  id: number;
  name: string;
  created_at?: string;
}

interface RoleForDialog {
  id: string | number;
  name: string;
  permissionIds: string[];
  permissionNames?: string[];
}

interface AddRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: RoleForDialog | null;
  permissions: Permission[];
}

export function AddRoleDialog({
  isOpen,
  onClose,
  onSuccess,
  role,
  permissions: allPermissions,
}: AddRoleDialogProps) {
  const [name, setName] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sorted permissions
  const sortedPermissions = allPermissions.slice().sort((a, b) => a.name.localeCompare(b.name));
  const filteredPermissions = sortedPermissions.filter(p =>
    p.name.toLowerCase().includes(permissionSearch.toLowerCase())
  );
  const selectedPermissions = allPermissions.filter(p => selectedPermissionIds.includes(String(p.id)));

  // Prepopulate on open/edit
  useEffect(() => {
    if (isOpen) {
      if (role) {
        setName(role.name || "");
        // Match names to IDs (reuse current logic)
        const normalizedNames = (role.permissionNames || []).map(n => n.trim().toLowerCase());
        const matchedIds = allPermissions
          .filter(p => normalizedNames.includes(p.name.trim().toLowerCase()))
          .map(p => String(p.id));
        const finalIds = Array.from(new Set([...matchedIds, ...role.permissionIds.map(String)]));
        setSelectedPermissionIds(finalIds);
      } else {
        setName("");
        setSelectedPermissionIds([]);
      }
      setPermissionSearch("");
      setPickerOpen(false);
    }
  }, [isOpen, role, allPermissions]);

  // Outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrubbedChange = (val: string) => {
    const clean = val.replace(/[^a-zA-Z0-9 .\_\-']/g, "");
    setName(clean);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const removeSelectedPermission = (permissionId: string) => {
    setSelectedPermissionIds(prev => prev.filter(id => id !== permissionId));
  };

  const handleSubmit = async () => {
    const roleName = name.trim();
    if (!roleName) return;

    const permissionIds = Array.from(new Set(selectedPermissionIds.map(v => Number(v)))).filter(v => Number.isInteger(v) && v > 0);

    setIsSubmitting(true);
    const endpoint = role ? "/api/roles/update" : "/api/roles/create";
    const payload = role
      ? { id: role.id, name: roleName, permission_ids: permissionIds }
      : { name: roleName, permission_ids: permissionIds };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        throw new Error(data.error || "Failed to save role");
      }
    } catch (error) {
      console.error("Failed to save role", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-lexend text-xl">
            {role ? "Edit Role" : "Add New Role"}
          </DialogTitle>
          <DialogDescription className="font-inter">
            {role ? "Update role name and permissions." : "Create a new role with assigned permissions."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex-1 overflow-y-auto">
          <ValidatedInput
            label="Role Name"
            value={name}
            onChange={handleScrubbedChange}
            placeholder="e.g. treasurer, assessor"
            maxLength={50}
            required
            validator="permission-&-role-name"
            type="text"
          />

          <div className="mt-4">
            <label className="font-inter mb-1 block text-xs font-medium text-slate-600">
              Permissions
            </label>
            <div ref={pickerRef} className="relative">
              <Button
                type="button"
                onClick={() => setPickerOpen(!pickerOpen)}
                variant="outline"
                className="w-full justify-between font-inter text-sm h-10"
              >
                <span className={selectedPermissionIds.length > 0 ? "" : "text-slate-400"}>
                  {selectedPermissionIds.length > 0
                    ? `${selectedPermissionIds.length} permission(s) selected`
                    : "Select permissions"}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>

              {pickerOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky top-0 z-10 flex items-center bg-white border-b border-gray-100 px-3 py-2">
                    <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                    <input
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder="Search permissions..."
                      className="flex-1 bg-transparent p-0 text-xs font-inter text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="p-1">
                    {filteredPermissions.length === 0 ? (
                      <p className="px-3 py-6 text-center text-xs text-slate-400 font-inter">
                        {permissionSearch ? "No matching permissions." : "No permissions available."}
                      </p>
                    ) : (
                      filteredPermissions.map((permission) => {
                        const id = String(permission.id);
                        const checked = selectedPermissionIds.includes(id);
                        return (
                          <label
                            key={permission.id}
                            className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 hover:bg-gray-50 w-full"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(id)}
                              className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-300"
                            />
                            <span className="text-xs font-inter text-slate-700">{permission.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {selectedPermissions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200"
                    >
                      {permission.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedPermission(String(permission.id))}
                        className="h-4 w-4 p-0 ml-1 hover:bg-slate-200 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-inter">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="bg-[#0F172A] hover:bg-slate-800 font-inter text-white"
          >
            {isSubmitting ? "Saving..." : (role ? "Update Role" : "Create Role")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
