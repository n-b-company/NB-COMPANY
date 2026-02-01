import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroupProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export default function FilterGroup({
  options,
  activeFilter,
  onFilterChange,
  label = 'Filtrar:',
  showIcon = true,
  className = '',
}: FilterGroupProps) {
  return (
    <div className={`no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 ${className}`}>
      {showIcon && (
        <div className="mr-2 flex shrink-0 items-center gap-2 text-zinc-500">
          <FilterIcon size={16} />
          {label && (
            <span className="text-[10px] font-black tracking-wider uppercase">{label}</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === option.id
                ? 'bg-primary border-primary text-zinc-950'
                : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
