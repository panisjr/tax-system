import { Lexend } from 'next/font/google';
import { Inter } from 'next/font/google';
import StatBox from './StatBox';

const lexend = Lexend({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['600'] });

export default function AnalyticsCard() {
  return (
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Properties" value="12,458" />
        <StatBox label="Registered Taxpayers" value="9,203" />
        <StatBox label="Total Assessment Value" value="$8.4B" />
        <StatBox label="Collections This Year" value="₱5.6B" />
      </div>
  );
}