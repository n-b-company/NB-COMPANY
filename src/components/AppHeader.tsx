'use client';

import Image from 'next/image';
import { ASSETS } from '@/constants/constants';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-24">
          <Image
            src={ASSETS.LOGO}
            alt="NB COMPANY Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <div className="h-6 w-px bg-zinc-800" />
        <div>
          <h2 className="text-sm leading-tight font-bold text-white">Técnico</h2>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            Control
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="border-primary/30 relative h-10 w-10 overflow-hidden rounded-full border-2 p-0.5">
          <Image
            src={ASSETS.AVATAR_PLACEHOLDER}
            alt="Avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
