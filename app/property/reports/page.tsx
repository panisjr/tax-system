'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  FileDown,
  Printer,
  CalendarDays,
  MapPin,
  Shield,
  ClipboardList,
} from 'lucide-react';

const barangays = [
  'All Barangays', 'Bacubac', 'Bagacay', 'Balonga-as', 'Barayong', 'Binalayan',
  'Buenavista', 'Cagbigti', 'Calunangan', 'Caluwayan', 'Camumucmuc', 'Capacuhan',
  'Corocawayan', 'Cotmon', 'Dao', 'Flores', 'Gabas', 'Ilag', 'Pinamorotan',
  'Poblacion', 'San Jose', 'Tagalag', 'Urdaneta', 'Zaragoza',
];

const reportTypes = [
  {
    id: 'td-print',
    icon: FileText,
    title: 'Tax Declaration Print',
    description: 'Print individual Tax Declaration form with full assessment details and property information',
    variant: 'primary' as const,
    fields: ['tdNumber'],
  },
  {
    id: 'assessment-roll',
    icon: ClipboardList,
    title: 'Assessment Roll by Barangay',
    description: 'Official list of all properties with their assessed values grouped per barangay',
    variant: 'primary' as const,
    fields: ['barangay', 'year'],
  },
  {
    id: 'summary-list',
    icon: FileDown,
    title: 'Summary Assessment List',
    description: 'Consolidated summary of properties, market values, and assessed values by classification',
    variant: 'secondary' as const,
    fields: ['year', 'classification'],
  },
  {
    id: 'certified-copy',
    icon: Shield,
    title: 'Certified True Copy of TD',
    description: 'Issue a certified true copy of a Tax Declaration for use in legal or official transactions',
    variant: 'secondary' as const,
    fields: ['tdNumber'],
  },
  {
    id: 'delinquency-report',
    icon: CalendarDays,
    title: 'Delinquency Report',
    description: 'List of properties with unpaid or overdue real property taxes for a given period',
    variant: 'secondary' as const,
    fields: ['year', 'barangay'],
  },
  {
    id: 'barangay-summary',
    icon: MapPin,
    title: 'Barangay Property Summary',
    description: 'Aggregate total properties, land area, market values, and assessed values by barangay',
    variant: 'secondary' as const,
    fields: ['year'],
  },
];

export default function ReportsCertificationsPage() {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [year, setYear] = useState('2024');
  const [barangay, setBarangay] = useState('All Barangays');
  const [classification, setClassification] = useState('');
  const [tdNumber, setTdNumber] = useState('');

  const selected = reportTypes.find((r) => r.id === selectedReport);

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

      <header className="mb-6">
        <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Reports & Certifications</h1>
        <p className="font-inter mt-1 text-xs text-slate-400">
          Generate Assessor Reports and Official Certifications – Municipality of Sta. Rita, Samar
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Report Type Cards */}
        <div className="lg:col-span-2">
          <p className="font-inter mb-4 text-xs text-slate-400">Select a report type to configure and generate.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;
              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReport(report.id)}
                  className={`group rounded-sm border p-5 text-left shadow-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300'
                      : 'border-gray-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <Icon className={`mb-3 h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-[#00154A]'}`} />
                  <h3 className={`font-inter text-sm font-semibold ${isSelected ? 'text-blue-800' : 'text-[#848794]'}`}>
                    {report.title}
                  </h3>
                  <p className={`font-inter mt-1 text-xs ${isSelected ? 'text-blue-600' : 'text-[#C0C7D0]'}`}>
                    {report.description}
                  </p>
                  <div className={`mt-3 text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    {isSelected ? '✓ Selected' : 'Click to select →'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generation Panel */}
        <div>
          <div className="sticky top-6 rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
            {!selected ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="mb-3 h-10 w-10 text-slate-300" />
                <p className="font-inter text-xs font-semibold text-[#848794]">Select a Report Type</p>
                <p className="font-inter mt-1 text-xs text-slate-400">
                  Choose from the available report types on the left to configure parameters.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center gap-2">
                  <div className="rounded-md bg-slate-100 p-2">
                    <selected.icon className="h-5 w-5 text-[#00154A]" />
                  </div>
                  <div>
                    <h2 className="font-inter text-sm font-semibold text-[#595a5d]">{selected.title}</h2>
                    <p className="font-inter text-xs text-slate-400">Configure parameters below</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selected.fields.includes('tdNumber') && (
                    <div>
                      <label className="font-inter text-xs font-medium text-slate-600">
                        TD Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={tdNumber}
                        onChange={(e) => setTdNumber(e.target.value)}
                        placeholder="e.g. TD-2024-0001"
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                  )}
                  {selected.fields.includes('year') && (
                    <div>
                      <label className="font-inter text-xs font-medium text-slate-600">Tax Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        {['2024', '2023', '2022', '2021', '2020', '2019'].map((y) => (
                          <option key={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selected.fields.includes('barangay') && (
                    <div>
                      <label className="font-inter text-xs font-medium text-slate-600">Barangay</label>
                      <select
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        {barangays.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  )}
                  {selected.fields.includes('classification') && (
                    <div>
                      <label className="font-inter text-xs font-medium text-slate-600">Classification</label>
                      <select
                        value={classification}
                        onChange={(e) => setClassification(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 font-inter text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        <option value="">All Classifications</option>
                        {['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Special', 'Timberland'].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    className="font-inter w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-[#0f1729] px-4 py-2.5 text-xs font-medium text-[#8A9098] hover:bg-slate-800 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                    Generate & Download
                  </button>
                  <button
                    type="button"
                    className="font-inter w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Print Preview
                  </button>
                </div>

                <div className="mt-4 rounded-md border border-gray-100 bg-gray-50 p-3">
                  <p className="font-inter text-xs text-slate-400">
                    Generated reports are in PDF format and will include the official municipality header and certification signature block.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
