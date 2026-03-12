'use client';

import dynamic from 'next/dynamic';

const BarangayPerformanceMap = dynamic(() => import('@/components/BarangayPerformanceMap'), {
  ssr: false,
});

export default function BarangayPerformanceMapClient() {
  return <BarangayPerformanceMap />;
}
