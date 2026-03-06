"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  UsersRound,
  KeyRound,
  Pencil,
  Trash2,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel, 
  flexRender,
} from "@tanstack/react-table";

type ApiUser = {
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;
  role?: string;
  roles?: {
    name?: string;
  } | null;
};

type ApiPermission = {
  id: number;
  name: string;
  created_at?: string;
};

// Updated ApiRole to handle all possible Supabase response shapes
type ApiRole = {
  id?: string | number;
  name?: string;
  permission_id?: number;
  created_at?: string;
  permission_names?: string[];
  role_permissions?: Array<{
    permission_id?: number;
    permissions?: {
      id?: number;
      name?: string;
      created_at?: string;
    } | null;
  }>;
  permissions?:
    | { id?: number; name?: string; created_at?: string }
    | Array<{ id?: number; name?: string; created_at?: string }>
    | null;
};

type ListedRole = {
  key: string;
  id: string | number;
  name: string;
  permissionNames: string[];
  permissionIds: string[];
  createdAt: string;
};

const normalizeRole = (role: string) => {
  const value = role.trim().toLowerCase();

  if (value === "admin" || value === "administrator") return "administrator";
  if (value === "treasurer") return "treasurer";
  if (value === "assessor") return "assessor";
  if (value === "encoder") return "encoder";

  return value;
};

