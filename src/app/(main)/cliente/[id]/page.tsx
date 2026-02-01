'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Info, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import InfoGrid from '@/components/ui/InfoGrid';
import { DEFAULT_INFO_ITEMS } from '@/constants/mockData';

export default function DetalleClientePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Información');

  const tabs = ['Información', 'Ubicación', 'Historial'];

  return (
    <div className="flex flex-col pb-40">
      {/* breadcrumbs & Header Info */}
      <div className="flex flex-col gap-6 px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="hover:text-primary flex w-fit items-center gap-2 text-sm text-zinc-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al Listado
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <h1 className="text-3xl leading-tight font-black tracking-tight text-white">
                Kiosco El Trébol
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                <BadgeCheck size={16} className="text-primary" />
                Cliente Activo desde Enero 2024
              </p>
            </div>
            <span className="w-fit rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              ID: #CL-98234
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-6 flex w-full overflow-x-auto border-b border-zinc-800 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'border-primary border-b-2 text-white'
                : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 px-6 pt-8">
        {/* Main Content Info */}
        <div className="flex flex-col gap-8">
          {/* Main Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbNut0J06ooxmOExAol24WE5WNkYwrMHgY1w7ykz26XZ14VduBTZTYL5oQNtYXa3OeTLafG-CKoeeZm0LVh2fcQHQDQqE3aq2ULKwsJVQXRHSiA6Sf9mN8-lYgFd1E0_ZnVujQBWejZF2_odoSu6qM5kDkomR1IuD6q2YMSILb2_S6VKlSbl2GF0SmOlM6fkahfAczxatsLCT9WMQ9Yk9eqCCu7U0QazQuAKpht3DGMJNv6BmBguk8bOeUP5jHgLzaJDl03WO69Os"
              alt="Fachada Kiosco El Trébol"
              fill
              className="object-cover"
            />
          </div>

          {/* Details Grid */}
          <InfoGrid items={DEFAULT_INFO_ITEMS} />
        </div>

        {/* Sidebar Cards (Account Status) */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h4 className="mb-6 flex items-center gap-2 font-bold text-white">
              <Info size={18} className="text-primary" />
              Estado de Cuenta
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/50 py-2">
                <span className="text-sm text-zinc-500">Vencimiento</span>
                <span className="text-sm font-bold text-white">12 Oct 2024</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-800/50 py-2">
                <span className="text-sm text-zinc-500">Saldo Pendiente</span>
                <span className="text-sm font-black text-red-400">$0.00</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-500">Último Pago</span>
                <span className="text-sm font-bold text-emerald-400">10 Sep 2024</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h4 className="mb-4 font-bold text-white">Notas Internas</h4>
            <p className="text-xs leading-relaxed text-zinc-500 italic">
              &quot;El cliente prefiere visitas técnicas por la mañana antes de las 11:00 AM. El
              router está ubicado detrás del mostrador principal.&quot;
            </p>
          </div>
        </div>
        {/* Actions Section */}
        <div className="flex flex-col gap-4 pt-4">
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 py-4 text-[#25D366] transition-all hover:bg-zinc-700 active:scale-[0.98]">
            <MessageCircle size={24} fill="currentColor" />
            <span className="font-bold">Contactar por WhatsApp</span>
          </button>

          <button className="bg-primary hover:bg-primary/90 shadow-primary/20 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-white shadow-lg transition-all active:scale-[0.98]">
            <RefreshCw size={20} className="font-bold" />
            <span className="font-bold">Renovar Suscripción</span>
          </button>

          <button
            onClick={() => {
              if (confirm('¿Estás seguro que deseas desactivar este cliente?')) {
                toast.success('Cliente desactivado con éxito');
                router.push('/dashboard');
              }
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 py-4 text-red-500 transition-all hover:bg-red-500/20 active:scale-[0.98]"
          >
            <Trash2 size={20} />
            <span className="font-bold">Desactivar Cliente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
