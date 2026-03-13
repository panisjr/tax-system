// components/MainLayout.tsx
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import HeaderComponent from "@/components/HeaderComponent";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderComponent />
        {/* Main content scrolls */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}