import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { PWAProvider } from '../components/PWAProvider';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';
import { CommandPalette } from '../components/CommandPalette';
import { QuickCaptureModal } from '../components/QuickCaptureModal';
import { AuthModal } from '../components/AuthModal';
import { ErrorBoundary } from '../components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LPU Memory OS | Production Cloud & Offline Vault',
  description: 'Production-grade cognitive engine, Supabase PostgreSQL, auth, notes, tasks, mind maps & full text search.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Memory OS',
  },
  openGraph: {
    title: 'LPU Memory OS | The Operating System for Your Mind',
    description: 'Supabase-powered cognitive engine, notes, tasks, mind maps & knowledge graph.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090B] text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <PWAProvider>
            <Navbar />
            <div className="flex flex-1 w-full min-h-[calc(100vh-61px)]">
              <Sidebar />
              <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-12 overflow-x-hidden">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
            <BottomNav />
            <CommandPalette />
            <QuickCaptureModal />
            <AuthModal />
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
