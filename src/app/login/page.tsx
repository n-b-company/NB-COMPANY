'use client';

import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ASSETS } from '@/lib/constants';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col items-center justify-between px-8 py-12">
      {/* Decorative Glow */}
      <div className="bg-primary/20 absolute top-[-10%] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-[120px]" />

      <div className="relative flex w-full flex-1 flex-col items-center justify-center">
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative mb-6 h-40 w-48">
            <Image
              src={ASSETS.LOGO}
              alt="NB COMPANY Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-2 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Centro de Control de Operativo
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="group relative">
              <User
                size={20}
                className="group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Usuario"
                className="ring-primary/20 focus:border-primary w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-4 pr-4 pl-12 text-zinc-500 transition-all outline-none placeholder:text-zinc-600 focus:ring-4"
                defaultValue="Administrador"
                readOnly
              />
            </div>

            <div className="group relative">
              <Lock
                size={20}
                className="group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ring-primary/20 focus:border-primary w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-4 pr-4 pl-12 text-white transition-all outline-none placeholder:text-zinc-600 focus:ring-4"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-base font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 my-4"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Ingreso
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-xs text-zinc-600">
          Uso restringido para personal autorizado de NB COMPANY.
        </p>
        <p className="mt-1 font-mono text-[10px] text-zinc-700">v1.0.0 PWA</p>
      </div>
    </div>
  );
}
