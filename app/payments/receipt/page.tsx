"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Search,
  ReceiptText,
  FileText,
} from "lucide-react";

export default function IssueReceiptPage() {
  const router = useRouter();

  return (
    <main>
      <div className="flex-1">
        {/* Header Section */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Payments Monitoring
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
                Issue Official Receipt
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Generate and print official receipts for posted RPT payments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                className="font-inter inline-flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800"
              >
                <Printer className="h-4 w-4" />
                Generate & Print O.R.
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {/* Section 1: Find Payment */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Search className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-inter text-sm font-semibold text-[#848794]">
                  Find Posted Payment
                </h2>
                <p className="font-inter text-[11px] text-slate-400 mt-0.5">
                  Search by Tax Declaration No. or Taxpayer Name
                </p>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="font-inter text-xs font-medium text-slate-600">
                  Search Query <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter TDN or Name..."
                  className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900"
                />
              </div>
              <button className="font-inter h-[38px] px-6 rounded bg-[#00154A] text-white text-xs font-medium hover:bg-blue-900 transition-colors">
                Search
              </button>
            </div>
          </section>

          {/* Section 2: Receipt Details */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <ReceiptText className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Receipt Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  O.R. Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543"
                  className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900"
                />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Date of Issue <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 text-slate-900 cursor-pointer"
                />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Issued By (Cashier/Treasurer){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900"
                />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Fund Type <span className="text-rose-500">*</span>
                </label>
                <select className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 bg-white text-slate-900">
                  <option value="general">General Fund</option>
                  <option value="sef">Special Education Fund (SEF)</option>
                  <option value="trust">Trust Fund</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Payment Summary (Read-Only Preview) */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <FileText className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Payment Summary Preview
              </h2>
            </div>

            <div className="bg-slate-50 rounded-md border border-gray-200 p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter text-slate-500">Basic Tax</span>
                <span className="font-inter font-medium text-slate-900">
                  ₱0.00
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter text-slate-500">
                  Special Education Fund (SEF)
                </span>
                <span className="font-inter font-medium text-slate-900">
                  ₱0.00
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter text-slate-500">
                  Penalties / Interests
                </span>
                <span className="font-inter font-medium text-slate-900">
                  ₱0.00
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-inter font-semibold text-slate-700">
                  Total Amount
                </span>
                <span className="font-inter font-bold text-lg text-[#00154A]">
                  ₱0.00
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
