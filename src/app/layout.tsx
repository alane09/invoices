import MainContent from '@/components/MainContent';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'COFICAB - Invoice AI Extractor',
  description: 'Professional invoice data extraction using advanced AI technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <MainContent>
              {children}
            </MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
