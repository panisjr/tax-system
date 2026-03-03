import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export function Field({
  label,
  inputType = "text",
  placeholder,
  leftIcon,
  value,
  onChange,
  required = false,
  readOnly = false,
}: {
  label: string;
  inputType?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  leftIcon?: React.ReactNode;
  value: any; // Accepts string for text, Date | undefined for calendar
  onChange: (value: any) => void;
  required?: boolean;
  readOnly?: boolean;
}) {
  
  // 1. If it's a date, render the shadcn Calendar inside a Popover
  if (inputType === "date") {
    return (
      <div className="flex flex-col">
        <label className="font-inter mb-1 text-xs font-medium text-slate-600">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={readOnly}
              className={`font-inter w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50 hover:text-slate-900 ${
                !value ? "text-slate-400" : "text-slate-900"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
              {value ? format(value as Date, "PPP") : <span>{placeholder || "Pick a date"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={value as Date}
              onSelect={onChange}
              disabled={(date) => date > new Date()} // Optional: prevents future dates
              initialFocus
              className="rounded-md border shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // 2. Otherwise, render the standard text input
  return (
    <div className="flex flex-col">
      <label className="font-inter mb-1 text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        {leftIcon}
        <input
          type={inputType}
          value={value as string}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          className="font-inter w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}