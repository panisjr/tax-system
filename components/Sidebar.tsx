"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  FileText,
  MapPin,
  Bell,
  Folder,
  UserCog,
  UserCircle2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type MenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Property Registry", path: "/property", icon: Building2, subtitle: "(Assessor)" },
  { name: "Taxpayer Records", path: "/taxpayers", icon: Users },
  { name: "Assessment & Billing", path: "/assessment", icon: Wallet, subtitle: "(Treasurer)" },
  { name: "Payments & OR Monitoring", path: "/payments", icon: FileText },
  { name: "Barangay Performance", path: "/barangay", icon: MapPin },
  { name: "Delinquencies & Notices", path: "/deliquencies", icon: Bell },
  { name: "Document Tracking", path: "/document", icon: Folder },
  { name: "User & Role Management", path: "/user", icon: UserCog },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="font-inter border-r border-gray-200 bg-white">
      {/* Logo header */}
      <SidebarHeader className="border-b border-gray-200 px-4 py-3">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/img/sta.rita_logo.png"
              alt="Sta. Rita Logo"
              fill
              className="object-contain"
            />
          </div>
          <div
            className={cn(
              "whitespace-nowrap transition-all duration-150 ease-in-out overflow-hidden",
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            <h1 className="font-lexend text-lg font-bold text-[#666D7D]">
              Sta. Rita, Samar
            </h1>
            <p className="font-lexend text-xs text-gray-600">
              Real Property Tax Monitoring
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.path}
                  tooltip={item.name}
                  className="h-auto text-[#A0A5B2] hover:font-semibold data-[active=true]:bg-blue-50! data-[active=true]:text-blue-600!"
                >
                  <Link href={item.path}>
                    <Icon className="size-8 shrink-0 text-[#00154A]" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.subtitle && (
                        <span className="text-xs text-gray-500">{item.subtitle}</span>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-3">
        <Link href="/user/profile">
          <div
            className={cn(
              "flex cursor-pointer items-center rounded-xl p-2 transition hover:bg-slate-100",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="shrink-0">
              <UserCircle2 className="size-9 text-slate-400" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="font-lexend truncate text-sm font-semibold text-slate-700">
                  System Administrator
                </p>
                <p className="truncate text-xs text-slate-400">admin@starita.gov.ph</p>
              </div>
            )}
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
