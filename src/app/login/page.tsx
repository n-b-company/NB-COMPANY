'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { ASSETS } from '@/constants/constants';

import { Input } from '@/components/ui/FormElements';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { loginAction } from './actions';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    try {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      // Si es un error de Next.js redirect, no hacemos nada (es el comportamiento esperado)
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        throw err;
      }
      console.error('Login error:', err);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <Input
                id="user"
                label="Usuario"
                placeholder="nbadmin"
                {...register('username')}
                error={errors.username?.message}
              />

              <div className="relative">
                <Input
                  id="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="nbdev2026"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[38px] right-3 text-zinc-500 transition-colors hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary relative my-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-base font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
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
