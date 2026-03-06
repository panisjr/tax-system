'use client';

export interface TDBuilding {
  id: number;
  td_id: number;
  kind_of_building: string | null;
  structural_type:
    | 'Type I Wood'
    | 'Type II Mixed'
    | 'Type III Masonry/Steel'
    | 'Type IV Steel/RC'
    | 'Type V RC'
    | null;
  floor_area: number | null;
  year_built: number | null;
  age_years: number | null;          // GENERATED ALWAYS AS column
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Dilapidated' | null;
  market_value: number | null;
  assessment_level: number | null;
  assessed_value: number | null;
  created_at: string;
}

export interface TaxDeclarationData {
  // ── tax_declarations ──────────────────────────────────────────────────────
  id: number;
  td_number: string;
  arp_number: string | null;
  declaration_type: 'New' | 'Revision' | 'Cancellation' | 'Transfer';
  tax_year: number;
  effectivity_year: number;
  effectivity_quarter: '1st' | '2nd' | '3rd' | '4th';
  previous_td_id: number | null;
  classification:
    | 'Residential' | 'Commercial' | 'Agricultural'
    | 'Industrial'  | 'Special'    | 'Timberland'   | 'Mineral';
  actual_use: string | null;
  land_area: number | null;
  land_unit_value: number | null;
  land_market_value: number | null;
  land_assessment_level: number | null;
  land_assessed_value: number | null;
  total_market_value: number | null;
  total_assessed_value: number | null;
  status: 'Active' | 'Cancelled' | 'Revised';
  created_at: string;
  updated_at: string;

  // ── taxpayers (joined) ────────────────────────────────────────────────────
  taxpayers: {
    id: number;
    owner_name: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    suffix: string | null;
    tin: string | null;
    address: string | null;
    owner_type: 'Individual' | 'Corporation' | 'Government';
    phone: string | null;
    email: string | null;
  };

  // ── properties (joined, includes barangays nested) ────────────────────────
  properties: {
    id: number;
    pin: string;
    municipality: string;
    province: string;
    street: string | null;
    lot_number: string | null;
    block_number: string | null;
    survey_number: string | null;
    barangays: {
      id: number;
      name: string;
      municipality: string;
      province: string;
    };
  };

  // ── buildings (joined array — one TD can have multiple buildings) ──────────
  buildings: TDBuilding[];
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = {
  peso: (v: number | null | undefined): string =>
    v == null
      ? '—'
      : v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),

  area: (v: number | null | undefined): string =>
    v == null
      ? '—'
      : v.toLocaleString('en-PH', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),

  pct: (v: number | null | undefined): string =>
    v == null ? '—' : `${Number(v).toFixed(2)}%`,

  date: () => new Date().toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
  }),
};

