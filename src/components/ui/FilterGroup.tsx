import { Filter as FilterIcon } from 'lucide-react';
import { FilterGroupProps } from '@/types';

export default function FilterGroup({
  options,
  activeFilter,
  onFilterChange,
  label,
  showIcon = true,
  className = '',
}: FilterGroupProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <div className="flex items-center gap-2 px-1">
          {showIcon && <FilterIcon size={14} className="text-zinc-500" />}
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
            {label}
          </span>
        </div>
      )}
      <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {options.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                isActive
                  ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(31,219,100,0.1)]'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/50'
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span
                  className={`flex size-5 items-center justify-center rounded-lg text-[10px] font-black ${
                    isActive ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
