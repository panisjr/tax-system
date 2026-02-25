// app/component/AnalyticsCard.tsx

export default function AnalyticsCard() {
  return (
    // Outer container: No background color, added pt-6 for top padding
    <div className="w-full max-w-5xl mx-auto mb-6 pt-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-600">Dashboard Overview</h1>
            <button className="bg-[#0e1629] text-gray-200 px-4 py-2 rounded-sm text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                Generate Report
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Added bg-white back to the cards so they match Image 1 */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Total Properties</h2>
                <p className="text-3xl font-semibold text-gray-700">12,458</p>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Registered Taxpayers</h2>
                <p className="text-3xl font-semibold text-gray-700">9,203</p>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Total Assessment Value</h2>
                <p className="text-3xl font-semibold text-gray-700">$8.4B</p>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Collections This Year</h2>
                <p className="text-3xl font-semibold text-gray-700">₱5.6B</p>
            </div>
        </div>
    </div>
  );
}