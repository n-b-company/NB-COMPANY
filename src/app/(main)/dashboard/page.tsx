'use client';

import { useRouter } from 'next/navigation';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { CLIENTES_MOCK } from '@/constants/mockData';
import EntityCard, { StatusVariant } from '@/components/ui/EntityCard'; // Added import for EntityCard

export default function DashboardPage() {
  const router = useRouter();

  // We only show the first 10 for "Críticos" in the home
  const top10Clientes = CLIENTES_MOCK.filter((c) => c.status !== 'inactive').slice(0, 10);

  return (
    <div className="my-4 px-6 py-8">
      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="group hover:border-primary/50 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Activos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Package size={18} />
            </div>
          </div>
          <p className="text-3xl leading-none font-black text-white">
            {CLIENTES_MOCK.filter((c) => c.status === 'success' || c.status === 'warning').length}
          </p>
        </div>

        <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-amber-500/50">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Vencer</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-3xl leading-none font-black text-amber-500">
            {CLIENTES_MOCK.filter((c) => c.status === 'warning' || c.status === 'danger').length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="group mb-8">
        <div className="relative flex w-full items-center transition-all duration-300">
          <div className="group-focus-within:text-primary absolute left-4 text-zinc-500 transition-colors">
            <Plus size={18} />
          </div>
          <input
            type="text"
            onClick={() => router.push('/clientes')}
            placeholder="Buscar cliente o comercio..."
            className="ring-primary/20 focus:border-primary w-full cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pr-4 pl-12 text-sm text-white shadow-inner transition-all outline-none placeholder:text-zinc-600 focus:ring-4"
            readOnly
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg font-bold tracking-tight text-white">Vencimientos Críticos</h3>
        <button
          onClick={() => router.push('/clientes')}
          className="text-primary text-xs font-bold tracking-wider uppercase hover:underline"
        >
          Ver todos
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {top10Clientes.map((item) => (
          <EntityCard
            key={item.id}
            title={item.name}
            subtitle={item.address}
            icon={item.Icon}
            statusText={item.statusText}
            statusVariant={item.status as StatusVariant}
            actionHref={`/cliente/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
