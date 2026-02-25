'use client';

import { useState } from 'react';
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
  ChevronDown,
} from 'lucide-react';

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
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

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
      <nav
        className={`flex-1 p-4 space-y-1 max-h-[calc(100vh-140px)] ${
          openSubmenus.length > 0 ? 'overflow-y-auto' : 'overflow-y-hidden'
        }`}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isSubmenuOpen = openSubmenus.includes(item.name);
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <div key={item.path}>
              {hasSubmenu ? (
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className='w-5 h-5 flex-shrink-0 text-[#00154A]' />
                  <div className='flex-1 min-w-0 text-left'>
                    <div className='text-sm font-medium truncate'>{item.name}</div>
                    {item.subtitle && (
                      <div className='text-xs text-gray-500'>{item.subtitle}</div>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSubmenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className='w-5 h-5 flex-shrink-0 text-[#00154A]' />
                  <div className='flex-1 min-w-0 text-left'>
                    <div className='text-sm font-medium truncate'>{item.name}</div>
                    {item.subtitle && (
                      <div className='text-xs text-gray-500'>{item.subtitle}</div>
                    )}
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {hasSubmenu && isSubmenuOpen && (
                <div className='ml-2 mt-1 space-y-1 pl-4 border-l border-gray-200'>
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.path}
                      href={subitem.path}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg transition ${
                        pathname === subitem.path
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-[#A0A5B2] hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}