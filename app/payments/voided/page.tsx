"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, Clock, XCircle } from "lucide-react";

const voidedOrs = [
  {
    orNumber: "OR-2026-000121",
    payer: "Maria Santos",
    reason: "Encoding error – wrong taxpayer",
    amount: "₱ 2,150.00",
    cashier: "Cashier 02",
    date: "Feb 29, 2026 - 04:55 PM",
    reference: "Reissued as OR-2026-000125",
  },
  {
    orNumber: "OR-2026-000118",
    payer: "ABC Trading",
    reason: "Duplicate payment",
    amount: "₱ 8,750.00",
    cashier: "Cashier 01",
    date: "Feb 28, 2026 - 03:20 PM",
    reference: "Refund processed",
  },
] as const;

export default function VoidedOrPage() {
  const router = useRouter();

  return (
    <div className="flex">
      <main className="flex-1">
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
                Voided & Unapplied OR
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Track invalid, cancelled, or unapplied official receipts.
              </p>
            </div>
          </div>
        </header>

        {/* Voided OR Table */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2">
              <CircleAlert className="h-5 w-5 text-[#00154A]" />
            </div>
            <h2 className="font-lexend text-sm font-semibold text-[#848794]">
              Voided OR Directory
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175 border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    OR No.
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Payer / Account
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Reason
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Amount
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Cashier
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Date / Time
                  </th>
                  <th className="font-inter px-3 py-3 text-left text-xs font-semibold text-slate-500">
                    Reference / Notes
                  </th>
                </tr>
              </thead>

              <tbody>
                {voidedOrs.map((item) => (
                  <tr key={item.orNumber} className="border-b border-gray-100">
                    <td className="font-inter px-3 py-3 text-sm text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        {item.orNumber}
                      </span>
                    </td>
                    <td className="font-inter px-3 py-3 text-sm text-slate-600">
                      {item.payer}
                    </td>
                    <td className="font-inter px-3 py-3 text-sm text-slate-600">
                      {item.reason}
                    </td>
                    <td className="font-inter px-3 py-3 text-sm text-slate-900">
                      {item.amount}
                    </td>
                    <td className="font-inter px-3 py-3 text-sm text-slate-600">
                      {item.cashier}
                    </td>
                    <td className="font-inter px-3 py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="font-inter px-3 py-3 text-xs text-slate-600">
                      {item.reference}
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