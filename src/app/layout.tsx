import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ClickSparkle } from '@/components/click-sparkle';
import { Toaster } from '@/components/ui/toaster';
import { ScrollProgress } from '@/components/scroll-progress';
import { CommandPalette } from '@/components/command-palette';
import { AuroraBackground } from '@/components/aurora-background';
import { ScrollRestoration } from '@/components/scroll-restoration';

export const metadata: Metadata = {
  title: 'Jayadeep Gowda',
  description: 'Robotics and AI Engineer building full stack intelligent systems.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <ScrollRestoration />
          <div className='relative'>
            <div className="bg-grain" aria-hidden="true" />
            <AuroraBackground />
            <ScrollProgress />
            <CommandPalette />
            <Header />
            <ClickSparkle />
            <main className="relative">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