const PRINT_CSS = `
  @media print {
    @page { size: A4 portrait; margin: 8mm 10mm; }
    body { visibility: hidden !important; }
    #td-print-root,
    #td-print-root * { visibility: visible !important; }
    #td-print-root {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 210mm !important;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  data: TaxDeclarationData;
}

export function TaxDeclarationPrint({ data }: Props) {
  const td   = data;
  const tp   = data.taxpayers;
  const pr   = data.properties;
  const brgy = data.properties.barangays;
  const bldgs = data.buildings ?? [];

  // Compute building totals
  const bldgTotalMarket   = bldgs.reduce((s, b) => s + (b.market_value   ?? 0), 0);
  const bldgTotalAssessed = bldgs.reduce((s, b) => s + (b.assessed_value ?? 0), 0);

  return (
    <>
      {/*Inject print CSS once (React 19 deduplicates <style> tags)*/}
      <style>{PRINT_CSS}</style>

      {/*A4 print container*/}
      <div
        id="td-print-root"
        className="
          mx-auto box-border
          w-[210mm] min-h-[297mm]
          bg-white text-black font-serif text-[10pt] leading-snug
          border border-black
          p-[12mm]
          print:border-none print:p-0
        "
      >

        {/*HEADER*/}
        <div className="text-center border-b-2 border-black pb-2 mb-3">
          <p className="text-[8pt] tracking-[0.25em] uppercase font-bold">
            Republic of the Philippines
          </p>
          <p className="text-[8.5pt]">Province of Samar — Municipality of Sta. Rita</p>
          <p className="text-[9pt] font-bold uppercase tracking-widest mt-0.5">
            Office of the Municipal Assessor
          </p>
          <h1 className="text-[18pt] font-black uppercase tracking-[0.15em] mt-1 mb-0">
            Tax Declaration
          </h1>
          <p className="text-[7.5pt] italic text-gray-600">
            Real Property Tax Administration · Local Government Unit
          </p>
        </div>

        {/*SECTION A — DECLARATION IDENTIFIERS*/}
        <Row3
          a={<Cell label="TD NUMBER"            value={td.td_number} />}
          b={<Cell label="ARP NUMBER"           value={td.arp_number ?? '—'} />}
          c={<Cell label="PROPERTY INDEX NO. (PIN)" value={pr.pin} />}
        />
        <Row3
          className="-mt-px"
          a={<Cell label="DECLARATION TYPE"  value={td.declaration_type} />}
          b={<Cell label="TAX YEAR"          value={String(td.tax_year)} />}
          c={<Cell label="STATUS"            value={td.status} />}
        />

        {/* Previous TD — show only for Revision / Cancellation / Transfer */}
        {td.previous_td_id && (
          <div className="border border-black -mt-px">
            <Cell label="PREVIOUS TD REFERENCE (AMENDED FROM)" value={String(td.previous_td_id)} />
          </div>
        )}

        {/*SECTION I — OWNER INFORMATION*/}
        <SectionHeader label="I. OWNER INFORMATION" />
        <div className="border border-black">
          <div className="flex border-b border-black">
            <div className="flex-1 border-r border-black">
              <Cell label="OWNER / TAXPAYER NAME" value={tp.owner_name} />
            </div>
            <div className="flex-1">
              <Cell label="TAX IDENTIFICATION NUMBER (TIN)" value={tp.tin ?? '—'} />
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 border-r border-black">
              <Cell label="COMPLETE ADDRESS" value={tp.address ?? '—'} />
            </div>
            <div className="w-40">
              <Cell label="OWNER TYPE" value={tp.owner_type} />
            </div>
          </div>
        </div>

        {/*SECTION II — PROPERTY LOCATION*/}
        <SectionHeader label="II. PROPERTY LOCATION" />
        <div className="border border-black">
          <div className="flex border-b border-black">
            <div className="flex-1 border-r border-black">
              <Cell label="PROVINCE"     value={pr.province} />
            </div>
            <div className="flex-1 border-r border-black">
              <Cell label="MUNICIPALITY" value={pr.municipality} />
            </div>
            <div className="flex-1">
              <Cell label="BARANGAY"     value={brgy.name} />
            </div>
          </div>
          <div className="flex border-b border-black">
            <div className="flex-1 border-r border-black">
              <Cell label="STREET / ROAD"  value={pr.street ?? '—'} />
            </div>
            <div className="flex-1 border-r border-black">
              <Cell label="LOT NUMBER"     value={pr.lot_number ?? '—'} />
            </div>
            <div className="flex-1">
              <Cell label="BLOCK NUMBER"   value={pr.block_number ?? '—'} />
            </div>
          </div>
          <Cell label="SURVEY / CADASTRAL NUMBER" value={pr.survey_number ?? '—'} />
        </div>

        {/*SECTION III — LAND VALUATION*/}
        <SectionHeader label="III. LAND VALUATION" />
        <table className="w-full border-collapse border border-black text-[8.5pt] -mb-px">
          <thead>
            <tr>
              {[
                'Classification',
                'Actual Use',
                'Area (sqm)',
                'Unit Value (₱/sqm)',
                'Market Value (₱)',
                'Assmnt. Level',
                'Assessed Value (₱)',
              ].map((h) => (
                <th
                  key={h}
                  className="border border-black px-1.5 py-1 text-center text-[7.5pt] font-bold uppercase bg-gray-100 leading-tight"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/*Filled data row*/}
            <tr>
              <Td center>{td.classification}</Td>
              <Td center>{td.actual_use ?? '—'}</Td>
              <Td right>{fmt.area(td.land_area)}</Td>
              <Td right>{fmt.peso(td.land_unit_value)}</Td>
              <Td right>{fmt.peso(td.land_market_value)}</Td>
              <Td center>{fmt.pct(td.land_assessment_level)}</Td>
              <Td right bold>{fmt.peso(td.land_assessed_value)}</Td>
            </tr>
            {/*Blank annotation row*/}
            <BlankRow cols={7} />
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="border border-black px-1.5 py-1 text-right text-[8pt] font-bold uppercase">
                Land Sub-Total
              </td>
              <td className="border border-black px-1.5 py-1 text-right text-[8.5pt] font-bold">
                {fmt.peso(td.land_market_value)}
              </td>
              <td className="border border-black" />
              <td className="border border-black px-1.5 py-1 text-right text-[8.5pt] font-bold">
                {fmt.peso(td.land_assessed_value)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/*SECTION IV — BUILDING / IMPROVEMENT VALUATION*/}
        <SectionHeader label="IV. BUILDING / IMPROVEMENT VALUATION" />
        <table className="w-full border-collapse border border-black text-[8.5pt] -mb-px">
          <thead>
            <tr>
              {[
                'Kind of Building',
                'Structural Type',
                'Floor Area (sqm)',
                'Year Built',
                'Age',
                'Market Value (₱)',
                'Assmnt. Level',
                'Assessed Value (₱)',
              ].map((h) => (
                <th
                  key={h}
                  className="border border-black px-1.5 py-1 text-center text-[7.5pt] font-bold uppercase bg-gray-100 leading-tight"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bldgs.length > 0 ? (
              bldgs.map((b, i) => (
                <tr key={b.id ?? i}>
                  <Td center>{b.kind_of_building ?? '—'}</Td>
                  <Td center>{b.structural_type ?? '—'}</Td>
                  <Td right>{fmt.area(b.floor_area)}</Td>
                  <Td center>{b.year_built ?? '—'}</Td>
                  <Td center>{b.age_years != null ? `${b.age_years} yrs` : '—'}</Td>
                  <Td right>{fmt.peso(b.market_value)}</Td>
                  <Td center>{fmt.pct(b.assessment_level)}</Td>
                  <Td right bold>{fmt.peso(b.assessed_value)}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="border border-black px-2 py-2 text-center italic text-[8pt] text-gray-500"
                >
                  No building or improvement declared for this property.
                </td>
              </tr>
            )}
            <BlankRow cols={8} />
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="border border-black px-1.5 py-1 text-right text-[8pt] font-bold uppercase">
                Building Sub-Total
              </td>
              <td className="border border-black px-1.5 py-1 text-right text-[8.5pt] font-bold">
                {bldgs.length > 0 ? fmt.peso(bldgTotalMarket) : '—'}
              </td>
              <td className="border border-black" />
              <td className="border border-black px-1.5 py-1 text-right text-[8.5pt] font-bold">
                {bldgs.length > 0 ? fmt.peso(bldgTotalAssessed) : '—'}
              </td>
            </tr>
          </tfoot>
        </table>

        {/*SECTION V — TOTAL VALUATION SUMMARY*/}
        <SectionHeader label="V. TOTAL VALUATION SUMMARY" />
        <table className="w-full border-collapse border border-black text-[9pt] mb-3">
          <tbody>
            <tr>
              <td className="border border-black px-3 py-1.5 font-bold uppercase text-[8.5pt] w-2/3">
                Total Market Value (Land + Building)
              </td>
              <td className="border border-black px-3 py-1.5 text-right font-bold text-[10pt]">
                ₱ {fmt.peso(td.total_market_value)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-bold uppercase text-[8.5pt]">
                Total Assessed Value (Land + Building)
              </td>
              <td className="border border-black px-3 py-1.5 text-right font-bold text-[10pt]">
                ₱ {fmt.peso(td.total_assessed_value)}
              </td>
            </tr>
          </tbody>
        </table>

        {/*SECTION VI — EFFECTIVITY*/}
        <SectionHeader label="VI. EFFECTIVITY" />
        <Row3
          a={<Cell label="YEAR OF EFFECTIVITY" value={String(td.effectivity_year)} />}
          b={<Cell label="QUARTER"             value={`${td.effectivity_quarter} Quarter`} />}
          c={<Cell label="DATE ISSUED"         value={fmt.date()} />}
        />

        {/*SECTION VII — MEMORANDA / REMARKS*/}
        <SectionHeader label="VII. MEMORANDA / REMARKS" />
        <div className="border border-black px-2 py-1.5 mb-3 h-14">
          {/* intentionally blank — space for manual annotation on physical form */}
        </div>

        {/*CERTIFICATION BLOCK*/}
        <div className="border border-black px-3 py-2 mb-4 text-[7.5pt] italic leading-relaxed">
          I hereby certify that the property described herein has been duly assessed and appraised
          in accordance with the provisions of Republic Act No. 7160 (Local Government Code of 1991),
          its implementing rules and regulations, and the applicable Schedule of Market Values (SMV)
          approved for the Municipality of Sta. Rita, Samar. The foregoing data are true and correct
          to the best of my knowledge and belief.
        </div>

        {/*SIGNATORIES — 3-column footer*/}
        <div className="grid grid-cols-3 gap-3 text-[8.5pt] mt-1">
          {/*Prepared By*/}
          <SignatoryBox
            title="Prepared By"
            nameLine="________________________"
            subLine="Signature over Printed Name"
            roleLabel="Appraiser / Assessor's Staff"
          />
          {/*Approved By*/}
          <SignatoryBox
            title="Approved By"
            nameLine="________________________"
            subLine="Signature over Printed Name"
            roleLabel="Municipal Assessor"
            boldRole
          />
          {/*Owner / Authorized Representative*/}
          <SignatoryBox
            title="Received By (Owner)"
            nameLine={tp.owner_name}
            subLine="Signature over Printed Name"
            roleLabel={tp.owner_type}
          />
        </div>

        {/*DOCUMENT FOOTER*/}
        <div className="mt-4 border-t border-black pt-1 text-center text-[7pt] text-gray-500">
          Office of the Municipal Assessor · Sta. Rita, Samar ·&nbsp;
          <strong>{td.td_number}</strong> ·&nbsp;
          Printed: {fmt.date()}
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="bg-black text-white text-[7.5pt] font-bold uppercase tracking-widest px-2 py-0.5 mt-2">
      {label}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1">
      <p className="text-[6.5pt] font-bold text-gray-500 uppercase tracking-wider leading-none mb-0.5">
        {label}
      </p>
      <p className="text-[9.5pt] font-semibold leading-snug">{value}</p>
    </div>
  );
}

function Row3({
  a, b, c, className = '',
}: {
  a: React.ReactNode;
  b: React.ReactNode;
  c: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex border border-black ${className}`}>
      <div className="flex-1 border-r border-black">{a}</div>
      <div className="flex-1 border-r border-black">{b}</div>
      <div className="flex-1">{c}</div>
    </div>
  );
}

