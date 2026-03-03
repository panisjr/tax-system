import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// simple wrapper to apply shadcn styles
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={
          "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 " +
          (className ?? '')
        }
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
