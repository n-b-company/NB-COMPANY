'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <footer className="flex h-20 shrink-0 items-center justify-around border-t border-zinc-900 bg-zinc-950 px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-6 flex flex-col items-center gap-1"
            >
              <div className="bg-primary shadow-primary/40 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform active:scale-90">
                <item.icon size={28} strokeWidth={3} />
              </div>
              <span className="text-primary mt-1 text-[10px] font-bold tracking-widest uppercase">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-zinc-500 opacity-60 hover:opacity-100'}`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold tracking-widest uppercase">{item.label}</span>
          </Link>
        );
      })}
    </footer>
  );
}
