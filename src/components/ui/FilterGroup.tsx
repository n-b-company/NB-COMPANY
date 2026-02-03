'use client';

import { FilterGroupProps } from '@/types';

export default function FilterGroup({
  options,
  activeFilter,
  onFilterChange,
  className = '',
}: FilterGroupProps) {
  return (
    <div className={`flex rounded-2xl bg-zinc-900/50 p-1 ${className}`}>
      {options.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
              isActive ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1.5 text-[10px] opacity-60">({option.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
