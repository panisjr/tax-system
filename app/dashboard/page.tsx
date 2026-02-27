'use client';

import AnalyticsCard from '@/components/AnalyticsCard';
import MonthlyCollectionComponent from '@/components/MonthlyCollectionComponent';

import { Inter, Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

export default function Dashboard() {
  return (
    <main className="bg-[#f0f4f8]">
      <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>
                Dashboard Overview
              </h1>
              <button className={`${inter.className} bg-[#0f1729] text-[#9fa2aa] px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors`}>
                Generate Report
              </button>
            </div>
      <AnalyticsCard />
    </div>

      {/* Main Container */}

      <div className="w-full flex flex-col md:flex-row gap-4 m-0">

        <MonthlyCollectionComponent /> 

       {/* Right Card: Delinquent Accounts Stats */}
        <div className="bg-white border border-gray-200 p-8 flex flex-col mx-auto md:w-3/5 shadow-sm rounded-sm">
          <h2 className={`${inter.className} text-[#80838f] text-sm font-bold mb-6`}>Delinquent Accounts</h2>
          
          <ul className="text-gray-500 text-sm space-y-4">
            <li className={`${inter.className} text-[#989ba6] flex items-center`}>
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              1,245 properties overdue
            </li>
            <li className={`${inter.className} text-[#989ba6] flex items-center`}>
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              $320M unpaid taxes
            </li>
            <li className={`${inter.className} text-[#989ba6] flex items-center`}>
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              18% delinquency rate
            </li>
          </ul>

          <div className="mt-10">
            <button className={`${inter.className} w-full bg-[#0f1729] hover:bg-slate-800 text-[#949ba3] text-xs font-semibold py-2 px-4 rounded-sm transition-colors shadow-sm`}>
              View Delinquencies
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}