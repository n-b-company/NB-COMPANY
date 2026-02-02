'use client';

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorViewProps {
  message?: string;
  onReset?: () => void;
}

export default function ErrorView({
  message = 'No pudimos cargar la información solicitada.',
  onReset,
}: ErrorViewProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertCircle size={32} />
      </div>
      <h2 className="mb-2 text-xl font-black text-white">¡Ups! Algo salió mal</h2>
      <p className="mx-auto mb-8 max-w-xs text-sm text-zinc-500">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95"
        >
          <RefreshCcw size={18} />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
