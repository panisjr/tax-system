interface RegistryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  variant?: 'primary' | 'secondary';
  onButtonClick?: () => void;
}

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['100', '300'] });

export default function RegistryCard({ icon: Icon, title, description, buttonText, variant = 'primary', onButtonClick }: RegistryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between h-48">
      <div>
        <Icon className="text-[#00154A] mb-3" size={24} />
        <h3 className={`${inter.className} text-sm font-semibold text-[#848794]`}>{title}</h3>
        <p className={`${inter.className} text-[12px] text-[#C0C7D0] mt-1`}>{description}</p>
      </div>
      <button onClick={onButtonClick} className={`${inter.className} w-full py-2 rounded text-[12px] font-medium transition-all cursor-pointer ${
        variant === 'primary' 
        ? 'bg-[#0F172A] text-[#8A9098] hover:bg-slate-800' 
        : 'bg-white border border-gray-200 text-slate-500 hover:bg-gray-50'
      }`}>
        {buttonText}
      </button>
    </div>
  );
} 