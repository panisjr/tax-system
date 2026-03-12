'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ListChecks, Pencil, Plus } from 'lucide-react';

// TODO: fetch from Supabase — query smv_schedule, assessment_level_schedule, depreciation_schedule
type SmvEntry = { use: string; unitValue: string; effectivity: string };
type AssessmentLevel = { classification: string; actualUse: string; range: string; level: string };
type DepreciationEntry = { type: string; rate: string; max: string };

const landSchedule: SmvEntry[] = [];
const assessmentLevels: AssessmentLevel[] = [];
const depreciationSchedule: DepreciationEntry[] = [];

const classificationColors: Record<string, string> = {
  Residential: 'bg-blue-50 text-blue-700',
  Commercial: 'bg-amber-50 text-amber-700',
  Agricultural: 'bg-green-50 text-green-700',
  Industrial: 'bg-purple-50 text-purple-700',
  Timberland: 'bg-teal-50 text-teal-700',
  Mineral: 'bg-stone-100 text-stone-700',
  Special: 'bg-orange-50 text-orange-700',
};

export default function AssessmentSchedulesPage() {
  const router = useRouter();

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
          <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Assessment Schedules</h1>
          <p className="font-inter mt-1 text-xs text-slate-400">Schedule of Market Values and Assessment Levels – Municipality of Sta. Rita, Samar</p>
        </div>
        <button
          type="button"
          className="font-inter inline-flex cursor-pointer items-center gap-2 rounded bg-[#0f1729] px-4 py-2 text-xs font-medium text-[#8A9098] hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Schedule Entry
        </button>
      </header>

      {/* Ordinance Info Banner */}
      <div className="mb-6 rounded-sm border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <ListChecks className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-inter text-sm font-semibold text-blue-800">Municipal Ordinance No. 2023-14</p>
            <p className="font-inter mt-1 text-xs text-blue-600">
              An Ordinance Providing the Schedule of Market Values for Real Properties and Prescribing the Assessment Levels in the Municipality of Sta. Rita, Samar. Effectivity: January 1, 2024.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* Schedule of Market Values */}
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#00154A]" />
              <h2 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
                Schedule of Market Values (SMV) – Land
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-inter text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide w-8">#</th>
                  <th className="px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide">Classification / Actual Use</th>
                  <th className="px-4 py-3 text-right text-[#595a5d] font-semibold uppercase tracking-wide whitespace-nowrap">Base Unit Market Value (₱/sqm)</th>
                  <th className="px-4 py-3 text-center text-[#595a5d] font-semibold uppercase tracking-wide">Effectivity Year</th>
                  <th className="px-4 py-3 text-center text-[#595a5d] font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {landSchedule.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#595a5d]">{row.use}</td>
                    <td className="px-4 py-3 text-right text-slate-600">₱{row.unitValue}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{row.effectivity}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        title="Edit"
                        className="text-slate-400 hover:text-amber-600 cursor-pointer transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment Level Schedule */}
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#00154A]" />
              <h2 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
                Assessment Level Schedule
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-inter text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide">Classification</th>
                  <th className="px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide">Actual Use</th>
                  <th className="px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide whitespace-nowrap">Market Value Range</th>
                  <th className="px-4 py-3 text-center text-[#595a5d] font-semibold uppercase tracking-wide whitespace-nowrap">Assessment Level</th>
                  <th className="px-4 py-3 text-center text-[#595a5d] font-semibold uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessmentLevels.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${classificationColors[row.classification] ?? 'bg-gray-100 text-gray-600'}`}>
                        {row.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.actualUse}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.range}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-[#595a5d]">
                        {row.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        title="Edit"
                        className="text-slate-400 hover:text-amber-600 cursor-pointer transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Depreciation Schedule Note */}
        <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-4 w-4 text-[#00154A]" />
            <h2 className="font-inter text-xs font-semibold uppercase tracking-wide text-[#848794]">
              Building Depreciation Schedule (Reference)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {depreciationSchedule.map((item) => (
              <div key={item.type} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <p className="font-inter text-xs font-semibold text-[#595a5d]">{item.type}</p>
                <p className="font-inter mt-1 text-xs text-slate-500">Rate: <span className="font-medium text-slate-700">{item.rate}</span></p>
                <p className="font-inter text-xs text-slate-500">Max Depreciation: <span className="font-medium text-slate-700">{item.max}</span></p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
