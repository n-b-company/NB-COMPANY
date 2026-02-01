import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NB COMPANY - Gestión de POSNET',
  description: 'Sistema de control operativo y facturación para NB COMPANY',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} flex min-h-screen items-center justify-center bg-zinc-900 font-sans antialiased`}
      >
        <div className="phone-frame bg-zinc-950 text-white">{children}</div>
      </body>
    </html>
  );
}
