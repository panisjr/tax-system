'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  UsersRound,
  KeyRound,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';

const roles = [
  {
    name: 'Administrator',
    status: 'Active',
    usersCount: 1,
    permissions: ['User Management', 'Role Management', 'Audit Logs', 'Reports'],
  },
  {
    name: 'Treasurer',
    status: 'Active',
    usersCount: 1,
    permissions: ['Collections', 'Payments', 'Reports'],
  },
  {
    name: 'Assessor',
    status: 'Active',
    usersCount: 2,
    permissions: ['Assessments', 'Property Records', 'Reports'],
  },
  {
    name: 'Encoder',
    status: 'Inactive',
    usersCount: 0,
    permissions: ['Data Entry'],
  },
] as const;

export default function ManageRolePage() {
  const router = useRouter();

  const handleBack = () => router.push('/user'); // adjust if you have a settings/admin route
  const handleAddRole = () => router.push('/user/create');

  const handleEditRole = (roleName: string) => {
    router.push(`/roles/edit?name=${encodeURIComponent(roleName)}`);
  };

  const handleViewRole = (roleName: string) => {
    router.push(`/roles/view?name=${encodeURIComponent(roleName)}`);
  };

  const handleViewRoleUsers = (roleName: string) => {
    router.push(`/roles/users?role=${encodeURIComponent(roleName)}`);
  };

  const handleDeleteRole = (roleName: string) => {
    // Replace with a confirm modal + API call
    const ok = window.confirm(`Delete role "${roleName}"? This cannot be undone.`);
    if (!ok) return;

    // TODO: call delete API, then refresh
    // Example:
    // await fetch(`/api/roles/${encodeURIComponent(roleName)}`, { method: 'DELETE' })
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
                    Status
                  </th>
                  <th
                    className={`font-inter px-3 py-3 text-right text-xs font-semibold text-slate-500`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr key={role.name} className="border-b border-gray-100">
                    <td className={`font-inter px-3 py-3 text-sm text-slate-700`}>
                      <div className="inline-flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-400" />
                        {role.name}
                      </div>
                    </td>

                    <td className={`font-inter px-3 py-3 text-sm text-slate-600`}>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-600"
                          >
                            {p}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="rounded bg-slate-50 px-2 py-1 text-xs text-slate-500">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className={`font-inter px-3 py-3 text-sm text-slate-600`}>
                      <button
                        type="button"
                        onClick={() => handleViewRoleUsers(role.name)}
                        className="inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 cursor-pointer"
                        title="View users with this role"
                      >
                        <UsersRound className="h-3.5 w-3.5" />
                        {role.usersCount}
                      </button>
                    </td>

                    <td className={`font-inter px-3 py-3 text-sm`}>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          role.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {role.status}
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
                          onClick={() => handleEditRole(role.name)}
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
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}