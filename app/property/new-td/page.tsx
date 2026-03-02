'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building2, MapPin, Layers, Home, BarChart3, FileText, User } from 'lucide-react';

const barangays = [
  'Bacubac', 'Bagacay', 'Balonga-as', 'Barayong', 'Binalayan', 'Buenavista',
  'Cagbigti', 'Calunangan', 'Caluwayan', 'Camumucmuc', 'Capacuhan', 'Corocawayan',
  'Cotmon', 'Dao', 'Flores', 'Gabas', 'Ilag', 'Pinamorotan', 'Poblacion',
  'San Jose', 'Tagalag', 'Urdaneta', 'Zaragoza',
];

export default function NewTaxDeclarationPage() {
  const router = useRouter();

  // Declaration Info
  const [tdNumber, setTdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [prevTd, setPrevTd] = useState('');
  const [declarationType, setDeclarationType] = useState('New');
  const [arpNumber, setArpNumber] = useState('');
  const [taxYear, setTaxYear] = useState('2024');

  // Owner Info
  const [ownerName, setOwnerName] = useState('');
  const [tin, setTin] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerType, setOwnerType] = useState('Individual');

  // Property Location
  const [barangay, setBarangay] = useState('');
  const [street, setStreet] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');

  // Land Details
  const [classification, setClassification] = useState('Residential');
  const [actualUse, setActualUse] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnitValue, setLandUnitValue] = useState('');
  const [landMarketValue, setLandMarketValue] = useState('');
  const [landAssessLevel, setLandAssessLevel] = useState('');
  const [landAssessedValue, setLandAssessedValue] = useState('');

  // Building Details
  const [buildingKind, setBuildingKind] = useState('');
  const [structuralType, setStructuralType] = useState('');
  const [floorArea, setFloorArea] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [bldgMarketValue, setBldgMarketValue] = useState('');
  const [bldgAssessLevel, setBldgAssessLevel] = useState('');
  const [bldgAssessedValue, setBldgAssessedValue] = useState('');

  // Effectivity
  const [effectivityYear, setEffectivityYear] = useState('2024');
  const [effectivityQuarter, setEffectivityQuarter] = useState('1st');

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

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">New Tax Declaration</h1>
          <p className="font-inter mt-1 text-xs text-slate-400">
            Create Tax Declaration for Newly Declared Properties – Municipality of Sta. Rita, Samar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/property')}
            className="font-inter inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="font-inter inline-flex h-10 cursor-pointer items-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />
            Save Tax Declaration
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">

          {/* Declaration Information */}
          <Section icon={<FileText className="h-5 w-5 text-[#00154A]" />} title="Declaration Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="TD Number" placeholder="e.g. TD-2024-0001" value={tdNumber} onChange={setTdNumber} required />
              <Field label="Property Index Number (PIN)" placeholder="e.g. 088-01-001-01-001" value={pin} onChange={setPin} required />
              <Field label="Previous TD Number" placeholder="If revision or cancellation" value={prevTd} onChange={setPrevTd} />
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Declaration Type <span className="text-rose-500">*</span></label>
                <select
                  value={declarationType}
                  onChange={(e) => setDeclarationType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {['New', 'Revision', 'Cancellation', 'Transfer'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="ARP Number" placeholder="Assessment Roll of Property #" value={arpNumber} onChange={setArpNumber} />
              <Field label="Tax Year" placeholder="e.g. 2024" value={taxYear} onChange={setTaxYear} required />
            </div>
          </Section>

          {/* Owner Information */}
          <Section icon={<User className="h-5 w-5 text-[#00154A]" />} title="Owner Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Owner / Taxpayer Name" placeholder="Last, First Middle" value={ownerName} onChange={setOwnerName} required />
              <Field label="Tax Identification Number (TIN)" placeholder="e.g. 123-456-789" value={tin} onChange={setTin} />
              <div className="sm:col-span-2">
                <Field label="Owner Address" placeholder="Complete address of owner" value={ownerAddress} onChange={setOwnerAddress} required />
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Owner Type <span className="text-rose-500">*</span></label>
                <div className="mt-1 flex gap-2">
                  {['Individual', 'Corporation', 'Government'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOwnerType(t)}
                      className={`font-inter rounded-md border px-3 py-2 text-xs transition cursor-pointer ${ownerType === t ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-slate-600 hover:bg-gray-50'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Property Location */}
          <Section icon={<MapPin className="h-5 w-5 text-[#00154A]" />} title="Property Location">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Municipality <span className="text-rose-500">*</span></label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                  <span className="font-inter text-sm text-slate-500">Sta. Rita, Samar</span>
                </div>
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Barangay <span className="text-rose-500">*</span></label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <Field label="Street / Road" placeholder="Street or road name" value={street} onChange={setStreet} />
              <Field label="Lot Number" placeholder="e.g. Lot 12" value={lotNumber} onChange={setLotNumber} />
              <Field label="Block Number" placeholder="e.g. Block 5" value={blockNumber} onChange={setBlockNumber} />
              <Field label="Survey / Cadastral Number" placeholder="e.g. Cad. 088-D" value={surveyNumber} onChange={setSurveyNumber} />
            </div>
          </Section>

          {/* Land Details */}
          <Section icon={<Layers className="h-5 w-5 text-[#00154A]" />} title="Land Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Classification <span className="text-rose-500">*</span></label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Special', 'Timberland', 'Mineral'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Actual Use" placeholder="e.g. Single-Family Dwelling" value={actualUse} onChange={setActualUse} required />
              <Field label="Land Area (sqm)" placeholder="e.g. 250.00" value={landArea} onChange={setLandArea} required />
              <Field label="Unit Value (₱ per sqm)" placeholder="e.g. 5,000.00" value={landUnitValue} onChange={setLandUnitValue} required />
              <Field label="Land Market Value (₱)" placeholder="Auto-computed" value={landMarketValue} onChange={setLandMarketValue} />
              <Field label="Assessment Level (%)" placeholder="e.g. 20" value={landAssessLevel} onChange={setLandAssessLevel} required />
              <Field label="Land Assessed Value (₱)" placeholder="Auto-computed" value={landAssessedValue} onChange={setLandAssessedValue} />
            </div>
          </Section>

          {/* Building / Improvement Details */}
          <Section icon={<Home className="h-5 w-5 text-[#00154A]" />} title="Building / Improvement Details">
            <p className="font-inter mb-4 text-xs text-slate-400">Leave blank if land only.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Kind of Building" placeholder="e.g. Single Detached, Apartment" value={buildingKind} onChange={setBuildingKind} />
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Structural Type</label>
                <select
                  value={structuralType}
                  onChange={(e) => setStructuralType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Select type</option>
                  {['Type I – Wood', 'Type II – Mixed', 'Type III – Masonry/Steel', 'Type IV – Steel/RC', 'Type V – RC'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Floor Area (sqm)" placeholder="e.g. 120.00" value={floorArea} onChange={setFloorArea} />
              <Field label="Year Built" placeholder="e.g. 2010" value={yearBuilt} onChange={setYearBuilt} />
              <Field label="Building Market Value (₱)" placeholder="e.g. 1,200,000.00" value={bldgMarketValue} onChange={setBldgMarketValue} />
              <Field label="Assessment Level (%)" placeholder="e.g. 20" value={bldgAssessLevel} onChange={setBldgAssessLevel} />
              <Field label="Building Assessed Value (₱)" placeholder="Auto-computed" value={bldgAssessedValue} onChange={setBldgAssessedValue} />
            </div>
          </Section>

          {/* Effectivity & Total Valuation */}
          <Section icon={<BarChart3 className="h-5 w-5 text-[#00154A]" />} title="Effectivity & Total Valuation">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Year of Effectivity" placeholder="e.g. 2024" value={effectivityYear} onChange={setEffectivityYear} required />
              <div>
                <label className="font-inter text-xs font-medium text-slate-600">Quarter <span className="text-rose-500">*</span></label>
                <select
                  value={effectivityQuarter}
                  onChange={(e) => setEffectivityQuarter(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {['1st', '2nd', '3rd', '4th'].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-inter mb-3 text-xs font-semibold uppercase tracking-wide text-[#595a5d]">Total Valuation Summary</h3>
              <div className="space-y-2">
                <ValuationRow label="Land Market Value" value={landMarketValue ? `₱${landMarketValue}` : '—'} />
                <ValuationRow label="Building Market Value" value={bldgMarketValue ? `₱${bldgMarketValue}` : '—'} />
                <ValuationRow label="Land Assessed Value" value={landAssessedValue ? `₱${landAssessedValue}` : '—'} />
                <ValuationRow label="Building Assessed Value" value={bldgAssessedValue ? `₱${bldgAssessedValue}` : '—'} />
                <div className="border-t border-gray-200 pt-2">
                  <ValuationRow label="Total Market Value" value="—" bold />
                  <ValuationRow label="Total Assessed Value" value="—" bold />
                </div>
              </div>
            </div>
          </Section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Declaration Summary</h2>
            <p className="font-inter mt-1 text-xs text-slate-400">Fields marked with * are required.</p>
            <div className="mt-4 space-y-3">
              <SummaryRow label="TD Number" value={tdNumber || '(Required)'} />
              <SummaryRow label="Owner" value={ownerName || '(Required)'} />
              <SummaryRow label="Barangay" value={barangay || '(Required)'} />
              <SummaryRow label="Classification" value={classification} />
              <SummaryRow label="Tax Year" value={taxYear || '(Required)'} />
              <SummaryRow label="Type" value={declarationType} />
              <SummaryRow label="Effectivity" value={`${effectivityQuarter} Qtr ${effectivityYear}`} />
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Assessment Levels Reference</h2>
            <div className="mt-3 space-y-2 font-inter text-xs text-slate-500">
              {[
                ['Residential', '20%'],
                ['Commercial', '40–50%'],
                ['Agricultural', '40%'],
                ['Industrial', '50%'],
                ['Special', '10–30%'],
                ['Timberland', '20%'],
              ].map(([cls, lvl]) => (
                <div key={cls} className="flex justify-between">
                  <span>{cls}</span>
                  <span className="font-medium text-[#595a5d]">{lvl}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-inter text-sm font-semibold text-[#848794]">Required Documents</h2>
            <ul className="mt-3 space-y-2 font-inter text-xs text-slate-500">
              {[
                'Deed of Sale / Transfer Document',
                'Lot Plan / Survey Plan',
                'Building Permit (if applicable)',
                'Tax Clearance Certificate',
                'Valid Government-issued ID',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
                  {doc}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-slate-100 p-2">{icon}</div>
        <h2 className="font-inter text-sm font-semibold text-[#848794]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-inter text-xs font-medium text-slate-600">
        {label}{required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="mt-1 flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-inter text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function ValuationRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`font-inter text-xs ${bold ? 'font-semibold text-[#595a5d]' : 'text-slate-500'}`}>{label}</span>
      <span className={`font-inter text-xs ${bold ? 'font-bold text-[#595a5d]' : 'text-slate-600'}`}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-inter text-xs text-slate-500">{label}</span>
      <span className="font-inter text-xs font-medium text-slate-900">{value}</span>
    </div>
  );
}
