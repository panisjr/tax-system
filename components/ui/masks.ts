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
  | 'text'
  | 'email'
  | 'employee-Id'
  | 'name';

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
  const withoutPrefix = raw.replace(/^[Tt][Dd]-?/, '');
  const d = withoutPrefix.replace(/\D/g, '').slice(0, 20);

  if (!d) return 'TD-';

  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 4) {
    parts.push(d.slice(i, i + 4));
  }
  return 'TD-' + parts.join('-');
}

// ── Phone ─────────────────────────────────────────────────────────────────────
// Format: ### ### #### (10 digits, no leading zero)

export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);

  // Format as ### ### ####
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function maskText(raw: string): string {
  return raw;
}

// ── Email ───────────────────────────────────────────────────────────────────
// Email doesn't need masking, just return as-is

export function maskEmail(raw: string): string {
  return raw;
}

// ── RPT ID ────────────────────────────────────────────────────────────────────
// Format: ##-###-#### (9 digits)

export function maskRptId(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
}

// ── Barangay Code ─────────────────────────────────────────────────────────────
// Format: ###-## (5 digits)

export function maskBarangayCode(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 5);
  if (d.length <= 3) return d;
  return `${d.slice(0, 3)}-${d.slice(3)}`;
}

// ── Employee ID ─────────────────────────────────────────────────────────────
// Format: XXXX-XXXX (8 digits with hyphen in middle)

export function maskEmployeeId(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)}-${d.slice(4)}`;
}

// ── Name ─────────────────────────────────────────────────────────────────────
// Allows only letters, spaces, hyphens, periods, and apostrophes

export function maskName(raw: string): string {
  return raw.replace(/[^a-zA-Z\s\-\.\']/g, '');
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const MASKS: Record<MaskKey, MaskFn> = {
  'tin': maskTin,
  'td-number': maskTdNumber,
  'phone': maskPhone,
  'rpt-id': maskRptId,
  'barangay-code': maskBarangayCode,
  'text': maskText,
  'email': maskEmail,
  'employee-Id': maskEmployeeId,
  'name': maskName,
};
