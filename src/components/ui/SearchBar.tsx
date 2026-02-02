import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types';

export default function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChange,
  className = '',
  variant = 'default',
}: SearchBarProps) {
  const isGlass = variant === 'glass';

  return (
    <div className={`group relative ${className}`}>
      <div className="group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500 transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl py-4 pr-4 pl-12 text-sm text-white transition-all outline-none ${
          isGlass
            ? 'focus:border-primary border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-xl'
            : 'focus:border-primary ring-primary/20 border border-zinc-800 bg-zinc-900 shadow-inner placeholder:text-zinc-600 focus:ring-4'
        }`}
      />
    </div>
  );
}
