
import RegistryCard from '@/components/RegistryCard';

import { Building, FilePlus, RefreshCcw, MapPin, ListChecks, FileSearch } from 'lucide-react';
import { Lexend, Inter } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function PropertyRegistryPage() {
  return (
    <div className="flex">
      
      <main className="flex-1">
        <header className="mb-10">
          <h1 className={`${lexend.className} text-2xl font-bold text-[#595a5d]`}>Property Registry</h1>
          <p className={`${inter.className} text-xs text-slate-400 mt-1`}>Assessor Module - Municipality of Sta. Rita, Samar</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RegistryCard
            icon={Building} 
            title="Property Listing" 
            description="View and manage all registered real properties" 
            buttonText="Open Registry" 
          />
          <RegistryCard 
            icon={FilePlus} 
            title="New Tax Declaration" 
            description="Create Tax Declaration for newly declared properties" 
            buttonText="Create TD" 
          />
          <RegistryCard 
            icon={RefreshCcw} 
            title="Reassessment & Revision" 
            description="Update assessments due to improvements or reclassification" 
            buttonText="Start Reassessment" 
          />
          <RegistryCard 
            icon={MapPin} 
            title="Tax Mapping" 
            description="View properties by barangay and location" 
            buttonText="Open Map" 
            variant="secondary"
          />
          <RegistryCard 
            icon={ListChecks} 
            title="Assessment Schedules" 
            description="Manage assessment levels and ordinances" 
            buttonText="View Schedules" 
            variant="secondary"
          />
          <RegistryCard 
            icon={FileSearch} 
            title="Reports & Certifications" 
            description="Generate assessor reports and certifications" 
            buttonText="Generate" 
            variant="secondary"
          />
        </div>
      </main>
    </div>
  );
}