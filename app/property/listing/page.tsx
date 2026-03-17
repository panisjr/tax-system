'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Eye, SquarePen, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { toast } from 'sonner';

const STATUS_OPTIONS: ComboboxOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Revised', label: 'Revised' },
];

const DECLARATION_TYPE_OPTIONS: ComboboxOption[] = [
  { value: 'New', label: 'New' },
  { value: 'Revision', label: 'Revision' },
  { value: 'Cancellation', label: 'Cancellation' },
  { value: 'Transfer', label: 'Transfer' },
];

const OWNER_TYPE_OPTIONS: ComboboxOption[] = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Corporation', label: 'Corporation' },
  { value: 'Government', label: 'Government' },
];

const CLASSIFICATION_OPTIONS: ComboboxOption[] = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Agricultural', label: 'Agricultural' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Special', label: 'Special' },
  { value: 'Timberland', label: 'Timberland' },
  { value: 'Mineral', label: 'Mineral' },
];

const ACTUAL_USE_OPTIONS: ComboboxOption[] = [
  { value: 'Single-Family Dwelling', label: 'Single-Family Dwelling' },
  { value: 'Multi-Family Dwelling', label: 'Multi-Family Dwelling' },
  { value: 'Vacant Residential Lot', label: 'Vacant Residential Lot' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Office', label: 'Office' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Rice Land', label: 'Rice Land' },
  { value: 'Corn Land', label: 'Corn Land' },
  { value: 'Coconut Land', label: 'Coconut Land' },
  { value: 'Industrial Plant Site', label: 'Industrial Plant Site' },
];

const BUILDING_KIND_OPTIONS: ComboboxOption[] = [
  { value: 'Single Detached', label: 'Single Detached' },
  { value: 'Duplex', label: 'Duplex' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Commercial Building', label: 'Commercial Building' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Office Building', label: 'Office Building' },
  { value: 'Industrial Building', label: 'Industrial Building' },
  { value: 'Institutional Building', label: 'Institutional Building' },
  { value: 'Mixed-Use Building', label: 'Mixed-Use Building' },
];

const STRUCTURAL_TYPE_OPTIONS: ComboboxOption[] = [
  { value: 'Type I Wood', label: 'Type I Wood' },
  { value: 'Type II Mixed', label: 'Type II Mixed' },
  { value: 'Type III Masonry/Steel', label: 'Type III Masonry/Steel' },
  { value: 'Type IV Steel/RC', label: 'Type IV Steel/RC' },
  { value: 'Type V RC', label: 'Type V RC' },
];

const QUARTER_OPTIONS: ComboboxOption[] = [
  { value: '1st', label: '1st' },
  { value: '2nd', label: '2nd' },
  { value: '3rd', label: '3rd' },
  { value: '4th', label: '4th' },
];

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEAR_OPTIONS: ComboboxOption[] = Array.from({ length: 21 }, (_, index) => {
  const year = String(CURRENT_YEAR + 5 - index);
  return { value: year, label: year };
});

const EDIT_MODAL_TOTAL_PAGES = 5;

type Property = {
  id: number;
  tdNumber: string;
  pin: string;
  owner: string;
  classification: string;
  barangay: string;
  landArea: string;
  marketValue: string;
  assessLevel: string;
  assessedValue: string;
  status: string;
};

type ListingApiRow = {
  id: number;
  td_number: string | null;
  classification: string | null;
  land_area: number | null;
  total_market_value: number | null;
  land_assessment_level: number | null;
  total_assessed_value: number | null;
  status: string | null;
  taxpayers: { owner_name: string | null } | { owner_name: string | null }[] | null;
  properties:
    | { pin: string | null; barangays: { name: string | null } | { name: string | null }[] | null }
    | { pin: string | null; barangays: { name: string | null } | { name: string | null }[] | null }[]
    | null;
};

type PropertyEditForm = {
  tdNumber: string;
  pin: string;
  prevTdNumber: string;
  declarationType: string;
  arpNumber: string;
  taxYear: string;
  taxpayer: string;
  tin: string;
  ownerAddress: string;
  ownerType: string;
  classification: string;
  barangay: string;
  street: string;
  lotNumber: string;
  blockNumber: string;
  surveyNumber: string;
  actualUse: string;
  landArea: string;
  landUnitValue: string;
  landMarketValue: string;
  landAssessLevel: string;
  landAssessedValue: string;
  buildingKind: string;
  structuralType: string;
  floorArea: string;
  yearBuilt: string;
  bldgMarketValue: string;
  bldgAssessLevel: string;
  bldgAssessedValue: string;
  effectivityYear: string;
  effectivityQuarter: string;
  status: string;
};

