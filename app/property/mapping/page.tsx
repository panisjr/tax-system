'use client';

/**
 * Tax Mapping — app/property/mapping/page.tsx
 *
 * Barangay list is hardcoded (23 barangays).
 * A search bar (shadcn Input style) is placed above the barangay sidebar list
 * to filter entries dynamically — no layout or structure has been changed.
 *
 * TODO: Replace hardcoded barangayStats and propertiesByBarangay with data
 *       fetched from Supabase (via /api/property/mapping?barangay_id=X).
 */

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPinned, Eye, Search, X } from 'lucide-react';

// ── Hardcoded barangay list ────────────────────────────────────────────────────
const barangays = [
  'Bacubac', 'Bagacay', 'Balonga-as', 'Barayong', 'Binalayan', 'Buenavista',
  'Cagbigti', 'Calunangan', 'Caluwayan', 'Camumucmuc', 'Capacuhan', 'Corocawayan',
  'Cotmon', 'Dao', 'Flores', 'Gabas', 'Ilag', 'Pinamorotan', 'Poblacion',
  'San Jose', 'Tagalag', 'Urdaneta', 'Zaragoza',
];

// ── Types ──────────────────────────────────────────────────────────────────────
type PropertyEntry = {
  tdNumber:       string;
  owner:          string;
  classification: string;
  landArea:       string;
  marketValue:    string;
  assessedValue:  string;
};

type BarangayStats = {
  total:        number;
  residential:  number;
  commercial:   number;
  agricultural: number;
  landArea:     string;
  marketValue:  string;
  assessedValue: string;
};

const classificationColors: Record<string, string> = {
  Residential:  'bg-blue-50 text-blue-700',
  Commercial:   'bg-amber-50 text-amber-700',
  Agricultural: 'bg-green-50 text-green-700',
  Industrial:   'bg-purple-50 text-purple-700',
  Special:      'bg-orange-50 text-orange-700',
};

// ── Placeholder data (TODO: fetch from Supabase) ──────────────────────────────
const barangayStats: Record<string, BarangayStats> = {};
const propertiesByBarangay: Record<string, PropertyEntry[]> = {};

// ─────────────────────────────────────────────────────────────────────────────

export default function TaxMappingPage() {
  const router = useRouter();

  const [selectedBarangay, setSelectedBarangay] = useState('Poblacion');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the barangay list dynamically based on search input
  const filteredBarangays = useMemo(() => {
    if (!searchQuery.trim()) return barangays;
    const q = searchQuery.toLowerCase();
    return barangays.filter((b) => b.toLowerCase().includes(q));
  }, [searchQuery]);

  const stats      = barangayStats[selectedBarangay];
  const properties = propertiesByBarangay[selectedBarangay] ?? [];

  function handleBarangaySelect(name: string) {
    setSelectedBarangay(name);
    setSearchQuery(''); // clear search after selection
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

      <header className="mb-6">
        <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Tax Mapping</h1>
        <p className="font-inter mt-1 text-xs text-slate-400">
          Property Distribution by Barangay – Municipality of Sta. Rita, Samar
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* ── Barangay Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">

            {/* Sidebar header */}
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-[#00154A]" />
                <h2 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
                  Barangays
                </h2>
              </div>
            </div>

            {/* Search bar — shadcn Input style */}
            <div className="border-b border-gray-100 px-3 py-2">
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 transition-colors focus-within:border-blue-200 focus-within:ring-1 focus-within:ring-blue-100">
                <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search barangay..."
                  className="w-full bg-transparent font-inter text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  aria-label="Search barangays"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Barangay list */}
            <nav className="max-h-115 overflow-y-auto p-2">
              {filteredBarangays.length === 0 ? (
                <p className="px-3 py-4 text-center font-inter text-xs text-slate-400">
                  No barangay matches &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                filteredBarangays.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBarangaySelect(b)}
                    className={`font-inter w-full rounded px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                      selectedBarangay === b
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                ))
              )}
            </nav>

          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="space-y-6 lg:col-span-3">

          {/* Barangay Header */}
          <div className="flex items-center gap-3 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
            <div className="rounded-md bg-slate-100 p-2">
              <MapPinned className="h-5 w-5 text-[#00154A]" />
            </div>
            <div>
              <h2 className="font-lexend text-lg font-bold text-[#595a5d]">
                Barangay {selectedBarangay}
              </h2>
              <p className="font-inter text-xs text-slate-400">Municipality of Sta. Rita, Samar</p>
            </div>
          </div>

          {/* Stats Grid */}
          {stats ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Properties', value: stats.total.toLocaleString(),        color: 'text-[#595a5d]' },
                { label: 'Residential',      value: stats.residential.toLocaleString(),  color: 'text-blue-600' },
                { label: 'Commercial',       value: stats.commercial.toLocaleString(),   color: 'text-amber-600' },
                { label: 'Agricultural',     value: stats.agricultural.toLocaleString(), color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="font-inter text-xs text-slate-400">{s.label}</p>
                  <p className={`font-lexend mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-gray-200 bg-white p-6 text-center shadow-sm">
              <p className="font-inter text-xs text-slate-400">
                No property data available for Barangay {selectedBarangay}.
              </p>
            </div>
          )}

          {/* Valuation Stats */}
          {stats && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: 'Total Land Area (sqm)',    value: stats.landArea,      color: 'text-[#595a5d]' },
                { label: 'Total Market Value (₱)',   value: stats.marketValue,   color: 'text-amber-600' },
                { label: 'Total Assessed Value (₱)', value: stats.assessedValue, color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="font-inter text-xs text-slate-400">{s.label}</p>
                  <p className={`font-lexend mt-1 text-sm font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Map Placeholder */}
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
                Property Map – Barangay {selectedBarangay}
              </h3>
            </div>
            <div className="flex h-48 items-center justify-center bg-gray-50">
              <div className="text-center">
                <MapPinned className="mx-auto h-10 w-10 text-slate-300" />
                <p className="font-inter mt-2 text-xs text-slate-400">
                  Interactive GIS map integration coming soon
                </p>
                <p className="font-inter text-xs text-slate-300">
                  Cadastral data for Barangay {selectedBarangay}
                </p>
              </div>
            </div>
          </div>

          {/* Property Table */}
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
                Properties in Barangay {selectedBarangay}
                {properties.length > 0 && (
                  <span className="ml-2 font-normal text-slate-400">
                    ({properties.length} shown)
                  </span>
                )}
              </h3>
            </div>

            {properties.length === 0 ? (
              <p className="font-inter p-6 text-center text-xs text-slate-400">
                No property records found for Barangay {selectedBarangay}.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full font-inter text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {[
                        'TD Number', 'Owner Name', 'Classification',
                        'Land Area (sqm)', 'Market Value (₱)', 'Assessed Value (₱)', 'Actions',
                      ].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-left font-semibold uppercase tracking-wide text-[#595a5d]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr
                        key={p.tdNumber}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-[#595a5d]">
                          {p.tdNumber}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">{p.owner}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${classificationColors[p.classification] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {p.classification}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.landArea}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{p.marketValue}</td>
                        <td className="px-4 py-3 text-right font-medium text-[#595a5d]">
                          {p.assessedValue}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            title="View"
                            className="cursor-pointer text-slate-400 transition-colors hover:text-blue-600"
                            onClick={() => router.push(`/property/listing?td=${p.tdNumber}`)}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
