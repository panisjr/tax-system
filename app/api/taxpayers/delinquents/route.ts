import { NextResponse } from "next/server";

// In a real app, you would import your DB client here (e.g., Prisma or Drizzle)
// import { db } from "@/lib/db";

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

const mockDelinquents: DelinquentTaxpayer[] = [
  {
    id: 1,
    full_name: "Ramon C. Dela Cruz",
    tin: "123-456-789-000",
    barangay_name: "San Isidro",
    property_count: 2,
    bucket: "1 Year",
    total_due: "PHP 184,320",
    years_due: "2025",
  },
  {
    id: 2,
    full_name: "Lourdes M. Angeles",
    tin: "234-567-890-000",
    barangay_name: "Mabini",
    property_count: 1,
    bucket: "2 Years",
    total_due: "PHP 312,880",
    years_due: "2024-2025",
  },
  {

    id: 3,
    full_name: "Golden Fields Realty Corp",
    tin: "345-678-901-000",
    barangay_name: "Poblacion East",
    property_count: 5,
    bucket: "3 Years",
    total_due: "PHP 1,240,000",
    years_due: "2023-2025",
  },
  {
    id: 4,
    full_name: "Teresita P. Navarro",
    tin: "456-789-012-000",
    barangay_name: "Sta. Elena",
    bucket: "5+ Years",
    property_count: 1,
    total_due: "PHP 402,150",
    years_due: "2020-2025",
  },
  {
    id: 5,
    full_name: "Northpoint Agri Ventures",
    tin: "567-890-123-000",
    barangay_name: "Bagong Silang",
    property_count: 3,
    bucket: "5+ Years",
    total_due: "PHP 918,540",
    years_due: "2019-2025",
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 6 + i,
    full_name: `Taxpayer ${6 + i}`,
    tin: `789-${i}12-${345 + i}00`,
    barangay_name: "Demo Barangay",
    property_count: 1 + Math.floor(Math.random() * 4),
    bucket: ["Current", "1 Year", "2 Years", "3 Years", "5+ Years"][
      Math.floor(Math.random() * 5)
    ] as DelinquentTaxpayer["bucket"],
    total_due: `PHP ${Math.floor(Math.random() * 500000) + 50000}`,
    years_due: "2024-2025",
  })),
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get params from URL
  const search = searchParams.get("search")?.toLowerCase() || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // 1. Filter data
  const filteredData = mockDelinquents.filter((item) =>
    item.full_name.toLowerCase().includes(search) ||
    item.tin.toLowerCase().includes(search) ||
    item.barangay_name.toLowerCase().includes(search)
  );

  // 2. Paginate data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedData = filteredData.slice(offset, offset + limit);

  // 3. Return response
  return NextResponse.json({
    data: paginatedData,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  });
}