// app/component/AnalyticsCard.tsx
import { Lexend } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend',
});

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

export default function AnalyticsCard() {
  return (
    <main>
      <div className='bg-gray-100 p-5 font-sans'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>Dashboard Overview</h1>
            <button className={`${inter.className} bg-[#0f1729] text-[#9fa2aa] px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors`}>
              Generate Report
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className={`${inter.className} text-sm font-medium text-[#b6beca] mb-2`}>Total Properties</h2>
              <p className={`${inter.className} text-2xl font-semibold text-[#565a6a]`}>12,458</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className={`${inter.className} text-sm font-medium text-[#b6beca] mb-2`}>Registered Taxpayers</h2>
              <p className={`${inter.className} text-2xl font-semibold text-[#565a6a]`}>9,203</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className={`${inter.className} text-sm font-medium text-[#b6beca] mb-2`}>Total Assessment Value</h2>
              <p className={`${inter.className} text-2xl font-semibold text-[#565a6a]`}>$8.4B</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className={`${inter.className} text-sm font-medium text-[#b6beca] mb-2`}>Collections This Year</h2>
              <p className={`${inter.className} text-2xl font-semibold text-[#565a6a]`}>p5.6B</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
