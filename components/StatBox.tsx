import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
});

interface StatBoxProps {
  label: string;
  value: string;
}

export default function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className={`${inter.className} text-sm font-medium text-[#b6beca] mb-2`}>
        {label}
      </h2>
      <p className={`${inter.className} text-2xl font-semibold text-[#565a6a]`}>
        {value}
      </p>
    </div>
  );
}