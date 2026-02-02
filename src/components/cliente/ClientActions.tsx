import { MessageCircle, RefreshCw, Trash2, Power } from 'lucide-react';
import { ClientActionsProps } from '@/types';

export default function ClientActions({
  onWhatsApp,
  onRenew,
  onDeactivate,
  isInactive,
}: ClientActionsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {!isInactive && (
        <button
          onClick={onWhatsApp}
          title="Contactar WhatsApp"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-3 text-[#25D366] transition-all hover:bg-zinc-800 active:scale-[0.95]"
        >
          <MessageCircle size={22} fill="currentColor" />
          <span className="text-[10px] font-black tracking-tighter uppercase">Chat</span>
        </button>
      )}

      {!isInactive && (
        <button
          onClick={onRenew}
          title="Renovar Suscripción"
          className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex flex-col items-center justify-center gap-2 rounded-2xl border py-3 transition-all active:scale-[0.95]"
        >
          <RefreshCw size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-black tracking-tighter uppercase">Renovar</span>
        </button>
      )}

      <button
        onClick={onDeactivate}
        title={isInactive ? 'Activar Cliente' : 'Desactivar Cliente'}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border py-3 transition-all active:scale-[0.95] ${
          isInactive
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
            : 'border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20'
        } ${isInactive ? 'col-span-3' : ''}`}
      >
        {isInactive ? <Power size={20} /> : <Trash2 size={20} />}
        <span className="text-[10px] font-black tracking-tighter uppercase">
          {isInactive ? 'Activar' : 'Baja'}
        </span>
      </button>
    </div>
  );
}
