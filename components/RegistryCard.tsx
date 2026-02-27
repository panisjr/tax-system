interface RegistryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  variant?: 'primary' | 'secondary';
}

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export default function RegistryCard({ icon: Icon, title, description, buttonText, variant = 'primary' }: RegistryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between h-48">
      <div>
        <Icon className="text-slate-700 mb-3" size={24} />
        <h3 className={`${inter.className} text-sm font-semibold text-[#848794]`}>{title}</h3>
        <p className={`${inter.className} text-[11px] text-[#C0C7D0] mt-1`}>{description}</p>
      </div>
      <button className={`w-full py-2 rounded text-[10px] font-medium transition-all ${
        variant === 'primary' 
        ? 'bg-[#121926] text-white hover:bg-slate-800' 
        : 'bg-white border border-gray-200 text-slate-500 hover:bg-gray-50'
      }`}>
        {buttonText}
      </button>
    </div>
  );
}