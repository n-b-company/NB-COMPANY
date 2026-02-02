import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '@/types';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-white transition-all hover:bg-zinc-800 disabled:opacity-30"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Página</span>
        <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-white">
          {currentPage}
        </span>
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          de {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-white transition-all hover:bg-zinc-800 disabled:opacity-30"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
