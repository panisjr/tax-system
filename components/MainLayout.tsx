// components/MainLayout.tsx
import Sidebar from "@/components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixed height + its own scroll */}
      <aside className="w-64 shrink-0 border-r bg-white overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main content scrolls */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}