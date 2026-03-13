"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, Wallet, CreditCard } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { ValidatedInput } from "@/components/ui/ValidatedInput";


export default function PaymentChannelsPage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');


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
                Payment Channels Configuration
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Manage cash, bank deposits, and online payment methods for RPT
                collection.
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
                <Save className="h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {/* Section 1: Official Bank Accounts */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Building2 className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-inter text-sm font-semibold text-[#848794]">
                  Official Depository Banks
                </h2>
                <p className="font-inter text-[11px] text-slate-400 mt-0.5">
                  LGU bank accounts for direct deposits and online transfers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <Combobox
                  label=""
                  options={[
                    { value: 'landbank', label: 'Landbank of the Philippines' },
                    { value: 'dbp', label: 'Development Bank of the Philippines' },
                    { value: 'other', label: 'Other Commercial Bank' }
                  ]}
                  value={selectedBank}
                  onChange={setSelectedBank}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Account Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="LGU Sta. Rita - General Fund"
                  className="font-inter mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400 text-slate-900"
                />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Account Number <span className="text-rose-500">*</span>
                </label>
                <ValidatedInput
                  validator="account-number"
                  value={accountNumber}
                  onChange={setAccountNumber}
                  placeholder="1234-5678-90"
                  className="mt-1"
                />

              </div>
            </div>

            <button className="font-inter mt-4 text-xs font-medium text-[#00154A] hover:underline">
              + Add another bank account
            </button>
          </section>

          {/* Section 2: Over-the-Counter Methods */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <CreditCard className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Over-the-Counter Methods
              </h2>
            </div>

            <div className="space-y-3">
              <label className="font-inter flex items-center gap-3 rounded border border-gray-200 px-4 py-3 text-sm text-slate-700 bg-slate-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    Cash Payments
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Standard over-the-counter cash acceptance
                  </span>
                </div>
              </label>

              <label className="font-inter flex items-center gap-3 rounded border border-gray-200 px-4 py-3 text-sm text-slate-700 bg-slate-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    Manager's / Cashier's Check
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Require check clearing validation prior to OR issuance
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Section 3: E-Wallets & Digital Payments */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Wallet className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-inter text-sm font-semibold text-[#848794]">
                  Digital Payments & E-Wallets
                </h2>
                <p className="font-inter text-[11px] text-slate-400 mt-0.5">
                  Enable API integrations or QR code payments
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-inter flex items-center gap-3 rounded border border-gray-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    GCash Integration
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Generate dynamic QR codes for tax assessments
                  </span>
                </div>
              </label>

              <label className="font-inter flex items-center gap-3 rounded border border-gray-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">
                    Maya Integration
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Accept PayMaya and credit/debit card payments via Maya
                    Checkout
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
