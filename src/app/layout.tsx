import type {Metadata} from 'next';
import './globals.css';
import { Toaster as OldToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes"


export const metadata: Metadata = {
  title: 'ChatGPT',
  description: 'A modern and elegant AI chat application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <OldToaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
