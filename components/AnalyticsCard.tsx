import { Lexend } from 'next/font/google';
import { Inter } from 'next/font/google';
import StatBox from './StatBox';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['600'] });

export default function AnalyticsCard() {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>
          Dashboard Overview
        </h1>
        <button className={`${inter.className} bg-[#0f1729] text-[#9fa2aa] px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors`}>
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Properties" value="12,458" />
        <StatBox label="Registered Taxpayers" value="9,203" />
        <StatBox label="Total Assessment Value" value="$8.4B" />
        <StatBox label="Collections This Year" value="₱5.6B" />
      </div>
    </div>
  );
}