'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Eye, Pencil, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const barangays = [
  'Bacubac', 'Bagacay', 'Balonga-as', 'Barayong', 'Binalayan', 'Buenavista',
  'Cagbigti', 'Calunangan', 'Caluwayan', 'Camumucmuc', 'Capacuhan', 'Corocawayan',
  'Cotmon', 'Dao', 'Flores', 'Gabas', 'Ilag', 'Pinamorotan', 'Poblacion',
  'San Jose', 'Tagalag', 'Urdaneta', 'Zaragoza',
];

// TODO: fetch from Supabase — query tax_declarations joined with taxpayers, properties, barangays
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
const properties: Property[] = [];

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

export default function PropertyListingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = properties.filter((p) =>
    (p.tdNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.pin.includes(search) ||
      p.owner.toLowerCase().includes(search.toLowerCase())) &&
    (classFilter ? p.classification === classFilter : true) &&
    (barangayFilter ? p.barangay === barangayFilter : true) &&
    (statusFilter ? p.status === statusFilter : true)
  );

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
          <p className="font-inter mt-1 text-xs text-slate-400">All Registered Real Properties – Municipality of Sta. Rita, Samar</p>
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

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Properties', value: '3,482', color: 'text-[#595a5d]' },
          { label: 'Residential', value: '2,104', color: 'text-blue-600' },
          { label: 'Commercial', value: '648', color: 'text-amber-600' },
          { label: 'Agricultural', value: '730', color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-inter text-xs text-slate-400">{s.label}</p>
            <p className={`font-lexend mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
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
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="font-inter rounded-sm border border-gray-200 px-3 py-2 text-xs text-slate-500 focus:outline-none focus:border-slate-400"
          >
            <option value="">All Classifications</option>
            {['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Special'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className="font-inter rounded-sm border border-gray-200 px-3 py-2 text-xs text-slate-500 focus:outline-none focus:border-slate-400"
          >
            <option value="">All Barangays</option>
            {barangays.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="font-inter rounded-sm border border-gray-200 px-3 py-2 text-xs text-slate-500 focus:outline-none focus:border-slate-400"
          >
            <option value="">All Statuses</option>
            {['Active', 'Cancelled', 'Revised'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['TD Number', 'PIN', 'Owner Name', 'Classification', 'Barangay', 'Land Area (sqm)', 'Market Value (₱)', 'Assess. Level', 'Assessed Value (₱)', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400">No properties found matching your filters.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#595a5d] whitespace-nowrap">{p.tdNumber}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.pin}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{p.owner}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classificationColors[p.classification] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{p.barangay}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.landArea}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.marketValue}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{p.assessLevel}</td>
                    <td className="px-4 py-3 text-right font-medium text-[#595a5d]">{p.assessedValue}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button title="View" className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"><Eye size={14} /></button>
                        <button title="Edit" className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"><Pencil size={14} /></button>
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
          <p className="font-inter text-xs text-slate-400">Showing {filtered.length} of 3,482 properties</p>
          <div className="flex items-center gap-1">
            <button className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"><ChevronLeft size={14} /></button>
            <span className="font-inter px-2 text-xs text-slate-500">Page 1 of 116</span>
            <button className="cursor-pointer p-1 text-slate-400 hover:text-slate-600"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
