"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

type DelinquentTaxpayer = {
  id: number;
  full_name: string;
  tin: string;
  barangay_name: string;
  property_count: number;
  bucket: "Current" | "1 Year" | "2 Years" | "3 Years" | "5+ Years";
  total_due: string;
  years_due: string;
};

const bucketColors: Record<DelinquentTaxpayer["bucket"], string> = {
  Current: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "1 Year": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "2 Years": "bg-blue-50 text-blue-700 border-blue-100",
  "3 Years": "bg-amber-50 text-amber-700 border-amber-100",
  "5+ Years": "bg-rose-50 text-rose-600 border-rose-100",
};

const bucketPanels = [
  { bucket: "Current", total: "128", balance: "PHP 2.1M", accent: "border-emerald-200 bg-emerald-50/40" },
  { bucket: "1 Year", total: "388", balance: "PHP 6.1M", accent: "border-emerald-200 bg-emerald-50/40" },
  { bucket: "2 Years", total: "274", balance: "PHP 8.8M", accent: "border-blue-200 bg-blue-50/40" },
  { bucket: "3 Years", total: "238", balance: "PHP 10.2M", accent: "border-amber-200 bg-amber-50/40" },
  { bucket: "5+ Years", total: "348", balance: "PHP 13.5M", accent: "border-rose-200 bg-rose-50/40" },
];

function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-lg bg-gray-50" />
    </div>
  );
}

export default function ViewDelinquenciesPage() {
  const router = useRouter();
  const [delinquents, setDelinquents] = useState<DelinquentTaxpayer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Added missing constant

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: search,
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        const response = await fetch(`/api/taxpayers/delinquents?${params}`);
        const result = await response.json();

        setDelinquents(result.data);
        setTotalPages(result.meta.totalPages);
        setTotalCount(result.meta.totalItems);
      } catch (error) {
        console.error("Error fetching delinquents:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, currentPage]);

  if (loading) return <TableSkeleton />;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => router.push("/taxpayers")}
        className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Taxpayer Records
      </button>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">Delinquent Accounts</h1>
          <p className="font-inter mt-1 text-xs text-slate-400">Monitor overdue Real Property Tax obligations</p>
        </div>
        <button className="font-inter inline-flex items-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer">
          <Download className="h-4 w-4" />
          Export Delinquency List
        </button>
      </header>

      {/* Aging Buckets */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {bucketPanels.map((panel) => (
          <div key={panel.bucket} className={`rounded-xl border p-5 shadow-sm transition-transform hover:scale-[1.02] ${panel.accent}`}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${bucketColors[panel.bucket as DelinquentTaxpayer["bucket"]]}`}>
                {panel.bucket}
              </span>
              <div className="font-lexend text-xl font-bold text-slate-700">{panel.total}</div>
            </div>
            <p className="mt-4 font-inter text-lg font-bold text-slate-800">{panel.balance}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Outstanding Balance</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, TIN, or barangay..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to page 1 on new search
              }}
              className="w-full rounded-lg border border-gray-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-gray-100">
            <Clock className="h-4 w-4 text-slate-400" />
            {totalCount} Delinquent Accounts Found
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Taxpayer Name</TableHead>
                <TableHead>TIN</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead align="center">Prop.</TableHead>
                <TableHead>Aging Bucket</TableHead>
                <TableHead align="right">Total Due</TableHead>
                <TableHead align="center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delinquents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-inter">No matching records found.</TableCell>
                </TableRow>
              ) : (
                delinquents.map((taxpayer) => (
                  <TableRow key={taxpayer.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-700">{taxpayer.full_name}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">{taxpayer.tin}</TableCell>
                    <TableCell className="text-slate-600">{taxpayer.barangay_name}</TableCell>
                    <TableCell align="center" className="font-medium">{taxpayer.property_count}</TableCell>
                    <TableCell>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${bucketColors[taxpayer.bucket]}`}>
                        {taxpayer.bucket}
                      </span>
                    </TableCell>
                    <TableCell align="right" className="font-bold text-slate-900">{taxpayer.total_due}</TableCell>
                    <TableCell align="center">
                      <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer">View Details</button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-white font-inter">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of {totalCount}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}