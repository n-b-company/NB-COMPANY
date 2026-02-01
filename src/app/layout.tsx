import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NB COMPANY - Gestión de POSNET',
  description: 'Sistema de control operativo y facturación para NB COMPANY',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} flex min-h-screen items-center justify-center bg-zinc-900 font-sans antialiased`}
      >
        <div className="phone-frame bg-zinc-950 text-white">{children}</div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
