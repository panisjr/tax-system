'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ValidatedInput } from '@/components/ui/ValidatedInput';
import {
  ArrowLeft,
  Save,
  UserRound,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const OWNER_TYPE_OPTIONS = ['Individual', 'Corporate', 'Government'] as const;
type OwnerType = (typeof OWNER_TYPE_OPTIONS)[number];

type FormState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  tin: string;
  owner_type: OwnerType | '';
  address: string;
  phone: string;
  email: string;
};

const initialForm: FormState = {
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  tin: '',
  owner_type: '',
  address: '',
  phone: '',
  email: '',
};

export default function RegisterTaxpayerPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const missingRequired = useMemo(
    () =>
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.owner_type ||
      !form.address.trim(),
    [form],
  );

  let previewName = [form.first_name, form.middle_name, form.last_name, form.suffix]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(' ') || '(Required)';

  if (previewName.length > 25) {
    previewName = previewName.slice(0, 22) + '...';
  }

  async function handleSave() {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (missingRequired) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/taxpayers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { error?: string; message?: string; };

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to register taxpayer.');
        return;
      }

      toast.success(data.message ?? 'Taxpayer registered successfully.');
      setForm(initialForm);

      setTimeout(() => {
        router.push('/taxpayers/list');
      }, 1200);
    } catch {
      toast.error('Unable to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <button
          type="button"
          onClick={() => router.push('/taxpayers')}
          className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Taxpayer Records
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Register New Taxpayer</h1>
            <p className="font-inter mt-1 text-xs text-slate-400">
              Create a new taxpayer profile in the system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/taxpayers')}
              className="font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="font-inter h-10 inline-flex cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Taxpayer'}
            </button>
          </div>
        </div>
      </header>

      {(errorMessage || successMessage) && (
        <div
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            errorMessage
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {errorMessage ?? successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Personal / Entity Information */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <UserRound className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Taxpayer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="First Name"
                required
                value={form.first_name}
                onChange={(v) => updateField('first_name', v)}
              />
              <Field
                label="Middle Name"
                value={form.middle_name}
                onChange={(v) => updateField('middle_name', v)}
              />
              <Field
                label="Last Name"
                required
                value={form.last_name}
                onChange={(v) => updateField('last_name', v)}
              />
              <Field
                label="Suffix"
                placeholder="Jr., Sr., III…"
                value={form.suffix}
                onChange={(v) => updateField('suffix', v)}
              />
              <ValidatedInput
                type="tin"
                placeholder="000-000-000 or 000-000-000-000"
                value={form.tin}
                onChange={(v) => updateField('tin', v)}
              />
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">
                  Owner Type
                  <span className="ml-1 text-rose-500">*</span>
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {OWNER_TYPE_OPTIONS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('owner_type', type)}
                      className={`font-inter rounded-md border px-3 py-2 text-xs transition cursor-pointer ${
                        form.owner_type === type
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact & Address */}
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-md bg-slate-100 p-2">
                <MapPin className="h-5 w-5 text-[#00154A]" />
              </div>
              <h2 className="font-inter text-sm font-semibold text-[#848794]">
                Contact & Address
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  required
                  placeholder="Street, Barangay, Municipality"
                  value={form.address}
                  onChange={(v) => updateField('address', v)}
                />
              </div>
                <ValidatedInput
                  type="phone" // Important: Use 'phone' so it picks up your mask/validator
                  label="Phone"
                  placeholder="e.g. 912 345 6789"
                  value={form.phone}
                  leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
                  onChange={(maskedValue) => {
                  updateField('phone', maskedValue);
                }}
              />
              <Field
                label="Email"
                placeholder="example@email.com"
                inputType="email"
                value={form.email}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                onChange={(v) => updateField('email', v)}
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <div>
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Summary</h2>
            <p className="font-inter mt-1 text-xs text-slate-400">
              Required fields: First Name, Last Name, Owner Type, Address.
            </p>

            <div className="mt-4 space-y-3">
              <SummaryRow label="Full Name" value={previewName} />
              <SummaryRow label="TIN"       value={form.tin.trim() || '—'} />
              <SummaryRow label="Type"      value={form.owner_type || '(Required)'} />
              <SummaryRow
                label="Address"
                value={form.address.trim() ? form.address.trim() : '(Required)'}
              />
            </div>

            {missingRequired && (
              <p className="font-inter mt-4 text-xs text-rose-600">
                Complete all required fields before saving.
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
  inputType = 'text',
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  inputType?: 'text' | 'email' | 'tel';
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
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-inter text-xs text-slate-500 shrink-0">{label}</span>
      <span className="font-inter text-xs font-medium text-slate-900 text-right wrap-break-word">{value}</span>
    </div>
  );
}
