"use client";

import React, {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MASKS, MaskKey } from "./masks";
import { VALIDATORS, ValidatorKey } from "./validators";

export interface ValidatedInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> {
  validator?: ValidatorKey;
  type?: ValidatorKey;
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label?: string;
  validateOnBlur?: boolean;
  className?: string;
  inputClassName?: string;
  showValidationIcon?: boolean;

  leftIcon?: React.ReactNode;
}
function digitsBeforeCursor(str: string, cursorPos: number): number {
  return str.slice(0, cursorPos).replace(/\D/g, "").length;
}
function cursorAfterNthDigit(masked: string, n: number): number {
  if (n === 0) {
    return masked.startsWith("TD-") ? 3 : 0;
  }
  let count = 0;
  for (let i = 0; i < masked.length; i++) {
    if (/\d/.test(masked[i]) && ++count === n) return i + 1;
  }
  return masked.length;
}

export function ValidatedInput({
  validator,
  type,
  value,
  onChange,
  label,
  validateOnBlur = false,
  className,
  inputClassName,
  leftIcon,
  showValidationIcon = true,
  required,
  disabled,
  placeholder,
  id: externalId,
  ...rest
}: ValidatedInputProps) {
  const autoId = useId();
  const id = externalId ?? autoId;

  const resolvedValidator = (validator ?? type) as ValidatorKey;
  if (!resolvedValidator) {
    throw new Error("<ValidatedInput> requires a `validator` or `type` prop.");
  }

  const maskFn = MASKS[resolvedValidator as MaskKey];
  const validatorRule = VALIDATORS[resolvedValidator];
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isValid = validatorRule.validate(value);
  const valueIsEmpty =
    !value || (resolvedValidator === "td-number" && value === "TD-");
  const shouldShowState = validateOnBlur ? touched && !isFocused : touched;

  const showError =
    shouldShowState && !isValid && !valueIsEmpty && value.length > 0;
  const showSuccess = shouldShowState && isValid;
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingCursor.current !== null && inputRef.current) {
      const pos = pendingCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  });
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { selectionStart: ss, selectionEnd: se } = e.currentTarget;

      if (
        resolvedValidator === "td-number" ||
        resolvedValidator === "ORnumber"
      ) {
        const PREFIX_LEN = 3; // Both "TD-" and "OR-"
        if (e.key === "Backspace") {
          const caretAtPrefix =
            ss !== null && se !== null && ss === se && ss <= PREFIX_LEN;
          const selectionInPrefix = ss !== null && ss < PREFIX_LEN;
          if (caretAtPrefix || selectionInPrefix) {
            e.preventDefault();
            return;
          }
        }
        if (e.key === "Delete" && ss !== null && ss < PREFIX_LEN) {
          e.preventDefault();
          return;
        };
      }

      // Allow all keys for 'name', 'email', and 'password' validators (no digit restriction)
      if (["name", "email", "password"].includes(resolvedValidator)) return;

      const PASSTHROUGH = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (PASSTHROUGH.includes(e.key)) return;
      if (e.ctrlKey || e.metaKey) return;
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    },
    [resolvedValidator],
  );
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // For email fields, don't apply cursor manipulation
      if (resolvedValidator === "email") {
        if (!validateOnBlur) setTouched(true);
        onChange(raw, validatorRule.validate(raw));
        return;
      }

      // For 'name', 'email', and 'password' validators, just validate without cursor/mask manipulation
      if (["name", "email", "password"].includes(resolvedValidator)) {
        const processed = maskFn ? maskFn(raw) : raw;
        if (!validateOnBlur) setTouched(true);
        onChange(processed, validatorRule.validate(processed));
        return;
      }

      const cursorPos = e.target.selectionStart ?? raw.length;
      const nDigitsBefore = digitsBeforeCursor(raw, cursorPos);
      const masked = maskFn(raw);
      pendingCursor.current = cursorAfterNthDigit(masked, nDigitsBefore);

      if (!validateOnBlur) setTouched(true);
      onChange(masked, validatorRule.validate(masked));
    },
    [maskFn, validatorRule, validateOnBlur, onChange, resolvedValidator],
  );

  const handleFocus = useCallback(
    (_e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);

      if (
        resolvedValidator === "td-number" ||
        resolvedValidator === "ORnumber"
      ) {
        const prefix = resolvedValidator === "td-number" ? "TD-" : "OR-";

        if (!value) {
          onChange(prefix, false);
        }

        requestAnimationFrame(() => {
          if (!inputRef.current) return;
          // Both "TD-" and "OR-" are 3 characters long
          const pos = Math.max(3, inputRef.current.selectionStart ?? 3);
          inputRef.current.setSelectionRange(pos, pos);
        });
      }
    },
    [resolvedValidator, value, onChange],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      if (resolvedValidator === "td-number") {
        const target = e.currentTarget;
        requestAnimationFrame(() => {
          if (target.selectionStart !== null && target.selectionStart < 3) {
            target.setSelectionRange(3, 3);
          }
        });
      }
    },
    [resolvedValidator],
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTouched(true);
  }, []);

  const displayValue = value;
  resolvedValidator === "td-number" && !value ? "TD-" : value;

  return (
    <div className={cn(className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-inter text-xs font-medium text-slate-600"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <div className={cn("relative flex items-center", label && "mt-1")}>
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={["email", "password"].includes(resolvedValidator!) ? undefined : handleKeyDown}
          onFocus={handleFocus}
          onClick={handleClick}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          inputMode={resolvedValidator === "email" ? "email" : "numeric"}
          autoComplete="off"
          className={cn(
            "flex h-9 w-full rounded-md border bg-white px-3 py-1 font-inter text-sm text-slate-900",
            "placeholder:text-slate-400",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2",
            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
            leftIcon && "pl-9",
            showValidationIcon && touched && "pr-8",
            showError
              ? "border-rose-400 focus:ring-rose-200"
              : showSuccess
                ? "border-emerald-400 focus:ring-emerald-200"
                : "border-gray-200 focus:ring-slate-200",
            inputClassName,
          )}
          {...rest}
        />

        {showValidationIcon && touched && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" aria-hidden />
            )}
          </span>
        )}
      </div>

      {showError && (
        <p className="mt-1 font-inter text-xs text-rose-500" role="alert">
          {validatorRule.errorMessage}
        </p>
      )}
    </div>
  );
}
