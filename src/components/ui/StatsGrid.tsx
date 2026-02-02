import { Package, AlertTriangle, FileX } from 'lucide-react';
import { StatItemProps, StatsGridProps } from '@/types';
import { STAT_VARIANTS } from '@/constants/constants';

interface StatItemPropsExtended extends StatItemProps {
  isActive?: boolean;
  onClick?: () => void;
}

function StatItem({ label, value, icon: Icon, variant, isActive, onClick }: StatItemPropsExtended) {
  const style = STAT_VARIANTS[variant];

  return (
    <button
      onClick={onClick}
      className={`group flex w-full flex-col rounded-2xl border p-4 text-left transition-all duration-300 active:scale-95 ${
        isActive
          ? `border-primary bg-primary/10 shadow-primary/5 shadow-lg`
          : `border-zinc-800 bg-zinc-900 ${style.border}`
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`text-[10px] font-bold uppercase transition-colors ${
            isActive ? 'text-primary' : 'text-zinc-500'
          }`}
        >
          {label}
        </span>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
            isActive ? 'bg-primary text-white' : style.iconBg
          }`}
        >
          <Icon size={16} />
        </div>
      </div>
      <p
        className={`text-2xl leading-none font-black transition-colors ${
          isActive ? 'text-white' : style.text
        }`}
      >
        {value}
      </p>
    </button>
  );
}

export default function StatsGrid({
  active,
  warning,
  overdue,
  activeStatus,
  onStatusChange,
}: StatsGridProps) {
  const handleToggle = (status: string) => {
    if (onStatusChange) {
      onStatusChange(activeStatus === status ? null : status);
    }
  };

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      <StatItem
        label="Activos"
        value={active}
        icon={Package}
        variant="success"
        isActive={activeStatus === 'ACTIVE'}
        onClick={() => handleToggle('ACTIVE')}
      />
      <StatItem
        label="Vencer"
        value={warning}
        icon={AlertTriangle}
        variant="warning"
        isActive={activeStatus === 'WARNING'}
        onClick={() => handleToggle('WARNING')}
      />
      <StatItem
        label="Vencidos"
        value={overdue}
        icon={FileX}
        variant="danger"
        isActive={activeStatus === 'OVERDUE'}
        onClick={() => handleToggle('OVERDUE')}
      />
    </div>
  );
}
