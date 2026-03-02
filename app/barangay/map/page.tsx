import Link from 'next/link';
import BarangayPerformanceMap from '@/components/BarangayPerformanceMap';

export default function BarangayMapPage() {
  return (
    <div className="flex">
      <main className="flex-1">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Barangay Map View</h1>
            <p className="mt-1 font-inter text-xs text-slate-400">Sta. Rita RPT performance pins by barangay.</p>
          </div>
          <Link
            href="/barangay"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-50"
          >
            Back to Barangay Overview
          </Link>
        </header>

        <BarangayPerformanceMap />
      </main>
    </div>
  );
}