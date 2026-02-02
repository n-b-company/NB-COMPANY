'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/constants/constants';

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-50 flex h-24 shrink-0 items-center justify-around border-t border-zinc-800/30 bg-zinc-950/80 px-2 backdrop-blur-xl">
      <div className="flex w-full max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-8 flex flex-col items-center gap-1.5"
              >
                <div className="bg-primary group flex h-16 w-16 items-center justify-center rounded-2xl text-zinc-950 shadow-[0_8px_30px_rgb(31,219,100,0.3)] transition-all hover:scale-105 active:scale-90">
                  <item.icon size={32} strokeWidth={2.5} />
                </div>
                <span className="text-primary text-[10px] font-black tracking-widest uppercase">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-1 flex-col items-center gap-1.5 transition-all ${
                isActive ? 'text-primary' : 'text-zinc-500'
              }`}
            >
              <div
                className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:text-zinc-300'}`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[9px] font-black tracking-[0.1em] uppercase transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="bg-primary absolute -bottom-4 h-1 w-4 rounded-full shadow-[0_0_10px_rgba(31,219,100,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
