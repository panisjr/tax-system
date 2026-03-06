/**
 * masks.ts — Input formatting/masking functions
 *
 * Each function accepts a raw (possibly partially formatted) string
 * and returns the correctly formatted string.
 *
 * To add a new field type:
 *   1. Add the key to MaskKey
 *   2. Implement a maskXxx function with the same signature
 *   3. Register it in MASKS
 *   4. Add a matching validator in validators.ts
 */

export type MaskKey =
  | 'tin'
  | 'td-number'
  | 'phone'
  | 'rpt-id'
  | 'barangay-code'
  | 'text';

export type MaskFn = (raw: string) => string;


// ── TIN ───────────────────────────────────────────────────────────────────────
// Format: ###-###-###  or  ###-###-###-###  (9 or 12 digits, dash-separated)

export function maskTin(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 12);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 9)}-${d.slice(9)}`;
}

// ── TD Number ─────────────────────────────────────────────────────────────────
// Prefix: "TD-"  |  Format: TD-####-####(-####-####-####)  |  Up to 20 digits
// The prefix is always preserved; only the digit portion is masked.

export function maskTdNumber(raw: string): string {
  // Strip any existing "TD-" / "TD" prefix (case-insensitive) before extracting digits.
  // This gracefully handles paste operations that include the prefix.
  const withoutPrefix = raw.replace(/^[Tt][Dd]-?/, '');
  const d = withoutPrefix.replace(/\D/g, '').slice(0, 20);

  if (!d) return 'TD-';

  // Group digits into chunks of 4
  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 4) {
    parts.push(d.slice(i, i + 4));
  }
  return 'TD-' + parts.join('-');
}

// ── Phone (Philippine mobile) ─────────────────────────────────────────────────
// Format: 09##-###-#### (11 digits, must start with 09)

export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);

  // Format as ### ### ####
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function maskText(raw: string): string {
  return raw; // No masking for plain text
}

// ── RPT ID ────────────────────────────────────────────────────────────────────
// Format: ##-###-#### (9 digits) — adjust grouping to match your spec

export function maskRptId(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
}

// ── Barangay Code ─────────────────────────────────────────────────────────────
// Format: ###-## (5 digits) — adjust grouping to match your spec

export function maskBarangayCode(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 5);
  if (d.length <= 3) return d;
  return `${d.slice(0, 3)}-${d.slice(3)}`;
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const MASKS: Record<MaskKey, MaskFn> = {
  'tin': maskTin,
  'td-number': maskTdNumber,
  'phone': maskPhone,
  'rpt-id': maskRptId,
  'barangay-code': maskBarangayCode,
  'text': maskText
};
