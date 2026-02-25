// app/layout.tsx
import './globals.css';
import MainLayout from '@/components/MainLayout';

export const metadata = {
  title: 'Your App Name',
  description: 'App description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrapping the whole app in your MainLayout */}
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}