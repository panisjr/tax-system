/**
 * validators.ts — Validation rules for ValidatedInput
 *
 * Each validator declares:
 *   validate()     — returns true for a complete, correctly formatted value
 *   errorMessage   — shown to the user when validation fails
 *
 * To add a new validator:
 *   1. Add the key to ValidatorKey
 *   2. Add the rule object to VALIDATORS
 *   3. Add a matching mask in masks.ts
 */

export type ValidatorKey =
  | 'tin'
  | 'td-number'
  | 'phone'
  | 'rpt-id'
  | 'barangay-code'
  | 'text';

export interface Validator {
  /** Returns true when the fully-formatted value is complete and valid. */
  validate: (value: string) => boolean;
  /** User-facing message rendered below the field on validation failure. */
  errorMessage: string;
}

export const VALIDATORS: Record<ValidatorKey, Validator> = {
  // ── TIN: ###-###-###  or  ###-###-###-###
  'tin': {
    validate: (v) => /^\d{3}-\d{3}-\d{3}(-\d{3})?$/.test(v),
    errorMessage: 'TIN must be 123-456-789 or 123-456-789-000',
  },

  // ── TD Number: TD-####-#### up to TD-####-####-####-####-####
  'td-number': {
    validate: (v) => /^TD-\d{4}-\d{4}(-\d{4}){0,3}$/.test(v),
    errorMessage: 'TD Number must be at least TD-####-#### (e.g. TD-2024-0001)',
  },

'phone': {
  // Strict format check: 3 digits, space, 3 digits, space, 4 digits
  validate: (v) => /^\d{3} \d{3} \d{4}$/.test(v),
  errorMessage: 'Phone must be in ### ### #### format',
},
  // ── RPT ID: ##-###-#### (adjust regex to match actual spec)
  'rpt-id': {
    validate: (v) => /^\d{2}-\d{3}-\d{4}$/.test(v),
    errorMessage: 'RPT ID must be ##-###-####',
  },

  // ── Barangay Code: ###-## (adjust regex to match actual spec)
  'barangay-code': {
    validate: (v) => /^\d{3}-\d{2}$/.test(v),
    errorMessage: 'Barangay code must be ###-##',
    
  },

  'text': {
    validate: () => true, // Everything is valid for simple text
    errorMessage: '',
  },

};
