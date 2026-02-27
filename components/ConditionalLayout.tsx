'use client';

import { usePathname } from 'next/navigation';
import MainLayout from '@/components/MainLayout';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}