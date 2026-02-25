// app/component/AnalyticsCard.tsx

export default function AnalyticsCard() {
  return (
    <main>
      <div className='bg-gray-100 p-6 min-h-screen font-sans'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-semibold text-gray-800'>Dashboard Overview</h1>
            <button className='bg-[#1f2937] text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors'>
              Generate Report
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Total Properties</h2>
              <p className='text-3xl font-semibold text-gray-700'>12,458</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Registered Taxpayers</h2>
              <p className='text-3xl font-semibold text-gray-700'>9,203</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Total Assessment Value</h2>
              <p className='text-3xl font-semibold text-gray-700'>$8.4B</p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Collections This Year</h2>
              <p className='text-3xl font-semibold text-gray-700'>₱5.6B</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
