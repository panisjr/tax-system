'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      richColors
      closeButton={false}
      swipeDirections={['right', 'left']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-slate-500',
          actionButton: 'group-[.toast]:bg-slate-900 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