type NumericInputOptions = {
  allowDecimal?: boolean;
  maxIntegerDigits: number;
  maxDecimalDigits?: number;
};

const classificationColors: Record<string, string> = {
  Residential: 'bg-blue-50 text-blue-700',
  Commercial: 'bg-amber-50 text-amber-700',
  Agricultural: 'bg-green-50 text-green-700',
  Industrial: 'bg-purple-50 text-purple-700',
  Special: 'bg-orange-50 text-orange-700',
};

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-600',
  Revised: 'bg-yellow-50 text-yellow-700',
};

function sanitizeNumericInput(raw: string, options: NumericInputOptions): string {
  const { allowDecimal = false, maxIntegerDigits, maxDecimalDigits = 0 } = options;
  const cleaned = raw.replace(/,/g, '').replace(allowDecimal ? /[^\d.]/g : /\D/g, '');

  if (!allowDecimal) return cleaned.slice(0, maxIntegerDigits);

  const firstDot = cleaned.indexOf('.');
  const normalized = firstDot >= 0
    ? `${cleaned.slice(0, firstDot)}.${cleaned.slice(firstDot + 1).replace(/\./g, '')}`
    : cleaned;

  const [intPartRaw = '', decPartRaw = ''] = normalized.split('.');
  const intPart = intPartRaw.slice(0, maxIntegerDigits);
  const hasDot = normalized.includes('.');
  const decPart = decPartRaw.slice(0, maxDecimalDigits);

  if (!hasDot) return intPart;
  return `${intPart}.${decPart}`;
}

function formatNumericInput(raw: string, options: NumericInputOptions): string {
  const sanitized = sanitizeNumericInput(raw, options);
  if (!sanitized) return '';

  const hasTrailingDot = sanitized.endsWith('.');
  const [intPart = '', decPart] = sanitized.split('.');
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!options.allowDecimal) return groupedInt;
  if (hasTrailingDot) return `${groupedInt}.`;
  if (decPart !== undefined) return `${groupedInt}.${decPart}`;
  return groupedInt;
}

function parseNumericString(value: string): number {
  return Number(value.replace(/,/g, '').trim());
}

function normalizeTdInput(raw: string): string {
  return raw.replace(/^\s*[Tt][Dd]-?\s*/, '').trimStart();
}

function formatTdSuffix(raw: string): string {
  const digits = normalizeTdInput(raw).replace(/\D/g, '').slice(0, 20);
  if (!digits) return '';
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join('-');
}

function formatPinInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (!digits) return '';

  const groups = [3, 2, 3, 2, 3];
  const parts: string[] = [];
  let index = 0;
  for (const group of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + group));
    index += group;
  }
  return parts.join('-');
}

function formatLotInput(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-/, '')
    .slice(0, 12);
}

