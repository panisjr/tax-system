import RegistryCard from '@/components/RegistryCard';
import { ChartColumn, TrendingUp, Type, MapPinned, Users, FileChartColumnIncreasing } from 'lucide-react';

export default function PropertyRegistryPage() {
  return (
    <div className="flex">
      
      <main className="flex-1">
        <header className="mb-10">
          <h1 className={`font-lexend text-2xl font-bold text-[#595a5d]`}>Barangay Performance</h1>
          <p className={`font-inter text-xs text-slate-400 mt-1`}>Executive & Planning View - RPT Performance By Barangay</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RegistryCard
            icon={ChartColumn} 
            title="Collection Performance" 
            description="RPT collections per barangay with trend comparison" 
            buttonText="View Performance" 
          />
          <RegistryCard 
            icon={TrendingUp} 
            title="Barangay Ranking" 
            description="Rank Barangays by collection efficiency and compliance" 
            buttonText="View Rankings" 
          />
          <RegistryCard 
            icon={Type} 
            title="Deliquency Hotspots" 
            description="Identify barangays with high deliquency rates" 
            buttonText="Analyze" 
          />
          <RegistryCard 
            icon={MapPinned} 
            title="Barangay Map View" 
            description="Geographic visualization of RPT performance" 
            buttonText="Open Map" 
            variant="secondary"
          />
          <RegistryCard 
            icon={Users} 
            title="Taxpayer Summary" 
            description="Number of taxpayers and properties per barangay" 
            buttonText="View Summary" 
            variant="secondary"
          />
          <RegistryCard 
            icon={FileChartColumnIncreasing} 
            title="Barangay Reports" 
            description="Export barangay-level performance audit reports" 
            buttonText="Generate Reports" 
            variant="secondary"
          />
        </div>
      </main>
    </div>
  );
}