'use client';

import { usePathname } from 'next/navigation';
import MainLayout from '@/components/MainLayout';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // "/" is your login page -> NO sidebar
  if (pathname === '/') {
    return <>{children}</>;
  }

  // everything else -> sidebar
  return <MainLayout>{children}</MainLayout>;
}