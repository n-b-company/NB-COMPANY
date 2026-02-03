'use client';

import { FilterGroupProps } from '@/types';

export default function FilterGroup({
  options,
  activeFilter,
  onFilterChange,
  className = '',
}: FilterGroupProps) {
  return (
    <div
      className={`scrollbar-hide flex w-full gap-3 overflow-x-auto sm:gap-0 sm:overflow-visible sm:rounded-2xl sm:bg-zinc-900/50 sm:p-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className={`rounded-xl px-4 py-2 text-xs font-black tracking-wider whitespace-nowrap uppercase transition-all sm:flex-1 sm:px-0 sm:py-2.5 ${
              isActive
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 sm:bg-transparent'
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
