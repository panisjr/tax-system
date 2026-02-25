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
  FileText,
  CreditCard,
  MapPin,
  Bell,
  FolderOpen,
  UserCog,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const menuItems = [
  { name: 'Dashboard', path: '#', icon: LayoutDashboard },
  {
    name: 'Property Registry',
    path: '#',
    icon: Building2,
    subtitle: '(Assessor)',
    submenu: [
      { name: 'Add Property', path: '#' },
      { name: 'View Properties', path: '#' },
      { name: 'Edit Property', path: '#' },
    ],
  },
  {
    name: 'Taxpayer Records',
    path: '#',
    icon: Users,
    submenu: [
      { name: 'Active Taxpayers', path: '#' },
      { name: 'Inactive Taxpayers', path: '#' },
      { name: 'New Registration', path: '#' },
    ],
  },
  {
    name: 'Assessment & Billing',
    path: '#',
    icon: FileText,
    subtitle: '(Treasurer)',
    submenu: [
      { name: 'Create Assessment', path: '#' },
      { name: 'Generate Bills', path: '#' },
      { name: 'View Bills', path: '#' },
    ],
  },
  {
    name: 'Payments & QR Monitoring',
    path: '#',
    icon: CreditCard,
    submenu: [
      { name: 'Payment Logs', path: '#' },
      { name: 'QR Code Status', path: '#' },
    ],
  },
  { name: 'Barangay Performance', path: '#', icon: MapPin },
  { name: 'Delinquencies & Notices', path: '#', icon: Bell },
  { name: 'Document Tracking', path: '#', icon: FolderOpen },
  { name: 'User & Role Management', path: '#', icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`${inter.className} h-screen w-64 bg-white border-r border-gray-200 flex flex-col`}
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
            <p className='text-xs text-gray-600 text-[#000000]'>
              Real Property Tax Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-4 max-h-[calc(100vh-140px)] overflow-y-auto'>
        <Accordion type='single' collapsible>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div key={item.name}>
                {hasSubmenu ? (
                  <AccordionItem value={item.name}>
                    <AccordionTrigger className='text-[#A0A5B2] hover:text-gray-900 hover:bg-gray-50 px-2 rounded-lg py-3 cursor-pointer overflow-hidden'>
                      <div className='flex items-center gap-3 flex-1 overflow-hidden'>
                        <Icon className='w-5 h-5 flex-shrink-0 text-[#00154A]' />
                        <div className='flex-1 min-w-0 text-left overflow-hidden'>
                          <div className='text-sm font-medium truncate'>{item.name}</div>
                          {item.subtitle && (
                            <div className='text-xs text-gray-500 truncate'>{item.subtitle}</div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='pl-11 pt-0 pb-2'>
                      <div className='space-y-1'>
                        {item.submenu?.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.path}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition block cursor-pointer [text-decoration:none] ${
                              pathname === subitem.path
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <Link
                    href={item.path}
                    className='flex items-center gap-3 px-4 py-3 rounded-lg transition text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900 block cursor-pointer [text-decoration:none] overflow-hidden'
                  >
                    <Icon className='w-5 h-5 flex-shrink-0 text-[#00154A]' />
                    <div className='flex-1 min-w-0 text-left overflow-hidden'>
                      <div className='text-sm font-medium truncate'>{item.name}</div>
                      {item.subtitle && (
                        <div className='text-xs text-gray-500 truncate'>{item.subtitle}</div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </Accordion>
      </nav>
    </aside>
  );
}