import { Package, AlertTriangle, FileX } from 'lucide-react';
import { StatItemProps, StatsGridProps } from '@/types';
import { STAT_VARIANTS } from '@/constants/constants';

function StatItem({ label, value, icon: Icon, variant }: StatItemProps) {
  const style = STAT_VARIANTS[variant];

  return (
    <div
      className={`group rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all ${style.border}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.iconBg}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className={`text-2xl leading-none font-black ${style.text}`}>{value}</p>
    </div>
  );
}

export default function StatsGrid({ active, warning, overdue }: StatsGridProps) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      <StatItem label="Activos" value={active} icon={Package} variant="success" />
      <StatItem label="Vencer" value={warning} icon={AlertTriangle} variant="warning" />
      <StatItem label="Vencidos" value={overdue} icon={FileX} variant="danger" />
    </div>
  );
}
