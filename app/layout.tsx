import './globals.css';
import Sidebar from '@/app/components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar/>
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}