export default function ManageRolePage() {
  const router = useRouter();

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ListedRole[]>([]);
  const [permissions, setPermissions] = useState<ApiPermission[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // --- ADDED 1: State for TanStack Table global search filter
  const [globalFilter, setGlobalFilter] = useState("");

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | number | null>(
    null,
  );
  const [newRoleName, setNewRoleName] = useState("");
  const [newPermissionIds, setNewPermissionIds] = useState<string[]>([]);

  const [permissionPickerOpen, setPermissionPickerOpen] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [selectedRoleUsers, setSelectedRoleUsers] = useState<{
    roleName: string;
    names: string[];
  } | null>(null);
  const [rolePendingDelete, setRolePendingDelete] = useState<string | null>(
    null,
  );
  const permissionPickerRef = useRef<HTMLDivElement | null>(null);

  const mapRole = (role: ApiRole, index: number): ListedRole => {
    const rawName = role.name ?? "";
    const name =
      typeof rawName === "string" && rawName.trim().length > 0
        ? rawName.trim()
        : `Role ${index + 1}`;

    let extractedNames: string[] = [];
    let extractedIds: string[] = [];

    // 1. Extract from permission_names string array
    if (Array.isArray(role.permission_names)) {
      extractedNames.push(...role.permission_names);
    }

    // 2. Extract from role_permissions mapping table (junction table)
    if (Array.isArray(role.role_permissions)) {
      role.role_permissions.forEach((mapping) => {
        if (mapping.permission_id)
          extractedIds.push(String(mapping.permission_id));
        if (mapping.permissions?.id)
          extractedIds.push(String(mapping.permissions.id));
        if (mapping.permissions?.name)
          extractedNames.push(mapping.permissions.name);
      });
    }

    // 3. Extract from nested permissions object OR array
    if (Array.isArray(role.permissions)) {
      role.permissions.forEach((p) => {
        if (p.id) extractedIds.push(String(p.id));
        if (p.name) extractedNames.push(p.name);
      });
    } else if (role.permissions && typeof role.permissions === "object") {
      if (role.permissions.id) extractedIds.push(String(role.permissions.id));
      if (role.permissions.name) extractedNames.push(role.permissions.name);
    }

    // 4. Extract from legacy top-level permission_id
    if (role.permission_id) {
      extractedIds.push(String(role.permission_id));
    }

    // Clean up duplicates and empty strings
    const permissionNames = [
      ...new Set(extractedNames.map((n) => n.trim()).filter(Boolean)),
    ];
    const permissionIds = [
      ...new Set(
        extractedIds.filter((id) => id && id !== "undefined" && id !== "null"),
      ),
    ];

    const createdAt = role.created_at
      ? new Date(role.created_at).toLocaleDateString()
      : "-";
    const roleIdentifier = role.id ?? name;

    return {
      key: String(roleIdentifier),
      id: roleIdentifier,
      name,
      permissionNames,
      permissionIds,
      createdAt,
    };
  };

  const fetchRoles = async () => {
    setIsLoadingRoles(true);

    try {
      const response = await fetch("/api/roles/list", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        roles?: ApiRole[];
      };

      if (!response.ok) {
        setRoles([]);
        return;
      }

      const mapped = (data.roles ?? []).map((role, index) =>
        mapRole(role, index),
      );
      setRoles(mapped);
    } catch {
      setRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch("/api/permissions/list", {
        cache: "no-store",
      });
      const data = (await response.json()) as { permissions?: ApiPermission[] };

      if (!response.ok) {
        setPermissions([]);
        return;
      }

      setPermissions(data.permissions ?? []);
    } catch {
      setPermissions([]);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);

      try {
        const response = await fetch("/api/user/list", { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          users?: ApiUser[];
        };

        if (!response.ok) {
          setUsers([]);
          return;
        }

        setUsers(data.users ?? []);
      } catch {
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!permissionPickerRef.current) return;
      if (!permissionPickerRef.current.contains(event.target as Node)) {
        setPermissionPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const usersByRole = useMemo(() => {
    const grouped = new Map<string, string[]>();

    for (const user of users) {
      const roleKey = normalizeRole(user.roles?.name ?? user.role ?? "");
      if (!roleKey) continue;

      const fullname = [
        user.firstname?.trim() ?? "",
        user.middlename?.trim() ?? "",
        user.lastname?.trim() ?? "",
        user.suffix?.trim() ?? "",
      ]
        .filter(Boolean)
        .join(" ");

      const names = grouped.get(roleKey) ?? [];
      names.push(fullname || "Unnamed User");
      grouped.set(roleKey, names);
    }

    return grouped;
  }, [users]);

  const handleBack = () => router.push("/user");

  // --- MODAL CONTROLS ---

  const handleAddRole = () => {
    setEditingRoleId(null);
    setNewRoleName("");
    setNewPermissionIds([]);
    setPermissionPickerOpen(false);
    setPermissionSearch("");
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: ListedRole) => {
    setEditingRoleId(role.id);
    setNewRoleName(role.name);

    // NUCLEAR FIX: We can see the permission names in your table perfectly. 
    // We will take those names, force them to lowercase, and match them directly 
    // against the master permissions list to guarantee we get the correct IDs.
    const normalizedNames = role.permissionNames.map(name => name.trim().toLowerCase());
    
    const matchedIds = permissions
      .filter(p => normalizedNames.includes(p.name.trim().toLowerCase()))
      .map(p => String(p.id));

    // Combine the matched IDs with any IDs the API actually managed to send
    const finalIds = Array.from(new Set([...matchedIds, ...role.permissionIds.map(String)]));

    setNewPermissionIds(finalIds);
    setPermissionPickerOpen(false);
    setPermissionSearch("");
    setIsRoleModalOpen(true);
  };

  // ----------------------

  const togglePermission = (permissionId: string) => {
    setNewPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const removeSelectedPermission = (permissionId: string) => {
    setNewPermissionIds((prev) => prev.filter((id) => id !== permissionId));
  };

  const sortedPermissions = permissions
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredPermissions = sortedPermissions.filter((permission) =>
    permission.name.toLowerCase().includes(permissionSearch.toLowerCase()),
  );

  const selectedPermissions = permissions
    .filter((permission) => newPermissionIds.includes(String(permission.id)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSaveRole = async () => {
    const roleName = newRoleName.trim();
    const roleNameKey = roleName.toLowerCase();
    const permissionIds = [
      ...new Set(newPermissionIds.map((value) => Number(value))),
    ].filter((value) => Number.isInteger(value) && value > 0);

    const hasDuplicateRole = roles.some(
      (role) =>
        role.name.trim().toLowerCase() === roleNameKey &&
        role.id !== editingRoleId,
    );

    if (!roleName) {
      toast.warning("Role name is required.");
      return;
    }

    if (hasDuplicateRole) {
      toast.warning("Role already exists.");
      return;
    }

    setIsSavingRole(true);

    const isEditMode = editingRoleId !== null;
    const apiUrl = isEditMode ? "/api/roles/update" : "/api/roles/create";
    const payload = isEditMode
      ? { id: editingRoleId, name: roleName, permission_ids: permissionIds }
      : { name: roleName, permission_ids: permissionIds };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(
          data.error ?? `Failed to ${isEditMode ? "update" : "create"} role.`,
        );
        return;
      }

      setIsRoleModalOpen(false);
      await fetchRoles();
      toast.success(isEditMode ? "Role updated" : "Role added", {
        description: isEditMode
          ? "Changes have been saved."
          : "The new role has been added successfully.",
      });
    } catch {
      toast.error("Unable to connect to server.");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleViewRoleUsers = (roleName: string) => {
    const roleKey = normalizeRole(roleName);
    const names = usersByRole.get(roleKey) ?? [];

    setSelectedRoleUsers({ roleName, names });
  };

  const handleDeleteRole = (roleName: string) => {
    setRolePendingDelete(roleName);
  };

  const confirmDeleteRole = async () => {
    if (!rolePendingDelete) return;

    setIsDeletingRole(true);

    try {
      const response = await fetch("/api/roles/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: rolePendingDelete }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };
      
      if (!response.ok) {
        toast.error(data.error ?? "Failed to delete role.");
        return;
      }

      setRolePendingDelete(null);
      await fetchRoles();
      toast.success("Role deleted", {
        description: data.message ?? "Role deleted successfully.",
      });
    } catch {
      toast.error("Unable to connect to server.");
    } finally {
      setIsDeletingRole(false);
    }
  };

  // --- ADDED 2: Define TanStack Columns in a useMemo.
  // We include `usersByRole` and `isLoadingUsers` in the dependency array so the "Users" count column updates properly!
  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Role",
      cell: ({ row }: any) => (
        <div className="inline-flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-slate-400" />
          {row.original.name}
        </div>
      ),
    },
    {
      // Using permissionNames as the accessorKey so TanStack's global filter searches inside the permission bubbles!
      accessorKey: "permissionNames",
      header: "Permissions",
      cell: ({ row }: any) => {
        const role = row.original;
        return (
          <div className="flex flex-wrap gap-2">
            {role.permissionNames.length === 0 ? (
              <span className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-400">
                Unassigned
              </span>
            ) : (
              role.permissionNames.map((permissionName: string) => (
                <span
                  key={`${role.key}-${permissionName}`}
                  className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600 border border-gray-200"
                >
                  {permissionName}
                </span>
              ))
            )}
          </div>
        );
      },
    },
    {
      id: "users",
      header: "Users",
      cell: ({ row }: any) => {
        const role = row.original;
        const roleKey = normalizeRole(role.name);
        const roleUsers = usersByRole.get(roleKey) ?? [];
        const roleUsersCount = roleUsers.length;

        return (
          <button
            type="button"
            onClick={() => handleViewRoleUsers(role.name)}
            className="inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer"
            title="View users with this role"
            disabled={isLoadingUsers}
          >
            <UsersRound className="h-3.5 w-3.5" />
            {isLoadingUsers ? "..." : roleUsersCount}
          </button>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: any) => (
        <span className="text-xs text-slate-600">
          {row.original.createdAt}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }: any) => {
        const role = row.original;
        return (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => handleEditRole(role)}
              className="font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDeleteRole(role.name)}
              className="font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        );
      },
    },
  ], [usersByRole, isLoadingUsers]); // <-- Dependencies required so the cell renders have fresh data

  // --- ADDED 3: Initialize the TanStack Table Hook ---
  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      globalFilter,
    },
  });

  return (
    <div className="flex">
      <main className="flex-1">
        <header className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className={`font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 cursor-pointer`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Management
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
                Manage Roles
              </h1>
              <p className={`font-inter mt-1 text-xs text-slate-400`}>
                Create roles, assign permissions, and manage access levels
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddRole}
              className={`font-inter h-10 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 cursor-pointer`}
            >
              Add New Role
            </button>
          </div>
        </header>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          
          {/* --- ADDED 4: Built a flex container holding the title and Search bar side-by-side --- */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <ShieldCheck className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className={`font-inter text-sm font-semibold text-[#848794]`}>
                Role Directory
              </h2>
            </div>

            {/* Global Search Input */}
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 w-full sm:max-w-xs focus-within:ring-2 focus-within:ring-slate-200 transition-shadow">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search roles or permissions..."
                className="w-full bg-transparent text-sm font-inter outline-none placeholder:text-slate-400 text-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full min-w-155 border-collapse">
              {/* --- ADDED 5: Dynamic Table Headers via TanStack --- */}
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {isLoadingRoles && (
                  <tr>
                    <td
                      className="font-inter px-3 py-8 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      Loading roles...
                    </td>
                  </tr>
                )}

                {!isLoadingRoles && roles.length === 0 && (
                  <tr>
                    <td
                      className="font-inter px-3 py-8 text-center text-sm text-slate-500"
                      colSpan={5}
                    >
                      No roles found.
                    </td>
                  </tr>
                )}

                {/* Empty Search Results Message */}
                {!isLoadingRoles && table.getRowModel().rows.length === 0 && roles.length > 0 && (
                    <tr>
                        <td className='font-inter px-3 py-8 text-center text-sm text-slate-500' colSpan={5}>
                            No roles match your search.
                        </td>
                    </tr>
                )}

                {/* --- ADDED 6: Mapping dynamic Table Rows using table.getRowModel().rows --- */}
                {!isLoadingRoles &&
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 transition-colors hover:bg-slate-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`font-inter px-3 py-3 text-sm text-slate-700`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* --- ADDED 7: Pagination Controls below the table --- */}
          {!isLoadingRoles && roles.length > 0 && (
              <div className="flex items-center justify-between px-2 mt-4">
                  <div className="font-inter text-xs text-slate-500">
                      Showing Page <span className="font-medium text-slate-900">{table.getPageCount() === 0 ? 0 : table.getState().pagination.pageIndex + 1}</span> of{" "}
                      <span className="font-medium text-slate-900">{table.getPageCount()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                      <button
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                          <ChevronLeft className="mr-1 h-3 w-3" />
                          Previous
                      </button>
                      <button
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                          Next
                          <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                  </div>
              </div>
          )}
        </section>

        {isRoleModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setIsRoleModalOpen(false)}
          >
            <div
              className="swal2-show w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-lexend mb-2 text-lg font-semibold text-[#0F172A]">
                {editingRoleId ? "Edit Role" : "Add New Role"}
              </h2>
              <p className="font-inter mb-4 text-sm text-slate-500">
                {editingRoleId
                  ? "Update role details and permissions."
                  : "Create a new role for role management."}
              </p>

              <label className="font-inter mb-1 block text-xs font-medium text-slate-600">
                Role Name
              </label>
              <input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                disabled={editingRoleId !== null} // Optional: Disable changing the name of existing roles
                className={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 ${
                  editingRoleId
                    ? "bg-gray-100 text-slate-500 cursor-not-allowed"
                    : "bg-white text-slate-700"
                }`}
                placeholder="Enter role name"
              />

              <div className="mt-3">
                <label className="font-inter mb-1 block text-xs font-medium text-slate-600">
                  Permissions
                </label>
                <div ref={permissionPickerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setPermissionPickerOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 font-inter text-sm text-slate-700 transition-colors hover:border-gray-300"
                  >
                    <span
                      className={
                        newPermissionIds.length > 0 ? "" : "text-slate-400"
                      }
                    >
                      {newPermissionIds.length > 0
                        ? `${newPermissionIds.length} permission(s) selected`
                        : "Select permissions"}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {permissionPickerOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="flex items-center border-b border-gray-100 px-3 py-2">
                        <Search className="mr-2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          value={permissionSearch}
                          onChange={(e) => setPermissionSearch(e.target.value)}
                          placeholder="Search permission..."
                          className="w-full bg-transparent font-inter text-xs text-slate-700 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto p-1">
                        {filteredPermissions.length === 0 ? (
                          <p className="px-2 py-4 text-center font-inter text-xs text-slate-400">
                            No permissions available.
                          </p>
                        ) : (
                          filteredPermissions.map((permission) => {
                            const value = String(permission.id);
                            const checked = newPermissionIds.includes(value);

                            return (
                              <label
                                key={permission.id}
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => togglePermission(value)}
                                  className="h-3.5 w-3.5 rounded border-gray-300 text-slate-700 focus:ring-slate-300"
                                />
                                <span className="font-inter text-xs text-slate-700">
                                  {permission.name}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  {selectedPermissions.length === 0 ? (
                    <span className="font-inter text-xs text-slate-400">
                      No permissions selected.
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedPermissions.map((permission) => (
                        <button
                          key={permission.id}
                          type="button"
                          onClick={() =>
                            removeSelectedPermission(String(permission.id))
                          }
                          className="rounded bg-slate-50 px-2 py-1 text-xs font-inter text-slate-600 transition-colors hover:bg-slate-100 cursor-pointer border border-gray-200"
                          title="Remove permission"
                        >
                          {permission.name} ×
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2 cursor-pointer"
                  disabled={isSavingRole}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRole}
                  className="bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSavingRole}
                >
                  {isSavingRole
                    ? "Saving..."
                    : editingRoleId
                      ? "Update Role"
                      : "Save Role"}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedRoleUsers && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedRoleUsers(null)}
          >
            <div
              className="swal2-show w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-lexend mb-1 text-lg font-semibold text-[#0F172A]">
                {selectedRoleUsers.roleName} Users
              </h2>
              <p className="font-inter mb-3 text-xs text-slate-500">
                Total assigned users:{" "}
                <span className="font-semibold text-[#0F172A]">
                  {selectedRoleUsers.names.length}
                </span>
              </p>

              {selectedRoleUsers.names.length === 0 ? (
                <p className="font-inter text-sm text-slate-500">
                  No users assigned to this role.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto rounded-md border border-gray-100">
                  <ul className="divide-y divide-gray-100">
                    {selectedRoleUsers.names.map((name) => (
                      <li
                        key={name}
                        className="px-3 py-2 font-inter text-sm text-slate-700"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRoleUsers(null)}
                  className="bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {rolePendingDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setRolePendingDelete(null)}
          >
            <div
              className="swal2-show w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-lexend mb-2 text-lg font-semibold text-[#0F172A]">
                Delete Role?
              </h2>
              <p className="font-inter text-sm text-slate-500">
                You are about to remove{" "}
                <span className="font-semibold text-[#0F172A]">
                  {rolePendingDelete}
                </span>
                .
              </p>
              <p className="font-inter mt-2 text-xs text-rose-500">
                This action cannot be undone.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRolePendingDelete(null)}
                  className="border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer"
                  disabled={isDeletingRole}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteRole}
                  className="bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeletingRole}
                >
                  {isDeletingRole ? "Deleting..." : "Delete Role"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}