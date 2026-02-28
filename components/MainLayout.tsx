// components/MainLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderComponent from "@/components/HeaderComponent";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderComponent
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main content scrolls */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}