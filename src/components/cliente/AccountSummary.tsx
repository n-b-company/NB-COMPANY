import { Info } from 'lucide-react';
import { AccountSummaryProps } from '@/types';

export default function AccountSummary({
  vencimiento,
  proximoVencimiento,
  saldoPendiente,
  notas,
}: Omit<AccountSummaryProps, 'ultimoPago'>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h4 className="mb-4 flex items-center gap-2 font-bold text-white">
          <Info size={18} className="text-primary" />
          Estado de Cuenta
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/50 py-2">
            <span className="text-sm text-zinc-500">Vencimiento</span>
            <span className="text-sm font-bold text-white">{vencimiento}</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-800/50 py-2">
            <span className="text-sm text-zinc-500">Próximo Vencimiento</span>
            <span className="text-sm font-bold text-zinc-300">{proximoVencimiento}</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-800/50 py-2">
            <span className="text-sm text-zinc-500">Saldo Pendiente</span>
            <span className="text-sm font-black text-red-400">{saldoPendiente}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h4 className="mb-3 font-bold text-white">Notas Internas</h4>
        <p className="text-xs leading-relaxed text-zinc-500 italic">&quot;{notas}&quot;</p>
      </div>
    </div>
  );
}
