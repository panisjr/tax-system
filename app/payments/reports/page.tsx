"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  FileSpreadsheet,
} from "lucide-react";

// Mock Data Types
type ReportRecord = {
  id: string;
  date: string;
  orNumber: string;
  taxpayer: string;
  tdn: string;
  amount: number;
  method: string;
};

export default function CollectionReportsPage() {
  const router = useRouter();

  const [reportType, setReportType] = useState<"daily" | "monthly" | "annual">("daily");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportRecord[] | null>(null);

  // Dynamic filter states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportData(null);

    // Simulate an API call delay
    setTimeout(() => {
      // Generate some dummy data for the preview
      const dummyData: ReportRecord[] = [
        { id: "1", date: "03/05/2026", orNumber: "OR-9822-123456", taxpayer: "Juan Dela Cruz", tdn: "12-3456-789", amount: 1500.00, method: "Cash" },
        { id: "2", date: "03/05/2026", orNumber: "OR-9832-123457", taxpayer: "Maria Santos", tdn: "12-9876-543", amount: 3200.50, method: "Online Transfer" },
        { id: "3", date: "03/05/2026", orNumber: "OR-9842-123458", taxpayer: "Pedro Penduko", tdn: "12-1122-334", amount: 850.00, method: "GCash" },
        { id: "4", date: "03/05/2026", orNumber: "OR-9852-123459", taxpayer: "Ana Reyes", tdn: "12-5566-778", amount: 5400.00, method: "Manager's Check" },
      ];
      setReportData(dummyData);
      setIsGenerating(false);
    }, 800);
  };

  const totalCollection = reportData?.reduce((sum, record) => sum + record.amount, 0) || 0;

  return (
    <div className="flex">
      <main className="flex-1">
        {/* Header Section */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
                Collection Reports
              </h1>
              <p className="font-inter mt-1 text-xs text-slate-400">
                Generate daily, monthly, and annual collection reports.
              </p>
            </div>
          </div>
        </header>

        {/* Report Configuration Card */}
        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2">
              <Filter className="h-5 w-5 text-[#00154A]" />
            </div>
            <h2 className="font-inter text-sm font-semibold text-[#848794]">
              Report Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Report Type Selector */}
            <div className="lg:col-span-4">
              <label className="font-inter mb-2 block text-xs font-medium text-slate-600">
                Report Type
              </label>
              <div className="flex rounded-md border border-gray-200 bg-slate-50 p-1">
                {(["daily", "monthly", "annual"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setReportType(type)}
                    className={`font-inter flex-1 rounded px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      reportType === type
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Date Selectors */}
            <div className="lg:col-span-5">
              <label className="font-inter mb-2 block text-xs font-medium text-slate-600">
                Select {reportType === "daily" ? "Date" : reportType === "monthly" ? "Month" : "Year"}
              </label>
              
              {reportType === "daily" && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="font-inter w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 text-slate-700"
                />
              )}

              {reportType === "monthly" && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="font-inter w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 text-slate-700"
                />
              )}

              {reportType === "annual" && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="font-inter w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 bg-white"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex items-end lg:col-span-3">
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="font-inter flex w-full h-10 cursor-pointer items-center justify-center gap-2 rounded bg-[#0F172A] px-5 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 text-[#8A9098]" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section (Only visible after clicking Generate) */}
        {reportData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <p className="font-inter text-xs font-medium text-slate-500">Total Collections</p>
                <p className="font-lexend mt-2 text-2xl font-bold text-[#0F172A]">
                  ₱{totalCollection.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <p className="font-inter text-xs font-medium text-slate-500">Total Transactions</p>
                <p className="font-lexend mt-2 text-2xl font-bold text-[#0F172A]">
                  {reportData.length}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-lg border border-gray-200 bg-slate-50 p-5 shadow-sm">
                 <button className="font-inter mb-2 flex items-center justify-center gap-2 rounded border border-gray-200 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-gray-50 transition">
                    <Download className="h-3.5 w-3.5" /> Export as PDF
                 </button>
                 <button className="font-inter flex items-center justify-center gap-2 rounded border border-gray-200 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-gray-50 transition">
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel
                 </button>
              </div>
            </div>

            {/* Data Table */}
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-slate-50 p-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <h3 className="font-inter text-sm font-semibold text-slate-700">
                  Transaction Ledger
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-800px border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-white">
                      <th className="font-inter px-4 py-3 text-left text-xs font-semibold text-slate-500">Date</th>
                      <th className="font-inter px-4 py-3 text-left text-xs font-semibold text-slate-500">O.R. Number</th>
                      <th className="font-inter px-4 py-3 text-left text-xs font-semibold text-slate-500">Taxpayer</th>
                      <th className="font-inter px-4 py-3 text-left text-xs font-semibold text-slate-500">TDN</th>
                      <th className="font-inter px-4 py-3 text-left text-xs font-semibold text-slate-500">Method</th>
                      <th className="font-inter px-4 py-3 text-right text-xs font-semibold text-slate-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 transition-colors hover:bg-slate-50">
                        <td className="font-inter px-4 py-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                            {record.date}
                          </div>
                        </td>
                        <td className="font-inter px-4 py-3 text-sm font-medium text-slate-700">{record.orNumber}</td>
                        <td className="font-inter px-4 py-3 text-sm text-slate-600">{record.taxpayer}</td>
                        <td className="font-inter px-4 py-3 text-sm text-slate-500">{record.tdn}</td>
                        <td className="font-inter px-4 py-3 text-sm text-slate-500">
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs">{record.method}</span>
                        </td>
                        <td className="font-inter px-4 py-3 text-right text-sm font-medium text-emerald-600">
                          ₱{record.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}