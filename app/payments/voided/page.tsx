"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  parse,
} from "date-fns";
import {
  ArrowLeft,
  Search,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

type VoidedEntry = {
  orNumber: string;
  payer: string;
  reason: string;
  amount: string;
  cashier: string;
  date: string;
  reference: string;
};

const voidedOrs: VoidedEntry[] = [
  {
    orNumber: "OR-2026-000121",
    payer: "Maria Santos",
    reason: "Encoding error – wrong taxpayer",
    amount: "₱ 2,150.00",
    cashier: "Cashier 02",
    date: "Feb 28, 2026 - 04:55 PM",
    reference: "Reissued as OR-2026-000125",
  },
  {
    orNumber: "OR-2026-000118",
    payer: "ABC Trading",
    reason: "Duplicate payment",
    amount: "₱ 8,750.00",
    cashier: "Cashier 01",
    date: "Feb 28, 2026 - 03:20 PM",
    reference: "Refund processed",
  },
];

export default function VoidedOrPage() {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredData = useMemo(() => {
    return voidedOrs.filter((item) => {
      let matchesDate = true;
      if (dateRange?.from) {
        const logDate = parse(
          item.date.split(" - ")[0],
          "MMM dd, yyyy",
          new Date(),
        );
        const start = startOfDay(dateRange.from);
        const end = dateRange.to
          ? endOfDay(dateRange.to)
          : endOfDay(dateRange.from);
        matchesDate = isWithinInterval(logDate, { start, end });
      }
      return matchesDate;
    });
  }, [dateRange]);

  const columns = useMemo<ColumnDef<VoidedEntry>[]>(
    () => [
      {
        accessorKey: "payer",
        header: "PAYER / ACCOUNT",
        cell: ({ getValue }) => (
          <span className="font-bold text-[#595a5d]">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "orNumber",
        header: "OR NO.",
        cell: ({ getValue }) => (
          <div className="inline-flex items-center gap-1.5 font-bold text-red-600 whitespace-nowrap min-w-max">
            <XCircle className="h-4 w-4 shrink-0" />
            {getValue() as string}
          </div>
        ),
      },
      { accessorKey: "reason", header: "REASON" },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ getValue }) => (
          <span className="font-bold text-slate-900 whitespace-nowrap">
            {getValue() as string}
          </span>
        ),
      },
      { accessorKey: "cashier", header: "CASHIER" },
      {
        accessorKey: "date",
        header: "DATE / TIME",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <Clock className="h-3.5 w-3.5" />
            {getValue() as string}
          </div>
        ),
      },
      { accessorKey: "reference", header: "REFERENCE / NOTES" },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: { globalFilter, pagination: { pageIndex, pageSize } },
  });

  return (
    <div className="w-full">
      <button
        onClick={() => router.push("/payments")}
        className="mb-5 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payments Monitoring
      </button>
      <header className="mb-6">
        <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
          Voided & Unapplied OR
        </h1>
        <p className="text-xs text-slate-400">
          Track invalid, cancelled, or unapplied official receipts.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search OR, payer..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-240px justify-start text-xs border-gray-200 text-slate-400 cursor-pointer">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "PP")} - ${format(dateRange.to, "PP")}` : format(dateRange.from, "PP")) : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>

          {(dateRange || globalFilter) && (
            <button
              onClick={() => {
                setDateRange(undefined);
                setGlobalFilter("");
              }}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium ml-2 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          )}
        </div>
      </div>
      {/* Table Section */}
      <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="bg-white border-b border-gray-100"
                >
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="px-4 py-4 text-[12px] font-bold uppercase text-slate-500 tracking-wider"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-5 text-sm text-slate-600"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-400"
                  >
                    No records found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white px-4 py-4 border-t border-gray-100">
          <div className="text-sm text-slate-400 font-medium font-inter">
            Showing{" "}
            {table.getFilteredRowModel().rows.length === 0
              ? 0
              : pageIndex * pageSize + 1}{" "}
            to{" "}
            {Math.min(
              (pageIndex + 1) * pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            of {table.getFilteredRowModel().rows.length}
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="disabled:opacity-20 cursor-pointer text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-slate-600 font-bold font-inter tracking-tight">
              Page {pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="disabled:opacity-20 cursor-pointer text-slate-400 hover:text-slate-800 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
