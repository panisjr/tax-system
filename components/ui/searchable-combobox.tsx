'use client';

/**
 * SearchableCombobox — shadcn/ui-style searchable dropdown.
 *
 * Why a custom component instead of raw shadcn cmdk Combobox?
 *   • Works without installing @radix-ui/react-popover + cmdk.
 *   • Handles large datasets efficiently (client-side filter on typed value).
 *   • Follows the same visual language as the rest of the system.
 *   • Can be swapped 1-to-1 for a shadcn Combobox once cmdk is added.
 *
 * Usage:
 *   <SearchableCombobox
 *     label="Barangay"
 *     placeholder="Search barangay..."
 *     options={barangays.map(b => ({ value: b.id.toString(), label: b.name }))}
 *     value={barangayId}
 *     onChange={setBarangayId}
 *     required
 *   />
 */

import { useState, useRef, useEffect, useId } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ComboboxOption = {
  value: string;
  label: string;
  /** Optional sublabel displayed below label (e.g. TIN, PIN) */
  sublabel?: string;
};

type Props = {
  label: string;
  placeholder?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  /** Text shown in the trigger when nothing is selected */
  emptyLabel?: string;
  /** Max height of the dropdown list (Tailwind class) */
  maxHeight?: string;
};

export function SearchableCombobox({
  label,
  placeholder = 'Search...',
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  emptyLabel = 'Select...',
  maxHeight = 'max-h-60',
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived: label of the currently selected option
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  // Filter options by query (case-insensitive, matches label + sublabel)
  const filtered =
    query.trim() === ''
      ? options
      : options.filter((o) =>
          [o.label, o.sublabel ?? '']
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input whenever dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
    setQuery('');
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange('');
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        htmlFor={id}
        className="font-inter block text-xs font-medium text-slate-600"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {/* Trigger button */}
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          'mt-1 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2',
          'font-inter text-sm text-slate-900 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-slate-200',
          disabled && 'cursor-not-allowed bg-gray-50 opacity-60',
          !disabled && 'cursor-pointer hover:border-gray-300'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('truncate', !selectedLabel && 'text-slate-400')}>
          {selectedLabel || emptyLabel}
        </span>
        <span className="ml-2 flex items-center gap-1 text-slate-400">
          {value && !disabled && (
            <X
              className="h-3 w-3 hover:text-slate-600"
              onClick={handleClear}
              aria-label="Clear selection"
            />
          )}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg',
          )}
          role="listbox"
        >
          {/* Search input */}
          <div className="border-b border-gray-100 px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent font-inter text-sm text-slate-900 outline-none placeholder:text-slate-400"
              aria-label="Search"
            />
          </div>

          {/* Option list */}
          <ul className={cn('overflow-y-auto py-1', maxHeight)}>
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center font-inter text-xs text-slate-400">
                No results found.
              </li>
            ) : (
              filtered.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-2 px-3 py-2',
                      'font-inter text-sm transition-colors',
                      isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="leading-tight">{option.label}</span>
                      {option.sublabel && (
                        <span className="text-xs text-slate-400">{option.sublabel}</span>
                      )}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
