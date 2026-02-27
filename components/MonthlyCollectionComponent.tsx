'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

const fetchChartData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { month: 'Jan', collections: 1180000 },
        { month: 'Feb', collections: 950000 },
        { month: 'Mar', collections: 1500000 },
        { month: 'Apr', collections: 1800000 },
      ]);
    }, 400); 
  });
};

export default function DashboardGraph() {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data as any[]);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="bg-white p-6 w-full max-w-3xl rounded-sm shadow-sm border border-gray-100">
      <h2 className={`${inter.className} text-[#94a3b8] text-sm font-medium mb-8`}>Monthly Collections</h2>
      
      <div className="relative h-62.5 w-full flex items-center justify-center">
        {chartData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }} barCategoryGap="15%">
              <XAxis 
                dataKey="month" 
                axisLine={{ stroke: '#e2e8f0' }} // Light slate border
                tickLine={false} // No ticks on the bottom axis
                tick={{ fill: '#94a3b8', fontSize: 13 }} // Slate text
                dy={12} // Pushes text down slightly from the  line
              />
              <YAxis 
                domain={[0, 1800000]} 
                ticks={[0, 450000, 900000, 1350000, 1800000]} // Explicit increments
                axisLine={{ stroke: '#e2e8f0' }} // Light slate left border
                tickLine={{ stroke: '#e2e8f0' }} // ADDED: The tiny tick marks matching your image!
                tick={{ fill: '#94a3b8', fontSize: 13 }}
                dx={-5} // Pushes text slightly away from the tick marks
                width={80} // Ensures the large numbers don't get cut off
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="collections" 
                fill="#000000" 
                radius={[2, 2, 0, 0]} // Very slight rounding on the top corners
                maxBarSize={120} // Prevents them from getting ridiculously huge on ultrawide monitors
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <span className="text-gray-400">Loading chart...</span>
        )}
      </div>
    </div>
  );
}