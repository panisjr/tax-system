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
  | 'text'
  | 'email';

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

  // ── Phone: ### ### #### (no leading zero)
  'phone': {
    validate: (v) => /^[1-9]\d{2} \d{3} \d{4}$/.test(v),
    errorMessage: 'Phone must be in ### ### #### format',
  },

  // ── RPT ID: ##-###-####
  'rpt-id': {
    validate: (v) => /^\d{2}-\d{3}-\d{4}$/.test(v),
    errorMessage: 'RPT ID must be ##-###-####',
  },

  // ── Barangay Code: ###-##
  'barangay-code': {
    validate: (v) => /^\d{3}-\d{2}$/.test(v),
    errorMessage: 'Barangay code must be ###-##',
  },

  'text': {
    validate: () => true,
    errorMessage: '',
  },

  // ── Email: name@example.com
  'email': {
    // Matches: [any characters] @ [any characters] . [any characters (2 or more)]
    validate: (v) => /^.+@.+\..+$/.test(v),
    errorMessage: 'Email must follow the format: name@example.com',
  },
};
