"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Activity,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const logs = [
  {
    user: "Juan Dela Cruz",
    action: "Created New Assessment",
    module: "Assessment",
    status: "Success",
    time: "Mar 12, 2025 - 10:24 AM",
  },
  {
    user: "Maria Santos",
    action: "Approved Payment",
    module: "Collections",
    status: "Success",
    time: "Mar 12, 2025 - 09:10 AM",
  },
  {
    user: "Admin User",
    action: "Updated Role Permissions",
    module: "User Management",
    status: "Success",
    time: "Mar 11, 2025 - 04:45 PM",
  },
  {
    user: "Ramon Reyes",
    action: "Failed Login Attempt",
    module: "Authentication",
    status: "Failed",
    time: "Mar 11, 2025 - 02:11 PM",
  },
];

export default function UserLogsPage() {
  const router = useRouter();

  return (
    <div className="flex">
      <main className="flex-1">
        {/* Header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/user")}
            className="font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Management
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
                User Activity Logs
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Monitor system activity, login attempts, and user actions.
              </p>
            </div>
          </div>
        </header>

        {/* Logs Table */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2">
              <Activity className="h-5 w-5 text-[#00154A]" />
            </div>
            <h2 className="font-lexend text-sm font-semibold text-[#848794]">
              Activity Log Directory
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    User
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Action
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Module
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Date / Time
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="font-inter px-3 py-3 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        {log.user}
                      </div>
                    </td>

                    <td className="font-inter px-3 py-3 text-sm text-slate-600">
                      {log.action}
                    </td>

                    <td className="font-inter px-3 py-3 text-sm text-slate-600">
                      {log.module}
                    </td>

                    <td className="font-inter px-3 py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {log.time}
                      </div>
                    </td>

                    <td className="font-inter px-3 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${
                          log.status === "Success"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {log.status === "Success" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
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