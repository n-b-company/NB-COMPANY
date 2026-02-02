'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { ReceiptText, TrendingUp, Calendar } from 'lucide-react';
import { STATUS_TEXT_MAP } from '@/constants/constants';
import { Client } from '@/types';
import { calculateDynamicStatus } from '@/lib/utils/status-calculator';

interface CobrosClientProps {
  initialClients: Client[];
}

export default function CobrosClient({ initialClients }: CobrosClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Financial Stats
  const stats = useMemo(() => {
    let totalProjected = 0;

    initialClients.forEach((client) => {
      if (client.status !== 'INACTIVE') {
        const units = client.installations?.[0]?.equipmentCount || 1;
        totalProjected += (client.serviceCost || 0) * units;
      }
    });

    return {
      totalProjected,
    };
  }, [initialClients]);

  const filteredClients = useMemo(() => {
    let result = initialClients.map((c) => {
      const { status, daysUntilExpiration } = calculateDynamicStatus(c);

      let dynamicText = STATUS_TEXT_MAP[status] || 'ACTIVO';
      if (status === 'WARNING') {
        dynamicText = `VENCE EN ${daysUntilExpiration} DÍAS`;
      }

      const units = c.installations?.[0]?.equipmentCount || 1;
      const cost = (c.serviceCost || 0) * units;

      return {
        ...c,
        dynamicStatus: status,
        dynamicText,
        cost,
      };
    });

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowSearch) || c.address.toLowerCase().includes(lowSearch),
      );
    }

    return result;
  }, [searchTerm, initialClients]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl border">
          <ReceiptText size={24} />
        </div>
        <div>
          <h1 className="text-2xl leading-tight font-black text-white">Cobros</h1>
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Gestión de Cobranzas
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp size={20} />
          </div>
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Recaudación Proyectada
          </p>
          <h3 className="text-2xl font-black text-white">{formatCurrency(stats.totalProjected)}</h3>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
            <Calendar size={20} />
          </div>
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Total Clientes Activos
          </p>
          <h3 className="text-2xl font-black text-white">
            {initialClients.filter((c) => c.status !== 'INACTIVE').length}
          </h3>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Filtrar por comercio..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Detailed List */}
      <div className="flex flex-col gap-4">
        <h3 className="px-1 text-sm font-bold tracking-tighter text-zinc-400 uppercase">
          Lista de Cobranzas
        </h3>
        <div className="flex flex-col gap-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="group-hover:border-primary/30 group-hover:text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition-colors">
                    <ReceiptText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{client.name}</h4>
                    <p className="text-xs text-zinc-500">{client.address}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                          client.dynamicStatus === 'ACTIVE'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                            : client.dynamicStatus === 'WARNING'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                              : 'border-red-500/20 bg-red-500/10 text-red-500'
                        }`}
                      >
                        {client.dynamicText}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{formatCurrency(client.cost)}</p>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    A cobrar
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
