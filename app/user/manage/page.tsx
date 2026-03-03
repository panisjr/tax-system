"use client";

import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  UsersRound,
  KeyRound,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

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

type ApiRole = {
  id?: string | number;
  name?: string;
  permission_id?: number;
  created_at?: string;
  permissions?:
    | {
        id?: number;
        name?: string;
        created_at?: string;
      }
    | {
        id?: number;
        name?: string;
        created_at?: string;
      }[]
    | null;
};

type ListedRole = {
  key: string;
  id: string | number;
  name: string;
  permissionName: string;
  permissionId: number | null;
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
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const mapRole = (role: ApiRole, index: number): ListedRole => {
  const rawName = role.name ?? "";
  const name =
    typeof rawName === "string" && rawName.trim().length > 0
      ? rawName.trim()
      : `Role ${index + 1}`;

  const permissionId =
    Number.isInteger(role.permission_id) && Number(role.permission_id) > 0
      ? Number(role.permission_id)
      : null;

  const permissionsValue = role.permissions ?? null;
  const permissionName = Array.isArray(permissionsValue)
    ? permissionsValue
        .map((p) => p?.name)
        .filter(Boolean)
        .join(", ") || "Unassigned"
    : permissionsValue?.name?.trim() || "Unassigned";

  const createdAt = role.created_at
    ? new Date(role.created_at).toLocaleDateString()
    : "-";

  const roleIdentifier = role.id ?? name;

  return {
    key: String(roleIdentifier),
    id: roleIdentifier,
    name,
    permissionName,
    permissionId,
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
    setIsLoadingPermissions(true);
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
    } finally {
      setIsLoadingPermissions(false);
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

  const handleBack = () => router.push("/user"); // adjust if you have a settings/admin route
  const handleAddRole = async () => {
    const result = await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Add New Role</h2>
          <p class="font-inter text-sm text-slate-500 mb-4">Create a new role for role management.</p>
          <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Role Name</label>
          <input
            id="role-name-input"
            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Enter role name"
          />
          <label class="font-inter block text-xs font-medium text-slate-600 mb-1 mt-3">Permission</label>
          <select
            id="permission-id-input"
            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Select permission</option>
            ${permissions
              .map(
                (permission) =>
                  `<option value="${permission.id}">${permission.name}</option>`,
              )
              .join("")}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Role",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
        cancelButton:
          "border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2",
      },
      preConfirm: async () => {
        const input = document.getElementById(
          "role-name-input",
        ) as HTMLInputElement | null;
        const permissionInput = document.getElementById(
          "permission-id-input",
        ) as HTMLSelectElement | null;
        const roleName = input?.value?.trim() ?? "";
        const permissionId = Number(permissionInput?.value ?? "");

        if (!roleName) {
          Swal.showValidationMessage("Role name is required.");
          return null;
        }

        if (!Number.isInteger(permissionId) || permissionId <= 0) {
          Swal.showValidationMessage("Permission is required.");
          return null;
        }

        try {
          const response = await fetch("/api/roles/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: roleName,
              permission_id: permissionId,
            }),
          });

          const data = (await response.json()) as { error?: string };

          if (!response.ok) {
            Swal.showValidationMessage(data.error ?? "Failed to create role.");
            return null;
          }

          return roleName;
        } catch {
          Swal.showValidationMessage("Unable to connect to server.");
          return null;
        }
      },
    });

    if (!result.isConfirmed) return;

    await fetchRoles();

    await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Role Added</h2>
          <p class="font-inter text-sm text-slate-500">The new role has been added successfully.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "OK",
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      },
    });
  };

  const handleEditRole = async (role: ListedRole) => {
    const selectedPermissionId = role.permissionId ?? null;
    
    const result = await Swal.fire({
      html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Edit Role</h2>
        <p class="font-inter text-sm text-slate-500 mb-4">Update role permission below.</p>
        <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Role Name</label>
        <input
          class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-slate-700 outline-none"
          value="${role.name}"
          disabled
        />
        <label class="font-inter block text-xs font-medium text-slate-600 mb-1 mt-3">Permission</label>
        <div class="space-y-2">
          ${permissions
            .map(
              (p) => `
                <label class="inline-flex items-center gap-2">
                  <input type="radio" name="permission" value="${p.id}" ${selectedPermissionId === p.id ? "checked" : ""} />
                  <span class="text-xs text-slate-600">${p.name}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
        cancelButton:
          "border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2",
      },
      preConfirm: async () => {
        const checked = document.querySelector<HTMLInputElement>(
          'input[name="permission"]:checked',
        );
        const permissionId = Number(checked?.value ?? "");

        if (!Number.isInteger(permissionId) || permissionId <= 0) {
          Swal.showValidationMessage("Permission is required.");
          return null;
        }

        try {
          const response = await fetch("/api/roles/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: role.id,
              name: role.name,
              permission_id: permissionId,
            }),
          });
          const data = (await response.json()) as { error?: string };
          if (!response.ok) {
            Swal.showValidationMessage(data.error ?? "Failed to update role.");
            return null;
          }
          return permissionId;
        } catch {
          Swal.showValidationMessage("Unable to connect to server.");
          return null;
        }
      },
    });

    if (!result.isConfirmed) return;

    await fetchRoles();

    await Swal.fire({
      html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Role Updated</h2>
        <p class="font-inter text-sm text-slate-500">Changes have been saved.</p>
      </div>
    `,
      showConfirmButton: true,
      confirmButtonText: "OK",
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      },
    });
  };

  const handleViewRole = (roleName: string) => {
    router.push(`/roles/view?name=${encodeURIComponent(roleName)}`);
  };

  const handleViewRoleUsers = async (roleName: string) => {
    const roleKey = normalizeRole(roleName);
    const names = usersByRole.get(roleKey) ?? [];

    const listHtml =
      names.length === 0
        ? '<p class="font-inter text-sm text-slate-500">No users assigned to this role.</p>'
        : `
          <div class="max-h-64 overflow-y-auto rounded-md border border-gray-100">
            <ul class="divide-y divide-gray-100">
              ${names
                .map(
                  (name) =>
                    `<li class="px-3 py-2 text-sm text-slate-700 font-inter">${name}</li>`,
                )
                .join("")}
            </ul>
          </div>
        `;

    await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-1">
            ${roleName} Users
          </h2>
          <p class="font-inter text-xs text-slate-500 mb-3">
            Total assigned users: <span class="font-semibold text-[#0F172A]">${names.length}</span>
          </p>
          ${listHtml}
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Close",
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      },
    });
  };

  const handleDeleteRole = (roleName: string) => {
    // Replace with a confirm modal + API call
    const ok = window.confirm(
      `Delete role "${roleName}"? This cannot be undone.`,
    );
    if (!ok) return;

    // TODO: call delete API, then refresh
    // Example:
    // await fetch(`/api/roles/${encodeURIComponent(roleName)}`, { method: 'DELETE' })
  };

  // permission helpers
  const handleAddPermission = async () => {
    const result = await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Add New Permission</h2>
          <p class="font-inter text-sm text-slate-500 mb-4">Define a new permission level.</p>
          <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Permission Name</label>
          <input
            id="permission-name-input"
            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Enter permission name"
          />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Permission",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
        cancelButton:
          "border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2",
      },
      preConfirm: async () => {
        const input = document.getElementById(
          "permission-name-input",
        ) as HTMLInputElement | null;
        const permissionName = input?.value?.trim() ?? "";

        if (!permissionName) {
          Swal.showValidationMessage("Permission name is required.");
          return null;
        }

        try {
          const response = await fetch("/api/permissions/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: permissionName }),
          });

          const data = (await response.json()) as { error?: string };

          if (!response.ok) {
            Swal.showValidationMessage(
              data.error ?? "Failed to create permission.",
            );
            return null;
          }

          return permissionName;
        } catch {
          Swal.showValidationMessage("Unable to connect to server.");
          return null;
        }
      },
    });

    if (!result.isConfirmed) return;

    await fetchPermissions();

    await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Permission Added</h2>
          <p class="font-inter text-sm text-slate-500">The new permission has been added successfully.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "OK",
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      },
    });
  };

  const handleEditPermission = async (perm: ApiPermission) => {
    const result = await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Edit Permission</h2>
          <p class="font-inter text-sm text-slate-500 mb-4">Update the permission name below.</p>
          <label class="font-inter block text-xs font-medium text-slate-600 mb-1">Permission Name</label>
          <input
            id="permission-name-input"
            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Enter permission name"
            value="${perm.name ?? ""}"
          />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
        cancelButton:
          "border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2",
      },
      preConfirm: async () => {
        const input = document.getElementById(
          "permission-name-input",
        ) as HTMLInputElement | null;
        const permissionName = input?.value?.trim() ?? "";

        if (!permissionName) {
          Swal.showValidationMessage("Permission name is required.");
          return null;
        }

        try {
          const response = await fetch("/api/permissions/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: perm.id, name: permissionName }),
          });

          const data = (await response.json()) as { error?: string };
          if (!response.ok) {
            Swal.showValidationMessage(
              data.error ?? "Failed to update permission.",
            );
            return null;
          }

          return permissionName;
        } catch {
          Swal.showValidationMessage("Unable to connect to server.");
          return null;
        }
      },
    });

    if (!result.isConfirmed) return;

    await fetchPermissions();

    await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">Permission Updated</h2>
          <p class="font-inter text-sm text-slate-500">Changes have been saved.</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "OK",
      buttonsStyling: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl p-6 shadow-lg",
        confirmButton:
          "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      },
    });
  };

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

        {/* permission management section */}

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2">
              <ShieldCheck className="h-5 w-5 text-[#00154A]" />
            </div>
            <h2 className={`font-inter text-sm font-semibold text-[#848794]`}>
              Role Directory
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-155 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th
                    className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}
                  >
                    Role
                  </th>
                  <th
                    className={`font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500`}
                  >
                    Permissions
                  </th>
                  <th
                    className={`font-lexend px-3 py-3 text-left text-xs font-semibold text-slate-500`}
                  >
                    Users
                  </th>
                  <th
                    className={`font-lexend px-3 py-3 text-left text-xs font-semibold text-slate-500`}
                  >
                    Created
                  </th>
                  <th
                    className={`font-inter px-3 py-3 text-right text-xs font-semibold text-slate-500`}
                  >
                    Actions
                  </th>
                </tr>
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

                {!isLoadingRoles &&
                  roles.map((role) => {
                    const roleKey = normalizeRole(role.name);
                    const roleUsers = usersByRole.get(roleKey) ?? [];
                    const roleUsersCount = roleUsers.length;

                    return (
                      <tr key={role.key} className="border-b border-gray-100">
                        <td
                          className={`font-inter px-3 py-3 text-sm text-slate-700`}
                        >
                          <div className="inline-flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-slate-400" />
                            {role.name}
                          </div>
                        </td>

                        <td
                          className={`font-inter px-3 py-3 text-sm text-slate-600`}
                        >
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600">
                              {role.permissionName}
                            </span>
                          </div>
                        </td>

                        <td
                          className={`font-inter px-3 py-3 text-sm text-slate-600`}
                        >
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
                        </td>

                        <td className={`font-inter px-3 py-3 text-sm`}>
                          <span className="text-xs text-slate-600">
                            {role.createdAt}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewRole(role.name)}
                              className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditRole(role)}
                              className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteRole(role.name)}
                              className={`font-inter inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