function Td({
  children,
  right,
  center,
  bold,
}: {
  children: React.ReactNode;
  right?: boolean;
  center?: boolean;
  bold?: boolean;
}) {
  return (
    <td
      className={[
        'border border-black px-1.5 py-1',
        right ? 'text-right' : center ? 'text-center' : 'text-left',
        bold ? 'font-bold' : '',
      ].join(' ')}
    >
      {children}
    </td>
  );
}

function BlankRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="border border-black px-1.5 py-3" />
      ))}
    </tr>
  );
}
 
function SignatoryBox({
  title,
  nameLine,
  subLine,
  roleLabel,
  boldRole = false,
}: {
  title: string;
  nameLine: string;
  subLine: string;
  roleLabel: string;
  boldRole?: boolean;
}) {
  return (
    <div className="border border-black p-2 text-center">
      <p className="text-[7.5pt] font-bold uppercase tracking-wide mb-5">{title}</p>
      <div className="border-t border-black pt-1 mt-2">
        <p className="text-[8.5pt] font-semibold truncate">{nameLine}</p>
        <p className="text-[7pt] text-gray-600 mt-0.5">{subLine}</p>
        <p className={`text-[7.5pt] mt-0.5 ${boldRole ? 'font-bold' : 'italic'}`}>{roleLabel}</p>
        <p className="text-[7.5pt] mt-2">Date: ____________________</p>
      </div>
    </div>
  );
}
