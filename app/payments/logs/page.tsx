"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ListChecks,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const logs = [
  {
    orNumber: "OR-2026-000123",
    payer: "Juan Dela Cruz",
    description: "RPT Payment - Full Settlement",
    channel: "Cash Counter",
    status: "Posted",
    time: "Mar 01, 2026 - 09:32 AM",
  },
  {
    orNumber: "OR-2026-000122",
    payer: "ABC Trading",
    description: "RPT Payment - Partial",
    channel: "Bank Deposit",
    status: "Posted",
    time: "Mar 01, 2026 - 09:10 AM",
  },
  {
    orNumber: "OR-2026-000121",
    payer: "Maria Santos",
    description: "RPT Payment - Voided",
    channel: "GCash",
    status: "Voided",
    time: "Feb 29, 2026 - 04:55 PM",
  },
] as const;

export default function PaymentsLogsPage() {
  const router = useRouter();

  return (
    <div className="flex w-full overflow-x-hidden">
      <main className="flex-1 w-full">
        {/* Header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/payments")}
            className="font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Payments Monitoring
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
                OR & Payment Logs
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Monitor chronological OR issuance and payment activity.
              </p>
            </div>
          </div>
        </header>

        {/* Logs Table */}

        <section className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2">
              <ListChecks className="h-5 w-5 text-[#00154A]" />
            </div>
            <h2 className="font-lexend text-sm font-semibold text-[#848794]">
              OR & Payment Log Directory
            </h2>
          </div>

          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OR No.</TableHead>
                  <TableHead>Payer / Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-slate-700">{log.orNumber}</TableCell>
                    <TableCell>{log.payer}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.channel}</TableCell>
                    <TableCell className="text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {log.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${
                          log.status === "Posted"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {log.status === "Posted" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </section>
      </main>
    </div>
  );
}