export default function PropertyListingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editModalPage, setEditModalPage] = useState(1);
  const [editForm, setEditForm] = useState<PropertyEditForm>({
    tdNumber: '',
    pin: '',
    prevTdNumber: '',
    declarationType: 'New',
    arpNumber: '',
    taxYear: '',
    taxpayer: '',
    tin: '',
    ownerAddress: '',
    ownerType: 'Individual',
    classification: 'Residential',
    barangay: '',
    street: '',
    lotNumber: '',
    blockNumber: '',
    surveyNumber: '',
    actualUse: '',
    landArea: '',
    landUnitValue: '',
    landMarketValue: '',
    landAssessLevel: '',
    landAssessedValue: '',
    buildingKind: '',
    structuralType: '',
    floorArea: '',
    yearBuilt: '',
    bldgMarketValue: '',
    bldgAssessLevel: '',
    bldgAssessedValue: '',
    effectivityYear: '',
    effectivityQuarter: '1st',
    status: 'Active',
  });

  const pageSize = 20;

  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/properties/listing', { cache: 'no-store' });
        const body = await res.json();

        if (!res.ok) {
          setError(body?.error || 'Unable to load property listing.');
          setProperties([]);
          return;
        }

        const rows: ListingApiRow[] = Array.isArray(body?.rows) ? body.rows : [];
        const mapped: Property[] = rows.map((row) => {
          const taxpayer = Array.isArray(row.taxpayers) ? row.taxpayers[0] : row.taxpayers;
          const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
          const barangayRaw = property?.barangays;
          const barangay = Array.isArray(barangayRaw) ? barangayRaw[0] : barangayRaw;

          return {
            id: row.id,
            tdNumber: row.td_number || '—',
            pin: property?.pin || '—',
            owner: taxpayer?.owner_name || '—',
            classification: row.classification || '—',
            barangay: barangay?.name || '—',
            landArea: row.land_area == null ? '—' : row.land_area.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            marketValue: row.total_market_value == null ? '—' : `₱${row.total_market_value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            assessLevel: row.land_assessment_level == null ? '—' : `${Number(row.land_assessment_level).toFixed(2)}%`,
            assessedValue: row.total_assessed_value == null ? '—' : `₱${row.total_assessed_value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            status: row.status || '—',
          };
        });

        setProperties(mapped);
      } catch {
        setError('Unable to load property listing.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, []);

  const classOptions = useMemo<ComboboxOption[]>(() => {
    const values = [...new Set(properties.map((p) => p.classification).filter((v) => v && v !== '—'))].sort();
    return values.map((v) => ({ value: v, label: v }));
  }, [properties]);

  const barangayOptions = useMemo<ComboboxOption[]>(() => {
    const values = [...new Set(properties.map((p) => p.barangay).filter((v) => v && v !== '—'))].sort();
    return values.map((v) => ({ value: v, label: v }));
  }, [properties]);

  const taxpayerOptions = useMemo<ComboboxOption[]>(() => {
    const values = [...new Set(properties.map((p) => p.owner).filter((v) => v && v !== '—'))].sort();
    return values.map((v) => ({ value: v, label: v }));
  }, [properties]);

  const filtered = properties.filter((p) =>
    (p.tdNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.pin.includes(search) ||
      p.owner.toLowerCase().includes(search.toLowerCase())) &&
    (classFilter ? p.classification === classFilter : true) &&
    (barangayFilter ? p.barangay === barangayFilter : true) &&
    (statusFilter ? p.status === statusFilter : true)
  );

  useEffect(() => {
    setPage(1);
  }, [search, classFilter, barangayFilter, statusFilter]);

  useEffect(() => {
    if (!isEditOpen) return;
    const area = parseNumericString(editForm.landArea);
    const unit = parseNumericString(editForm.landUnitValue);
    const next = !Number.isFinite(area) || !Number.isFinite(unit) || area <= 0 || unit <= 0
      ? ''
      : formatNumericInput((area * unit).toFixed(2), { allowDecimal: true, maxIntegerDigits: 12, maxDecimalDigits: 2 });
    if (next !== editForm.landMarketValue) setEditForm((prev) => ({ ...prev, landMarketValue: next }));
  }, [isEditOpen, editForm.landArea, editForm.landUnitValue, editForm.landMarketValue]);

  useEffect(() => {
    if (!isEditOpen) return;
    const market = parseNumericString(editForm.landMarketValue);
    const level = parseNumericString(editForm.landAssessLevel);
    const next = !Number.isFinite(market) || !Number.isFinite(level) || market <= 0 || level <= 0
      ? ''
      : formatNumericInput((market * (level / 100)).toFixed(2), { allowDecimal: true, maxIntegerDigits: 12, maxDecimalDigits: 2 });
    if (next !== editForm.landAssessedValue) setEditForm((prev) => ({ ...prev, landAssessedValue: next }));
  }, [isEditOpen, editForm.landMarketValue, editForm.landAssessLevel, editForm.landAssessedValue]);

  useEffect(() => {
    if (!isEditOpen) return;
    const floor = parseNumericString(editForm.floorArea);
    const market = parseNumericString(editForm.bldgMarketValue);
    const level = parseNumericString(editForm.bldgAssessLevel);
    const next = !Number.isFinite(floor) || !Number.isFinite(market) || !Number.isFinite(level) || floor <= 0 || market <= 0 || level <= 0
      ? ''
      : formatNumericInput((market * (level / 100)).toFixed(2), { allowDecimal: true, maxIntegerDigits: 12, maxDecimalDigits: 2 });
    if (next !== editForm.bldgAssessedValue) setEditForm((prev) => ({ ...prev, bldgAssessedValue: next }));
  }, [isEditOpen, editForm.floorArea, editForm.bldgMarketValue, editForm.bldgAssessLevel, editForm.bldgAssessedValue]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(startIdx, startIdx + pageSize);
  const summaryStart = filtered.length === 0 ? 0 : startIdx + 1;
  const summaryEnd = Math.min(startIdx + pageSize, filtered.length);

  const totalProperties = properties.length;
  const totalResidential = properties.filter((p) => p.classification === 'Residential').length;
  const totalCommercial = properties.filter((p) => p.classification === 'Commercial').length;
  const totalAgricultural = properties.filter((p) => p.classification === 'Agricultural').length;

  function openEditModal(property: Property) {
    setEditingPropertyId(property.id);
    setEditForm({
      tdNumber: formatTdSuffix(property.tdNumber),
      pin: property.pin,
      prevTdNumber: '',
      declarationType: 'New',
      arpNumber: '',
      taxYear: '',
      taxpayer: property.owner,
      tin: '',
      ownerAddress: '',
      ownerType: 'Individual',
      classification: property.classification,
      barangay: property.barangay,
      street: '',
      lotNumber: '',
      blockNumber: '',
      surveyNumber: '',
      actualUse: '',
      landArea: property.landArea,
      landUnitValue: '',
      landMarketValue: property.marketValue.replace(/[^\d.,]/g, ''),
      landAssessLevel: property.assessLevel.replace(/[^\d.,]/g, ''),
      landAssessedValue: property.assessedValue.replace(/[^\d.,]/g, ''),
      buildingKind: '',
      structuralType: '',
      floorArea: '',
      yearBuilt: '',
      bldgMarketValue: '',
      bldgAssessLevel: '',
      bldgAssessedValue: '',
      effectivityYear: '',
      effectivityQuarter: '1st',
      status: property.status,
    });
    setEditModalPage(1);
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
    setEditingPropertyId(null);
    setEditModalPage(1);
  }

  function updateEditField<K extends keyof PropertyEditForm>(key: K, value: PropertyEditForm[K]) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveEditModal() {
    if (editingPropertyId == null) return;

    setProperties((prev) =>
      prev.map((item) =>
        item.id === editingPropertyId
          ? {
              id: editingPropertyId,
              tdNumber: editForm.tdNumber.trim() ? `TD-${editForm.tdNumber.trim()}` : '—',
              pin: editForm.pin || '—',
              owner: editForm.taxpayer || '—',
              classification: editForm.classification || '—',
              barangay: editForm.barangay || '—',
              landArea: editForm.landArea || '—',
              marketValue: editForm.landMarketValue ? `₱${editForm.landMarketValue}` : '—',
              assessLevel: editForm.landAssessLevel ? `${editForm.landAssessLevel}%` : '—',
              assessedValue: editForm.landAssessedValue ? `₱${editForm.landAssessedValue}` : '—',
              status: editForm.status || '—',
            }
          : item
      )
    );

    toast.success('Property details updated in list.');
    closeEditModal();
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => router.push('/property')}
        className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Property Registry
      </button>

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Property Listing</h1>
          <p className="font-inter mt-1 text-xs text-slate-400">All Registered Real Properties - Municipality of Sta. Rita, Samar</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/property/new-td')}
          className="font-inter inline-flex cursor-pointer items-center gap-2 rounded bg-[#0f1729] px-4 py-2 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Tax Declaration
        </button>
      </header>

      {error && (
        <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-2 font-inter text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Properties', value: totalProperties.toLocaleString('en-PH'), color: 'text-[#595a5d]' },
          { label: 'Residential', value: totalResidential.toLocaleString('en-PH'), color: 'text-blue-600' },
          { label: 'Commercial', value: totalCommercial.toLocaleString('en-PH'), color: 'text-amber-600' },
          { label: 'Agricultural', value: totalAgricultural.toLocaleString('en-PH'), color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-inter text-xs text-slate-400">{s.label}</p>
            <p className={`font-lexend mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-45 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search TD#, PIN, or Owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-inter w-full rounded-sm border border-gray-200 py-2 pl-8 pr-3 text-xs text-[#595a5d] focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="min-w-40">
            <Combobox placeholder="All Classifications" searchPlaceholder="Search classification..." options={classOptions} value={classFilter} onChange={setClassFilter} triggerClassName="rounded-sm text-xs py-1.5 text-slate-500" />
          </div>
          <div className="min-w-40">
            <Combobox placeholder="All Barangays" searchPlaceholder="Search barangay..." options={barangayOptions} value={barangayFilter} onChange={setBarangayFilter} triggerClassName="rounded-sm text-xs py-1.5 text-slate-500" />
          </div>
          <div className="min-w-35">
            <Combobox placeholder="All Statuses" searchPlaceholder="Search status..." options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} triggerClassName="rounded-sm text-xs py-1.5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['TD Number', 'PIN', 'Owner Name', 'Classification', 'Barangay', 'Land Area (sqm)', 'Market Value (₱)', 'Assess. Level', 'Assessed Value (₱)', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`whitespace-nowrap px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide ${h === 'Actions' ? 'sticky right-0 z-20 bg-gray-50 border-l border-gray-200' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="py-10 text-center text-slate-400">Loading property records...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={11} className="py-10 text-center text-slate-400">No properties found matching your filters.</td></tr>
              ) : (
                pageRows.map((p) => (
                  <tr key={p.id} className="group border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#595a5d] whitespace-nowrap">{p.tdNumber}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.pin}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{p.owner}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classificationColors[p.classification] ?? 'bg-gray-100 text-gray-600'}`}>{p.classification}</span></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.barangay}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.landArea}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.marketValue}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{p.assessLevel}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#595a5d]">{p.assessedValue}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[p.status] ?? 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                    <td className="sticky right-0 z-10 border-l border-gray-100 bg-white px-4 py-3 group-hover:bg-gray-50">
                      <div className="flex items-center justify-center gap-2">
                        <button title="View" className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"><Eye size={14} /></button>
                        <button title="Edit" onClick={() => openEditModal(p)} className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"><SquarePen size={14} /></button>
                        <button title="Print" className="text-slate-400 hover:text-green-600 transition-colors cursor-pointer"><Printer size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="font-inter text-xs text-slate-400">Showing {summaryStart}-{summaryEnd} of {filtered.length} properties</p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft size={14} /></button>
            <span className="font-inter px-2 text-xs text-slate-500">Page {safePage} of {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeEditModal}>
          <div className="swal2-show w-full max-w-lg rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-lexend mb-2 text-lg font-semibold text-[#0F172A]">Edit Property</h2>
            <p className="font-inter mb-4 text-sm text-slate-500">Update property details and click save to apply changes.</p>

            <div className="mb-4 flex items-center gap-2">
              {Array.from({ length: EDIT_MODAL_TOTAL_PAGES }, (_, index) => index + 1).map((step) => (
                <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= editModalPage ? 'bg-[#0F172A]' : 'bg-slate-200'}`} />
              ))}
            </div>

            <p className="font-inter mb-4 text-xs text-slate-400">
              {editModalPage === 1 && 'Declaration Information'}
              {editModalPage === 2 && 'Owner Information'}
              {editModalPage === 3 && 'Property Location'}
              {editModalPage === 4 && 'Land Details'}
              {editModalPage === 5 && 'Building / Effectivity'}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {editModalPage === 1 && (
                <>
                  <ModalField label="TD Number" value={editForm.tdNumber} onChange={(v) => updateEditField('tdNumber', formatTdSuffix(v))} prefix="TD-" placeholder="2026-" required />
                  <ModalField label="Property Index Number (PIN)" value={editForm.pin} onChange={(v) => updateEditField('pin', formatPinInput(v))} placeholder="e.g. 088-01-001-01-001" required />
                  <ModalField label="Previous TD Number" value={editForm.prevTdNumber} onChange={(v) => updateEditField('prevTdNumber', formatTdSuffix(v))} prefix="TD-" placeholder="If revision or cancellation" />
                  <ModalCombobox label="Declaration Type" value={editForm.declarationType} onChange={(v) => updateEditField('declarationType', v)} options={DECLARATION_TYPE_OPTIONS} placeholder="New" searchPlaceholder="Search declaration type..." required />
                  <ModalField label="ARP Number" value={editForm.arpNumber} onChange={(v) => updateEditField('arpNumber', v)} placeholder="Assessment Roll of Property #" />
                  <ModalCombobox label="Tax Year" value={editForm.taxYear} onChange={(v) => updateEditField('taxYear', v)} options={TAX_YEAR_OPTIONS} placeholder="Select tax year" searchPlaceholder="Search year..." required />
                </>
              )}

              {editModalPage === 2 && (
                <>
                  <ModalCombobox label="Owner / Taxpayer" value={editForm.taxpayer} onChange={(v) => updateEditField('taxpayer', v)} options={taxpayerOptions} placeholder="Select or search taxpayer" searchPlaceholder="Type owner name..." required />
                  <div className="sm:col-span-2 -mt-2"><p className="font-inter text-xs text-slate-400">Select an existing taxpayer or register a new one.</p></div>
                  <ModalField label="Tax Identification Number (TIN)" value={editForm.tin} onChange={(v) => updateEditField('tin', v)} placeholder="Auto-filled from taxpayer" />
                  <ModalField label="Owner Address" value={editForm.ownerAddress} onChange={(v) => updateEditField('ownerAddress', v)} placeholder="Complete address of owner" required />
                  <div className="sm:col-span-2">
                    <label className="font-inter mb-1 block text-xs font-medium text-slate-600">Owner Type <span className="ml-1 text-rose-500">*</span></label>
                    <div className="mt-1 flex gap-2">
                      {OWNER_TYPE_OPTIONS.map((option) => (
                        <button key={option.value} type="button" onClick={() => updateEditField('ownerType', option.value)} className={`font-inter rounded-md border px-3 py-2 text-xs transition cursor-pointer ${editForm.ownerType === option.value ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}>{option.label}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {editModalPage === 3 && (
                <>
                  <div>
                    <label className="font-inter mb-1 block text-xs font-medium text-slate-600">Municipality <span className="ml-1 text-rose-500">*</span></label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2"><span className="font-inter text-sm text-slate-500">Sta. Rita, Samar</span></div>
                  </div>
                  <ModalCombobox label="Barangay" value={editForm.barangay} onChange={(v) => updateEditField('barangay', v)} options={barangayOptions} placeholder="Select barangay" searchPlaceholder="Search barangay..." required />
                  <ModalField label="Street / Road" value={editForm.street} onChange={(v) => updateEditField('street', v)} placeholder="Street or road name" />
                  <ModalField label="Lot Number" value={editForm.lotNumber} onChange={(v) => updateEditField('lotNumber', formatLotInput(v))} prefix="Lot" placeholder="e.g. 12" />
                  <ModalField label="Block Number" value={editForm.blockNumber} onChange={(v) => updateEditField('blockNumber', formatLotInput(v))} prefix="Block" placeholder="e.g. 5" />
                  <ModalField label="Survey / Cadastral Number" value={editForm.surveyNumber} onChange={(v) => updateEditField('surveyNumber', formatLotInput(v))} prefix="Cad." placeholder="e.g. 088-D" />
                </>
              )}

              {editModalPage === 4 && (
                <>
                  <ModalCombobox label="Classification" value={editForm.classification} onChange={(v) => updateEditField('classification', v)} options={CLASSIFICATION_OPTIONS} placeholder="Residential" searchPlaceholder="Search classification..." required />
                  <ModalCombobox label="Actual Use" value={editForm.actualUse} onChange={(v) => updateEditField('actualUse', v)} options={ACTUAL_USE_OPTIONS} placeholder="Select actual use" searchPlaceholder="Search actual use..." required />
                  <ModalField label="Land Area (sqm)" value={editForm.landArea} onChange={(v) => updateEditField('landArea', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 10, maxDecimalDigits: 4 }))} placeholder="e.g. 250.00" required />
                  <ModalField label="Unit Value (P per sqm)" value={editForm.landUnitValue} onChange={(v) => updateEditField('landUnitValue', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 12, maxDecimalDigits: 2 }))} placeholder="e.g. 5,000.00" required />
                  <ModalField label="Land Market Value (P)" value={editForm.landMarketValue} onChange={(v) => updateEditField('landMarketValue', v)} placeholder="Auto-computed" readOnly />
                  <ModalField label="Assessment Level (%)" value={editForm.landAssessLevel} onChange={(v) => updateEditField('landAssessLevel', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 3, maxDecimalDigits: 2 }))} placeholder="e.g. 20" suffix="%" required />
                  <ModalField label="Land Assessed Value (P)" value={editForm.landAssessedValue} onChange={(v) => updateEditField('landAssessedValue', v)} placeholder="Auto-computed" readOnly />
                </>
              )}

              {editModalPage === 5 && (
                <>
                  <div className="sm:col-span-2 -mt-1"><p className="font-inter text-xs text-slate-400">Leave blank if land only.</p></div>
                  <ModalCombobox label="Kind of Building" value={editForm.buildingKind} onChange={(v) => updateEditField('buildingKind', v)} options={BUILDING_KIND_OPTIONS} placeholder="Select kind of building" searchPlaceholder="Search building kind..." />
                  <ModalCombobox label="Structural Type" value={editForm.structuralType} onChange={(v) => updateEditField('structuralType', v)} options={STRUCTURAL_TYPE_OPTIONS} placeholder="Select structural type" searchPlaceholder="Search structural type..." />
                  <ModalField label="Floor Area (sqm)" value={editForm.floorArea} onChange={(v) => updateEditField('floorArea', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 10, maxDecimalDigits: 4 }))} placeholder="e.g. 120.00" />
                  <ModalCombobox label="Year Built" value={editForm.yearBuilt} onChange={(v) => updateEditField('yearBuilt', v)} options={TAX_YEAR_OPTIONS} placeholder="Select year built" searchPlaceholder="Search year..." />
                  <ModalField label="Building Market Value (P)" value={editForm.bldgMarketValue} onChange={(v) => updateEditField('bldgMarketValue', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 12, maxDecimalDigits: 2 }))} placeholder="e.g. 1,200,000.00" />
                  <ModalField label="Assessment Level (%)" value={editForm.bldgAssessLevel} onChange={(v) => updateEditField('bldgAssessLevel', formatNumericInput(v, { allowDecimal: true, maxIntegerDigits: 3, maxDecimalDigits: 2 }))} placeholder="e.g. 20" suffix="%" />
                  <ModalField label="Building Assessed Value (P)" value={editForm.bldgAssessedValue} onChange={(v) => updateEditField('bldgAssessedValue', v)} placeholder="Auto-computed" readOnly />
                  <ModalCombobox label="Year of Effectivity" value={editForm.effectivityYear} onChange={(v) => updateEditField('effectivityYear', v)} options={TAX_YEAR_OPTIONS} placeholder="Select effectivity year" searchPlaceholder="Search year..." required />
                  <ModalCombobox label="Quarter" value={editForm.effectivityQuarter} onChange={(v) => updateEditField('effectivityQuarter', v)} options={QUARTER_OPTIONS} placeholder="1st" searchPlaceholder="Search quarter..." required />
                </>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeEditModal} className="border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer">Cancel</button>
              {editModalPage > 1 && (
                <button type="button" onClick={() => setEditModalPage((prev) => Math.max(1, prev - 1))} className="border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition cursor-pointer">Previous</button>
              )}
              {editModalPage < EDIT_MODAL_TOTAL_PAGES ? (
                <button type="button" onClick={() => setEditModalPage((prev) => Math.min(EDIT_MODAL_TOTAL_PAGES, prev + 1))} className="bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer">Next</button>
              ) : (
                <button type="button" onClick={saveEditModal} className="bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition cursor-pointer">Save Changes</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  prefix,
  suffix,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="font-inter mb-1 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        {prefix && <span className="font-inter shrink-0 text-sm text-slate-500">{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 ${readOnly ? 'bg-gray-100 text-slate-600 cursor-not-allowed' : 'text-slate-700'}`}
        />
        {suffix && <span className="font-inter text-sm text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}

function ModalCombobox({
  label,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder: string;
  searchPlaceholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-inter mb-1 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <Combobox
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        triggerClassName="rounded-md text-sm py-2 text-slate-700"
      />
    </div>
  );
}
