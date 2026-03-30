'use client';

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { ASSETS } from '@/constants/constants';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Cerrando sesión...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xl">
      <div className="relative mb-8 h-16 w-32">
        <Image src={ASSETS.LOGO} alt="Logo" fill className="object-contain" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-primary animate-spin">
          <Loader2 size={40} />
        </div>

        <p className="text-sm font-black tracking-widest text-white uppercase italic">{message}</p>
      </div>

      <div className="absolute bottom-10">
        <p className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
          NB COMPANY SECURE SYSTEM
        </p>
      </div>
    </div>
  );
}
