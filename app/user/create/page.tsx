"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type FormState = {
  empID: string;
  firstname: string;
  middlename: string;
  lastname: string;
  suffix: string;
  birthdate: string;
  age: string;
  sex: boolean;
  temp_pass: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  position: string;
  status: boolean;
};

const initialFormState: FormState = {
  empID: "",
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  birthdate: "",
  age: "",
  sex: true,
  temp_pass: "",
  password: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  position: "",
  status: true,
};

export default function CreateUserPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const missingRequiredFields = useMemo(() => {
    const requiredValues = [
      form.empID,
      form.firstname,
      form.lastname,
      form.birthdate,
      form.age,
      form.temp_pass,
      form.password,
      form.email,
      form.phone,
      form.role,
      form.department,
      form.position,
    ];

    return requiredValues.some((value) => value.trim().length === 0);
  }, [form]);

  const isBirthdateValid = useMemo(() => {
    if (!form.birthdate) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(form.birthdate);
  }, [form.birthdate]);

  const handleSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (missingRequiredFields) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (!isBirthdateValid) {
      setErrorMessage("Birthdate must be in yyyy-mm-dd format.");
      return;
    }

    if (form.temp_pass !== form.password) {
      setErrorMessage("Temporary password and password must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Failed to create user.");
        return;
      }

      setSuccessMessage(data.message ?? "User created successfully.");
      setForm(initialFormState);
      setTimeout(() => {
        router.push("/user/view");
      }, 1200);
    } catch {
      setErrorMessage("Unable to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/user")}
          className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User Management
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Create New User</h1>
            <p className="font-inter mt-1 text-xs text-slate-400">
              Add required user information and role access details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/user"
              className="font-inter h-10 inline-flex items-center rounded px-5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>

            <button
              type="button"
              disabled={isSubmitting}
              className="font-inter h-10 inline-flex cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving..." : "Save User"}</span>
            </button>
          </div>
        </div>
      </header>

      {(errorMessage || successMessage) && (
        <div
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            errorMessage
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {errorMessage ?? successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <UserRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Emp ID" required value={form.empID} onChange={(v) => updateField("empID", v)} />
              <Field label="First Name" required value={form.firstname} onChange={(v) => updateField("firstname", v)} />
              <Field label="Middle Name" value={form.middlename} onChange={(v) => updateField("middlename", v)} />
              <Field label="Last Name" required value={form.lastname} onChange={(v) => updateField("lastname", v)} />
              <Field label="Suffix" value={form.suffix} onChange={(v) => updateField("suffix", v)} />
              <Field
                label="Birthdate"
                required
                placeholder="yyyy-mm-dd"
                value={form.birthdate}
                onChange={(v) => updateField("birthdate", v)}
              />
              <Field label="Age" required value={form.age} onChange={(v) => updateField("age", v)} />

              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Sex
                  <span className="ml-1 text-rose-500">*</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <BooleanChip
                    label="Male"
                    checked={form.sex}
                    onClick={() => updateField("sex", true)}
                  />
                  <BooleanChip
                    label="Female"
                    checked={!form.sex}
                    onClick={() => updateField("sex", false)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <Mail className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">Contact & Work Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                required
                value={form.email}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                onChange={(v) => updateField("email", v)}
              />
              <Field
                label="Phone"
                required
                value={form.phone}
                leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                onChange={(v) => updateField("phone", v)}
              />
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-400" />
                    Role
                  </span>
                  <span className="ml-1 text-rose-500">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <RoleRadio
                    label="Admin"
                    checked={form.role === "Admin"}
                    onChange={() => updateField("role", "Admin")}
                  />
                  <RoleRadio
                    label="Assessor"
                    checked={form.role === "Assessor"}
                    onChange={() => updateField("role", "Assessor")}
                  />
                  <RoleRadio
                    label="Treasurer"
                    checked={form.role === "Treasurer"}
                    onChange={() => updateField("role", "Treasurer")}
                  />
                  <RoleRadio
                    label="Viewer"
                    checked={form.role === "Viewer"}
                    onChange={() => updateField("role", "Viewer")}
                  />
                </div>
              </div>
              <Field
                label="Department"
                required
                value={form.department}
                leftIcon={<Building2 className="h-4 w-4 text-slate-400" />}
                onChange={(v) => updateField("department", v)}
              />
              <Field
                label="Position"
                required
                value={form.position}
                onChange={(v) => updateField("position", v)}
              />

              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Status
                  <span className="ml-1 text-rose-500">*</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <BooleanChip
                    label="Active"
                    checked={form.status}
                    onClick={() => updateField("status", true)}
                  />
                  <BooleanChip
                    label="Inactive"
                    checked={!form.status}
                    onClick={() => updateField("status", false)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <KeyRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">Security</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordField
                label="Temp Pass"
                required
                value={form.temp_pass}
                show={showTempPassword}
                onToggle={() => setShowTempPassword((v) => !v)}
                onChange={(v) => updateField("temp_pass", v)}
              />
              <PasswordField
                label="Password"
                required
                value={form.password}
                show={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                onChange={(v) => updateField("password", v)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Summary</h2>
            <p className="font-inter mt-1 text-xs text-slate-400">
              All listed fields are required. Birthdate format: yyyy-mm-dd.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <SummaryRow label="Name" value={`${form.firstname} ${form.middlename} ${form.lastname} ${form.suffix}`.trim() || "(Required)"} />
              <SummaryRow label="Emp ID" value={form.empID || "(Required)"} />
              <SummaryRow label="Role" value={form.role || "(Required)"} />
              <SummaryRow label="Status" value={form.status ? "Active" : "Inactive"} />
            </div>

            {(missingRequiredFields || !isBirthdateValid) && (
              <p className="font-inter mt-4 text-xs text-rose-600">
                Complete all required fields and use valid birthdate format.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  leftIcon,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-inter text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        {leftIcon}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  show,
  onToggle,
  value,
  onChange,
  required = false,
}: {
  label: string;
  show: boolean;
  onToggle: () => void;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-inter text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={show ? "text" : "password"}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
    </div>
  );
}

function BooleanChip({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-inter rounded-md border px-3 py-2 text-xs transition ${
        checked
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-slate-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function RoleRadio({
  label,
  checked,
  onChange,
}: {
  label: "Admin" | "Assessor" | "Treasurer" | "Viewer";
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="font-inter inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs text-slate-700 hover:bg-gray-50">
      <input type="radio" name="role" checked={checked} onChange={onChange} className="h-4 w-4" />
      {label}
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
