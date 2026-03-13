"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Lock,
  KeyRound,
  Smartphone,
  Timer,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useSecurity } from "@/contexts/SecurityContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { policy, updatePolicy } = useSecurity();

  // Password Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePolicy({ minLength: parseInt(e.target.value) || 12 });
  };

  const handleSave = () => {
    toast.success("Security settings saved!");
  };

  return (
    <div className="w-full p-6">
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
              Security Settings
            </h1>
            <p className="font-inter mt-1 text-xs text-slate-400">
              Configure password policies, session controls, and multi-factor authentication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/user"
              className="font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <Button
              onClick={handleSave}
              className="font-inter inline-flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Password Policy */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Lock className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-lexend text-sm font-semibold text-[#848794]">
                  Password Policy
                </h2>
                <p className="font-inter text-xs text-slate-400">
                  Enforce strong passwords and periodic rotation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Minimum Length
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
                  <input
                    type="number"
                    className="font-inter w-full bg-transparent text-sm text-slate-900 outline-none"
                    min="8"
                    max="128"
                    value={policy.minLength}
                    onChange={handleMinLengthChange}
                  />
                  <span className="font-inter text-xs text-slate-400 whitespace-nowrap">chars</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <ToggleRow 
                  id="upper-lower"
                  title="Require Uppercase & Lowercase"
                  checked={policy.requireUpperLower}
                  onCheckedChange={(checked) => updatePolicy({ requireUpperLower: !!checked })}
                />
                <ToggleRow 
                  id="numbers"
                  title="Require Numbers"
                  checked={policy.requireNumbers}
                  onCheckedChange={(checked) => updatePolicy({ requireNumbers: !!checked })}
                />
                <ToggleRow 
                  id="special"
                  title="Require Special Characters"
                  checked={policy.requireSpecial}
                  onCheckedChange={(checked) => updatePolicy({ requireSpecial: !!checked })}
                />
              </div>
            </div>

            <div className="mt-4 rounded-md border border-amber-100 bg-amber-50 p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="font-inter text-xs text-amber-700">
                <span className="font-bold">Reminder:</span> Strong password rules reduce unauthorized access and improve audit compliance.
              </div>
            </div>
          </section>

          {/* Session Control */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Timer className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-lexend text-sm font-semibold text-[#848794]">
                  Session Control
                </h2>
                <p className="font-inter text-xs text-slate-400">
                  Manage session duration and idle timeout behavior.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Idle Timeout" placeholder="15" rightAddon="mins" helper="Auto-logout after inactivity" />
              <Field label="Max Session Duration" placeholder="8" rightAddon="hrs" helper="Maximum login duration" />
              
              <div className="sm:col-span-2 space-y-3 mt-2">
                <ToggleRow id="single-session" title="Single Active Session" description="Prevent multi-device logins." />
                <ToggleRow id="lock-account" title="Lock Account After Failed Attempts" description="Temporary lock after repeated fails." defaultChecked />
              </div>

              <Field label="Failed Attempts Limit" placeholder="5" helper="Lock after X attempts" />
              <Field label="Lock Duration" placeholder="30" rightAddon="mins" helper="Unlock after X minutes" />
            </div>
          </section>

          {/* MFA */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Smartphone className="h-5 w-5 text-[#00154A]" />
              </div>
              <div>
                <h2 className="font-lexend text-sm font-semibold text-[#848794]">
                  Multi-Factor Authentication (MFA)
                </h2>
                <p className="font-inter text-xs text-slate-400">
                  Add an extra layer of protection.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ToggleRow id="mfa-enable" title="Enable MFA" description="Require a second verification step." />
              <ToggleRow id="mfa-admin" title="Require MFA for Admin Role" description="Always enforce for Admins." defaultChecked />
              <ToggleRow id="mfa-treasurer" title="Require MFA for Treasurer Module" description="Enforce when accessing collections." />
            </div>
          </section>

          {/* Change Password */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <KeyRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-lexend text-sm font-semibold text-[#848794]">Change Password</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordField label="Current Password" show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
              <div className="hidden sm:block" />
              <PasswordField label="New Password" show={showNew} onToggle={() => setShowNew(!showNew)} />
              <PasswordField label="Confirm Password" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm">Clear</Button>
              <Button size="sm" className="bg-[#0F172A]">Update Password</Button>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-md bg-slate-100 p-2">
                <Shield className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-lexend text-sm font-semibold text-[#848794]">Overview</h2>
            </div>

            <div className="space-y-3">
              <SummaryRow label="Password Policy" value="Configured" ok />
              <SummaryRow label="Session Timeout" value="Configured" ok />
              <SummaryRow label="MFA" value="Optional" />
              <SummaryRow label="Account Lockout" value="Enabled" ok />
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm bg-slate-50/50">
            <h2 className="font-lexend text-sm font-semibold text-[#848794]">Notes</h2>
            <p className="font-inter mt-2 text-xs text-slate-400">
              Client-side UI does not prevent access. Enforce access rules on the server via middleware.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function Field({ label, placeholder, helper, type = "text", rightAddon }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter text-xs font-medium text-slate-600">{label}</label>
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
        <input type={type} className="w-full bg-transparent text-sm outline-none" placeholder={placeholder} />
        {rightAddon && <span className="text-xs text-slate-400 font-medium">{rightAddon}</span>}
      </div>
      {helper && <p className="text-[10px] text-slate-500">{helper}</p>}
    </div>
  );
}

function PasswordField({ label, show, onToggle }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter text-xs font-medium text-slate-600">{label}</label>
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
        <input type={show ? "text" : "password"} className="w-full bg-transparent text-sm outline-none" placeholder="••••••••" />
        <button type="button" onClick={onToggle} className="text-slate-400 hover:text-slate-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ id, title, description, checked, onCheckedChange, defaultChecked }: any) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-gray-200 bg-white p-3 hover:bg-slate-50 transition-colors">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} defaultChecked={defaultChecked} className="mt-0.5" />
      <div className="grid gap-0.5">
        <label htmlFor={id} className="text-sm font-medium text-slate-900 leading-none cursor-pointer">{title}</label>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, ok }: any) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        {ok ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
        <span className="text-xs font-bold text-slate-700">{value}</span>
      </div>
    </div>
  );
}