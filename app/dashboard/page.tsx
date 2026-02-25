'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AnalyticsCard from '@/components/AnalyticsCard';


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const fetchChartData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
          {
            label: 'Monthly Collections',
            data: [1180000, 950000, 1500000, 1800000],
            backgroundColor: '#000000', // Black bars
            barPercentage: 0.85,
            categoryPercentage: 0.9,
            borderRadius: 2,
          },
        ],
      });
    }, 400); // 400ms fake network delay
  });
};

export default function Dashboard() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    loadData();
  }, []);

  // Chart configuration options matching your image
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hides the top label to match the mockup
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Removes vertical grid lines
        },
        ticks: {
          color: '#9ca3af', // Gray text
          font: { size: 12 },
        },
        border: {
          display: true,
          color: '#e5e7eb', // Light gray bottom border
        },
      },
      y: {
        min: 0,
        max: 1800000,
        ticks: {
          stepSize: 450000, // Explicitly sets the increments matching the image
          color: '#9ca3af',
          font: { size: 12 },
        },
        grid: {
          display: false, // Removes horizontal grid lines inside the chart
        },
        border: {
          display: true,
          color: '#e5e7eb', // Light gray left border
        },
      },
    },
  };

  return (
    <main className="bg-[#f0f4f8] min-h-screen pb-10">
        <AnalyticsCard />
  
    
       
      {/* Main Container */}
       
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-4">
        
        {/* Left Card: Monthly Collections Graph */}
        <div className="bg-white border border-gray-200 p-6 grow md:w-2/3 shadow-sm">
          <h2 className="text-gray-500 text-sm font-medium mb-6">Monthly Collections</h2>
          <div className="relative h-75 w-full flex items-center justify-center">
            {/* Show a simple loading state while waiting for the API */}
            {chartData ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <span className="text-gray-400">Loading chart...</span>
            )}
          </div>
        </div>

        {/* Right Card: Delinquent Accounts Stats */}
<div className="bg-white border border-gray-200 p-8 flex flex-col md:w-1/3 shadow-sm rounded-sm">
  <h2 className="text-gray-600 text-sm font-bold mb-6">Delinquent Accounts</h2>
  
  <ul className="text-gray-500 text-sm space-y-4">
    <li className="flex items-center">
      <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
      1,245 properties overdue
    </li>
    <li className="flex items-center">
      <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
      $320M unpaid taxes
    </li>
    <li className="flex items-center">
      <span className="text-gray-800 text-lg leading-none mr-2">•</span> 
      18% delinquency rate
    </li>
  </ul>

  <div className="mt-10">
    <button className="w-full bg-[#0f1729] hover:bg-slate-800 text-gray-200 text-xs font-semibold py-2 px-4 rounded-sm transition-colors shadow-sm">
      View Delinquencies
    </button>
  </div>
</div>

      </div>
      </main>
  );
}