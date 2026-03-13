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
  | 'email'
  | 'employee-Id'
  | 'name'
  | 'account-number'
  | 'ORnumber'
  | 'password';

export interface PasswordPolicy {
  minLength: number;
  requireUpperLower: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
}

import { useSecurity } from '@/contexts/SecurityContext';

export function usePasswordValidator() {
  const { policy } = useSecurity();

  // We return a function that returns the result directly
  // This avoids stale state issues
  const validate = (value: string) => {
    const errorList: string[] = [];

    if (value.length < policy.minLength) {
      errorList.push(`${policy.minLength} characters`);
    }
    
    if (policy.requireUpperLower) {
      if (!/[a-z]/.test(value)) errorList.push('lowercase letter');
      if (!/[A-Z]/.test(value)) errorList.push('uppercase letter');
    }
    
    if (policy.requireNumbers && !/[0-9]/.test(value)) {
      errorList.push('number');
    }
    
    if (policy.requireSpecial && !/[^a-zA-Z0-9]/.test(value)) {
      errorList.push('special character');
    }

    return {
      isValid: errorList.length === 0,
      errors: errorList,
      message: errorList.length === 0 
        ? 'Password is valid' 
        : `Password must include: ${errorList.join(', ')}`
    };
  };

  return { validate };
}

export function createPasswordValidator(policy: PasswordPolicy): Validator {
  const errors: string[] = [];
  
  return {
    validate: (value: string) => {
      if (value.length < policy.minLength) {
        errors.push(`at least ${policy.minLength} characters`);
        return false;
      }
      
      if (policy.requireUpperLower) {
        if (!/[a-z]/.test(value)) errors.push('lowercase letter');
        if (!/[A-Z]/.test(value)) errors.push('uppercase letter');
      }
      
      if (policy.requireNumbers && !/[0-9]/.test(value)) {
        errors.push('number');
      }
      
      if (policy.requireSpecial && !/[^a-zA-Z0-9]/.test(value)) {
        errors.push('special character (e.g. !@#$%^&*)');
      }
      
      errors.length = 0; // Reset for next call
      return errors.length === 0;
    },
    errorMessage: 'Password must meet policy requirements',
  };
}

export interface Validator {
  /** Returns true when the fully-formatted value is complete and valid. */
  validate: (value: string) => boolean;
  /** User-facing message rendered below the field on validation failure. */
  errorMessage: string;
}

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUpperLower: true,
  requireNumbers: true,
  requireSpecial: true,
};

export const VALIDATORS: Record<ValidatorKey, Validator> = {
  'password': createPasswordValidator(DEFAULT_PASSWORD_POLICY),
  // ── TIN: ###-###-###  or  ###-###-###-###
  'tin': {
    validate: (v) => /^\d{3}-\d{3}-\d{3}(-\d{3})?$/.test(v),
    errorMessage: 'TIN must be 123-456-789 or 123-456-789-000',
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

  'email': {
    validate: (v) => /^.+@.+\..+$/.test(v),
    errorMessage: 'Email must follow the format: name@example.com',
  },

  'employee-Id': {
    validate: (v) => /^\d{4}-\d{4}$/.test(v),
    errorMessage: 'ID must be in XXXX-XXXX format (8 digits)',
  },

  'name': {
    validate: (v) => /^[a-zA-Z\s\-\.\']{3,50}$/.test(v),
    errorMessage: 'Name must be between 3 and 50 characters and contain only letters and basic punctuation',
  },

  'ORnumber': {
    validate: (v) => /^OR-\d{4}-\d{6}$/.test(v),
    errorMessage: 'OR Number must be OR-XXXX-XXXXXX format',
  },

   // ── TD Number: TD-####-#### up to TD-####-####-####-####-####
  'td-number': {
    validate: (v) => /^TD-\d{4}-\d{4}(-\d{4}){0,3}$/.test(v),
    errorMessage: 'TD Number must be at least TD-####-#### (e.g. TD-2024-0001)',
  },

  'account-number': {
    validate: (v) => /^\d{4}-\d{4}-\d{2}$/.test(v),
    errorMessage: 'Account number must be XXXX-XXXX-XX format (10 digits)',
  },

};
