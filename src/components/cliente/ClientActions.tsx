import React from 'react';
import { MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import { ClientActionsProps } from '@/types';

export default function ClientActions({ onWhatsApp, onRenew, onDeactivate }: ClientActionsProps) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <button
        onClick={onWhatsApp}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 py-4 text-[#25D366] transition-all hover:bg-zinc-700 active:scale-[0.98]"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="font-bold">Contactar por WhatsApp</span>
      </button>

      <button
        onClick={onRenew}
        className="bg-primary hover:bg-primary/90 shadow-primary/20 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-white shadow-lg transition-all active:scale-[0.98]"
      >
        <RefreshCw size={20} className="font-bold" />
        <span className="font-bold">Renovar Suscripción</span>
      </button>

      <button
        onClick={onDeactivate}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 py-4 text-red-500 transition-all hover:bg-red-500/20 active:scale-[0.98]"
      >
        <Trash2 size={20} />
        <span className="font-bold">Desactivar Cliente</span>
      </button>
    </div>
  );
}
