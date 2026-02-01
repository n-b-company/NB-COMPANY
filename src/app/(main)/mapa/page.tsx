'use client';

import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MapaPage() {
  const router = useRouter();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        {/* Glow Effect */}
        <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-3xl" />

        <div className="relative flex size-24 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <Construction size={48} className="text-primary animate-bounce" />
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2">
          <div className="bg-primary size-4 animate-ping rounded-full" />
        </div>
      </div>

      <h1 className="mb-4 text-4xl font-black tracking-tight text-white">
        Mapa en{' '}
        <span className="text-primary text-linear-to-r from-primary to-emerald-400">
          Desarrollo
        </span>
      </h1>

      <p className="mb-12 max-w-md leading-relaxed font-medium text-balance text-zinc-500">
        Estamos integrando el sistema de geolocalización avanzada para que puedas visualizar tus
        terminales en tiempo real.
        <span className="mt-4 block font-bold text-zinc-400 italic">
          ¡Pronto disponible para NB COMPANY v2.0!
        </span>
      </p>

      <button
        onClick={() => router.push('/dashboard')}
        className="group hover:border-primary/50 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95"
      >
        <ArrowLeft size={18} className="group-hover:text-primary text-zinc-500 transition-colors" />
        Volver al Dashboard
      </button>

      {/* Progress placeholder */}
      <div className="mt-16 w-full max-w-xs">
        <div className="mb-2 flex justify-between text-[10px] font-black tracking-widest text-zinc-500 uppercase">
          <span>Progreso de Integración</span>
          <span className="text-primary">85%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
          <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(31,219,100,0.5)]" />
        </div>
      </div>
    </div>
  );
}
