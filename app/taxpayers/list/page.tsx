"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  UsersRound,
} from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const OWNER_TYPE_OPTIONS: ComboboxOption[] = [
  { value: "Individual", label: "Individual" },
  { value: "Corporate", label: "Corporate" },
  { value: "Government", label: "Government" },
];

type Taxpayer = {
  id: number;
  owner_name: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  tin: string | null;
  address: string | null;
  owner_type: string | null;
  phone: string | null;
  email: string | null;
};

const PAGE_SIZE = 20;

export default function TaxpayerListPage() {
  const router = useRouter();

  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTaxpayers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/taxpayers/list", { cache: "no-store" });
        const data = (await res.json()) as { taxpayers?: Taxpayer[] };
        setTaxpayers(data.taxpayers ?? []);
      } catch {
        setTaxpayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxpayers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return taxpayers.filter((t) => {
      const matchSearch =
        !q ||
        t.owner_name.toLowerCase().includes(q) ||
        (t.tin ?? "").toLowerCase().includes(q) ||
        (t.address ?? "").toLowerCase().includes(q);
      const matchType = !typeFilter || t.owner_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [taxpayers, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const ownerTypeColor: Record<string, string> = {
    Individual: "bg-blue-50 text-blue-700",
    Corporate: "bg-amber-50 text-amber-700",
    Government: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => router.push("/taxpayers")}
        className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Taxpayer Records
      </button>

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-lexend text-2xl font-bold text-[#595a5d]">
            Taxpayer Master List
          </h1>
          <p className="font-inter mt-1 text-xs text-slate-400">
            All Registered Taxpayers – Municipality of Sta. Rita, Samar
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/taxpayers/register")}
          className="font-inter inline-flex cursor-pointer items-center gap-2 rounded bg-[#0f1729] px-4 py-2 text-xs font-medium text-[#8A9098] transition-colors hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Register Taxpayer
        </button>
      </header>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Taxpayers",
            value: isLoading ? "—" : taxpayers.length.toLocaleString(),
            color: "text-[#595a5d]",
          },
          {
            label: "Individual",
            value: isLoading
              ? "—"
              : taxpayers
                  .filter((t) => t.owner_type === "Individual")
                  .length.toLocaleString(),
            color: "text-blue-600",
          },
          {
            label: "Corporate",
            value: isLoading
              ? "—"
              : taxpayers
                  .filter((t) => t.owner_type === "Corporate")
                  .length.toLocaleString(),
            color: "text-amber-600",
          },
          {
            label: "Government",
            value: isLoading
              ? "—"
              : taxpayers
                  .filter((t) => t.owner_type === "Government")
                  .length.toLocaleString(),
            color: "text-emerald-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-inter text-xs text-slate-400">{s.label}</p>
            <p className={`font-lexend mt-1 text-xl font-bold ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-4 rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-45 max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={13}
            />
            <input
              type="text"
              placeholder="Search name, TIN, or address..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="font-inter w-full rounded-sm border border-gray-200 py-2 pl-8 pr-3 text-xs text-[#595a5d] focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="min-w-40">
            <Combobox
              placeholder="All Owner Types"
              searchPlaceholder="Search type..."
              options={OWNER_TYPE_OPTIONS}
              value={typeFilter}
              onChange={handleTypeFilter}
              triggerClassName="rounded-sm text-xs py-1.5 text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {[
                  "#",
                  "Full Name",
                  "TIN",
                  "Type",
                  "Address",
                  "Phone",
                  "Email",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap px-4 py-3 text-left text-[#595a5d] font-semibold uppercase tracking-wide  ${h.toLocaleLowerCase() === "#" ? "md:sticky md:left-0 bg-gray-50" : ""} ${h.toLocaleLowerCase() === "full name" ? "md:sticky md:left-[45.5px] bg-gray-50" : ""}  ${h.toLocaleLowerCase() === "actions" ? "md:sticky md:right-0 bg-gray-50" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Loading taxpayers...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    {search || typeFilter
                      ? "No taxpayers match your filters."
                      : "No taxpayers registered yet."}
                  </td>
                </tr>
              ) : (
                paginated.map((t, idx) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 md:sticky md:left-0 bg-white">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#595a5d] whitespace-nowrap md:sticky md:left-[45.5px] bg-white">
                      {t.owner_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {t.tin ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t.owner_type ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ownerTypeColor[t.owner_type] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {t.owner_type}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-48 truncate">
                      {t.address ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {t.phone ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {t.email ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 md:sticky right-0 bg-white">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View"
                          className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          title="Edit"
                          className="text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="font-inter text-xs text-slate-400">
            Showing {paginated.length} of {filtered.length} taxpayers
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-inter px-2 text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="cursor-pointer p-1 text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
