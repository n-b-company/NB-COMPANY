import React from 'react';
import { CheckCircle2, CalendarClock } from 'lucide-react';
import { TicketCardProps } from '@/types';

export default function TicketCard({ data }: TicketCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800/50 bg-zinc-900 shadow-2xl">
      {/* Ticket Header */}
      <div className="flex flex-col items-center p-8 pb-6 text-center">
        <div className="bg-primary/10 border-primary/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_20px_rgba(31,219,100,0.15)] transition-all group-hover:scale-110">
          <CheckCircle2 size={42} className="text-primary" />
        </div>
        <p className="text-primary mb-2 text-[10px] font-black tracking-[0.25em] uppercase">
          {data.status === 'Aprobado' ? 'Pago Confirmado' : 'Estado de Pago'}
        </p>
        <h1 className="text-2xl font-black text-white">{data.empresa}</h1>
        <p className="mt-2 rounded-full border border-zinc-800/50 bg-zinc-950 px-3 py-1 font-mono text-xs tracking-widest text-zinc-500 uppercase">
          ID: {data.id}
        </p>
      </div>

      {/* Ticket Details */}
      <div className="px-8 py-2">
        <div className="flex items-center justify-between border-b border-zinc-800/30 py-4">
          <p className="text-sm font-medium text-zinc-500">Fecha de Pago</p>
          <p className="text-sm font-bold text-zinc-100">{data.fecha}</p>
        </div>
        <div className="flex items-center justify-between border-b border-zinc-800/30 py-4">
          <p className="text-sm font-medium text-zinc-500">Monto Total</p>
          <p className="text-xl font-black text-white">{data.monto}</p>
        </div>
        <div className="flex items-center justify-between py-4">
          <p className="text-sm font-medium text-zinc-500">Estado</p>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase ${
              data.status === 'Aprobado'
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'border-zinc-700 bg-zinc-800 text-zinc-400'
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Ticket Cut Decorative */}
      <div className="pointer-events-none relative flex h-10 items-center justify-between overflow-hidden px-[-20px]">
        <div className="absolute left-[-20px] size-10 rounded-full border border-zinc-800 bg-zinc-950 shadow-inner"></div>
        <div className="mx-6 w-full border-t-2 border-dashed border-zinc-800"></div>
        <div className="absolute right-[-20px] size-10 rounded-full border border-zinc-800 bg-zinc-950 shadow-inner"></div>
      </div>

      {/* Next Expiry Section */}
      <div className="p-8 pt-2">
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-zinc-800/50 bg-zinc-950/30 p-6 text-center shadow-inner">
          <p className="text-[10px] font-black tracking-[0.15em] text-zinc-500 uppercase">
            Próximo Vencimiento
          </p>
          <p className="text-3xl leading-none font-black tracking-tighter text-white">
            {data.proximoVencimiento}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <CalendarClock size={16} className="text-primary" />
            <p className="text-[11px] font-bold text-zinc-400">Suscripción Mensual Activa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
