'use client';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

import { Lexend } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend',
});

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  FileText,
  MapPin,
  Bell,
  Folder,
  UserCog
} from 'lucide-react';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

type SubmenuItem = {
  name: string;
  path: string;
};

type MenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  submenu?: SubmenuItem[];
};

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  {
    name: 'Property Registry',
    path: '/property/registry',
    icon: Building2, // The tall building
    subtitle: '(Assessor)'
  },
  {
    name: 'Taxpayer Records',
    path: '/taxpayers',
    icon: Users, // The two people  
  },
  {
    name: 'Assessment & Billing',
    path: '#',
    icon: Wallet, // The document with lines
    subtitle: '(Treasurer)',
  },
  {
    name: 'Payments & QR Monitoring',
    path: '#',
    icon: FileText, // The credit card with the magnetic stripe
  },
  { name: 'Barangay Performance', path: '#', icon: MapPin },
  { name: 'Delinquencies & Notices', path: '#', icon: Bell },
  { name: 'Document Tracking', path: '#', icon: Folder }, // The folder
  { name: 'User & Role Management', path: '#', icon: UserCog }, // The user with the gear
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`${inter.className} fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Header with Logo */}
      <div className='p-5 border-b border-gray-200'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='relative w-12 h-12'>
            <Image
              src='/img/sta.rita_logo.png'
              alt='Sta. Rita Logo'
              fill
              className='object-contain'
            />
          </div>
          <div>
            <h1 className={`${lexend.className} text-lg font-bold text-[#666D7D]`}>
              Sta. Rita, Samar
            </h1>
            <p className='text-xs text-gray-600'>
              Real Property Tax Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
        <nav className="flex-1 p-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          <div>
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-2 py-3 rounded-lg transition cursor-pointer [text-decoration:none] overflow-hidden ${
                    pathname === item.path
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900 hover:font-semibold"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 text-[#00154A]" />

                  <div className="flex-1 min-w-0 text-left overflow-hidden">
                    <div className="text-sm font-medium truncate">
                      {item.name}
                    </div>

                    {item.subtitle && (
                      <div className="text-xs text-gray-500 truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
    </aside>
  );
}