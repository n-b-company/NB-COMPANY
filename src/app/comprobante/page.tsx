'use client';

import React from 'react';
import { Share2, Download, Bell, UserCircle2, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TicketCard from '@/components/ui/TicketCard';
import { TicketData } from '@/types';

const MOCK_TICKET_DATA: TicketData = {
  id: 'AR-8829420-X',
  empresa: 'NB COMPANY S.A.',
  fecha: '15 de Junio, 2024',
  monto: 'ARS $ 45.500,00',
  status: 'Aprobado',
  proximoVencimiento: '15 JUL 2024',
};

export default function ComprobantePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100">
      {/* Page Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 transition-colors hover:text-white active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg leading-tight font-bold tracking-tight text-white">Comprobante</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 transition-colors hover:text-white">
            <Bell size={18} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 transition-colors hover:text-white">
            <UserCircle2 size={18} />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10">
        <div className="w-full max-w-[450px]">
          {/* Reusable Ticket Component */}
          <TicketCard data={MOCK_TICKET_DATA} />

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] text-lg font-black text-zinc-950 shadow-lg shadow-[#25D366]/20 transition-all hover:brightness-110 active:scale-[0.98]">
              <Share2 size={22} strokeWidth={3} />
              Compartir por WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95">
                <Download size={20} />
                <span className="text-sm">Descargar PDF</span>
              </button>
              <Link
                href="/dashboard"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-transparent font-bold text-zinc-500 transition-all hover:bg-zinc-900 hover:text-zinc-300"
              >
                <X size={20} />
                <span className="text-sm">Cerrar</span>
              </Link>
            </div>
          </div>

          {/* Legal Footer */}
          <footer className="mt-12 pb-8 text-center">
            <p className="text-[10px] leading-relaxed font-black tracking-[0.2em] text-zinc-600 uppercase">
              Documento oficial emitido por el
              <br />
              Sistema Central de Facturación NB
              <br />© 2024 NB COMPANY S.A.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
