import React from 'react';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { ClientHeaderProps } from '@/types';

export default function ClientHeader({ name, id, statusText, onBack }: ClientHeaderProps) {
  return (
    <div className="flex flex-col gap-3 px-6 pt-4">
      <button
        onClick={onBack}
        className="hover:text-primary flex w-fit items-center gap-2 text-sm text-zinc-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver al Listado
      </button>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-3">
          <div>
            <h1 className="text-xl leading-tight font-black tracking-tight text-white">{name}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <BadgeCheck size={14} className="text-primary" />
              {statusText}
            </p>
          </div>
          <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            ID: {id}
          </span>
        </div>
      </div>
    </div>
  );
}
