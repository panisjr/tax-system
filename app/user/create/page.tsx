"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  Building2,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";

export default function CreateUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [status, setStatus] = useState<"Active" | "Inactive" | "Pending">(
    "Active",
  );

  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/user"
          className={`font-lexend mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 cursor-pointer`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User Management
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
              Create New User
            </h1>
            <p className={`font-inter mt-1 text-xs text-slate-400`}>            
              Create a new account and assign role-based access for system
              modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/user"
              className={`font-inter h-10 inline-flex items-center px-5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors rounded cursor-pointer`}
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>

            <button
              type="button"
              className={`font-inter h-10 inline-flex items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 cursor-pointer`}
              onClick={() => {
                // design-only
              }}
            >
              <Save className="h-4 w-4" />
              <span>Save User</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <UserRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name" placeholder="Juan" />
              <Field label="Last Name" placeholder="Dela Cruz" />
              <Field
                label="Username"
                placeholder="juan.delacruz"
                helper="Used for login and activity logs."
              />
              <Field label="Employee ID" placeholder="EMP-000123" />
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <Mail className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Email Address"
                placeholder="juan@example.com"
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
              />
              <Field
                label="Mobile Number"
                placeholder="+63 9XX XXX XXXX"
                leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
              />
              <Field
                label="Office / Department"
                placeholder="Treasurer’s Office"
                leftIcon={<Building2 className="h-4 w-4 text-slate-400" />}
              />
              <Field label="Position" placeholder="Revenue Officer" />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <KeyRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">Security</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordField
                label="Temporary Password"
                placeholder="••••••••"
                show={showTempPassword}
                onToggle={() => setShowTempPassword((v) => !v)}
                helper="User will be prompted to change this on first login."
              />

              <PasswordField
                label="Confirm Password"
                placeholder="••••••••"
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300"
                defaultChecked
              />
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Require password reset on first login
                </div>
                <div className="font-inter text-xs text-slate-400">
                  Recommended for security and auditing.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Role + Summary */}
        <div className="space-y-6">
          {/* Role Assignment */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <Shield className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Role Assignment
              </h2>
            </div>

            <div className="space-y-3">
              <RadioRow
                title="Admin"
                description="Full access to all modules, user management, and system settings."
              />
              <RadioRow
                title="Assessor"
                description="Access to assessment modules, valuation records, and reports."
              />
              <RadioRow
                title="Treasurer"
                description="Access to collections, payment records, and delinquency monitoring."
              />
              <RadioRow
                title="Viewer"
                description="Read-only access for dashboards and reports."
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Status
              </label>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600">
                  Status
                </label>

                <Accordion type="single" collapsible className="mt-1">
                  <AccordionItem
                    value="status"
                    className="border border-gray-200 rounded-md"
                  >
                    <AccordionTrigger className="px-3 py-2 text-sm text-slate-900 hover:no-underline font-inter">
                      <span className="flex w-full items-center justify-between">
                        <span>{status}</span>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="px-2 pb-2">
                      <div className="space-y-1">
                        {(["Active", "Inactive", "Pending"] as const).map(
                          (s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStatus(s)}
                              className={`w-full text-left rounded-md px-3 py-2 text-sm font-inter transition ${
                                status === s
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
                              }`}
                            >
                              {s}
                            </button>
                          ),
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Summary</h2>
            <p className="font-inter mt-1 text-xs text-slate-400">
              This is a design-only preview. Hook up validation + API later.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <SummaryRow label="Default Role" value="(Select a role)" />
              <SummaryRow label="Status" value="Active" />
              <SummaryRow label="Password Reset" value="Required" />
            </div>

            <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-3">
              <div className="font-inter text-xs font-medium text-blue-700">
                Tip: Use role presets
              </div>
              <div className="font-inter mt-1 text-xs text-blue-600">
                Start with Admin/Assessor/Treasurer presets, then refine
                permissions later.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  helper,
  leftIcon,
}: {
  label: string;
  placeholder?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-inter text-xs font-medium text-slate-600">{label}</label>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        {leftIcon}
        <input
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
        />
      </div>
      {helper && <p className="font-inter mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  helper,
  show,
  onToggle,
}: {
  label: string;
  placeholder?: string;
  helper?: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="font-inter text-xs font-medium text-slate-600">{label}</label>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        <input
          type={show ? "text" : "password"}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="rounded p-1 text-slate-500 hover:bg-gray-50 hover:text-slate-900"
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {helper && <p className="font-inter mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

function RadioRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
      <input type="radio" name="role" className="mt-1 h-4 w-4" />
      <div>
        <div className="font-inter text-sm font-medium text-slate-900">{title}</div>
        <div className="font-inter text-xs text-slate-500">{description}</div>
      </div>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-inter text-slate-500">{label}</span>
      <span className="font-inter font-medium text-slate-900">{value}</span>
    </div>
  );
}
