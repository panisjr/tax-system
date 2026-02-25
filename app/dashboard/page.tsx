'use client';

import React from 'react';
import AnalyticsCard from '@/components/AnalyticsCard';

export default function Dashboard() {
  return (
    <main className="bg-[#f0f4f8] min-h-screen pb-10">
      <AnalyticsCard />
  
      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-4">
        
        {/* Left Card: Monthly Collections Graph (Graph Temporarily Removed) */}
        <div className="bg-white border border-gray-200 p-6 grow md:w-2/3 shadow-sm">
          <h2 className="text-gray-500 text-sm font-medium mb-6">Monthly Collections</h2>
          
          {/* Container kept intact to preserve layout. Added a subtle placeholder background. */}
          <div className="relative h-75 w-full flex items-center justify-center border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
             <span className="text-gray-400 font-medium">Graph Placeholder</span>
          </div>
        </div>

        {/* Right Card: Delinquent Accounts Stats */}
        <div className="bg-white border border-gray-200 p-8 flex flex-col md:w-1/3 shadow-sm rounded-sm">
          <h2 className="text-gray-600 text-sm font-bold mb-6">Delinquent Accounts</h2>
          
          <ul className="text-gray-500 text-sm space-y-4">
            <li className="flex items-center">
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              1,245 properties overdue
            </li>
            <li className="flex items-center">
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              $320M unpaid taxes
            </li>
            <li className="flex items-center">
              <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
              18% delinquency rate
            </li>
          </ul>

          <div className="mt-10">
            <button className="w-full bg-[#0f1729] hover:bg-slate-800 text-gray-200 text-xs font-semibold py-2 px-4 rounded-sm transition-colors shadow-sm">
              View Delinquencies
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}