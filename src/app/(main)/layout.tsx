import React from 'react';
import AppHeader from '@/components/AppHeader';
import BottomNavbar from '@/components/BottomNavbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <main className="scrollbar-hide flex-1 overflow-y-auto">{children}</main>
      <BottomNavbar />
    </div>
  );
}
