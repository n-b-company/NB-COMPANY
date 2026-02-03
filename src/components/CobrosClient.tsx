'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { ReceiptText, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { STATUS_TEXT_MAP } from '@/constants/constants';
import { Client } from '@/types';
import { calculateDynamicStatus } from '@/lib/utils/status-calculator';

interface CobrosClientProps {
  initialClients: Client[];
}

type FilterType = 'ALL' | 'PAID' | 'PENDING';

export default function CobrosClient({ initialClients }: CobrosClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('PENDING'); // Default to PENDING as that's the main action

  // Calculate Financial Stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyRevenue = 0; // Money actually collected this month
    let pendingRevenue = 0; // Money yet to be collected (overdue/warning)

    initialClients.forEach((client) => {
      // 1. Calculate Monthly Revenue (Actual Payments)
      if (client.payments) {
        client.payments.forEach((payment) => {
          if (payment.status === 'PAID' && payment.paidAt) {
            const pDate = new Date(payment.paidAt);
            if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
              monthlyRevenue += payment.amount;
            }
          }
        });
      }

      // 2. Calculate Pending Revenue (Based on status)
      // If client needs to pay (Overdue or Warning), add their monthly cost
      if (client.status !== 'INACTIVE') {
        const { status } = calculateDynamicStatus(client);
        if (status === 'OVERDUE' || status === 'WARNING') {
          const units = client.installations?.[0]?.equipmentCount || 1;
          pendingRevenue += (client.serviceCost || 0) * units;
        }
      }
    });

    return {
      monthlyRevenue,
      pendingRevenue,
    };
  }, [initialClients]);

  const filteredClients = useMemo(() => {
    let result = initialClients
      .map((c) => {
        const { status, daysUntilExpiration } = calculateDynamicStatus(c);

        let dynamicText = STATUS_TEXT_MAP[status] || 'ACTIVO';
        if (status === 'WARNING') {
          dynamicText = `VENCE EN ${daysUntilExpiration} DÍAS`;
        }
        if (status === 'ACTIVE') {
          dynamicText = 'AL DÍA';
        }

        const units = c.installations?.[0]?.equipmentCount || 1;
        const cost = (c.serviceCost || 0) * units;

        // Determine general bucket
        const isPending = status === 'OVERDUE' || status === 'WARNING';
        const isPaid = status === 'ACTIVE';

        return {
          ...c,
          dynamicStatus: status,
          dynamicText,
          cost,
          isPending,
          isPaid,
        };
      })
      .filter((c) => c.status !== 'INACTIVE'); // Hide inactive clients from collections

    // Apply Tab Filter
    if (filterType === 'PAID') {
      result = result.filter((c) => c.isPaid);
    } else if (filterType === 'PENDING') {
      result = result.filter((c) => c.isPending);
    }

    // Apply Search
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowSearch) || c.address.toLowerCase().includes(lowSearch),
      );
    }

    // Sort: Overdue first for Pending, Name for others
    return result.sort((a, b) => {
      if (filterType === 'PENDING') {
        // Sort by urgency: Overdue first, then Warning
        if (a.dynamicStatus === 'OVERDUE' && b.dynamicStatus !== 'OVERDUE') return -1;
        if (b.dynamicStatus === 'OVERDUE' && a.dynamicStatus !== 'OVERDUE') return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, initialClients, filterType]);

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
          <h1 className="text-2xl leading-tight font-black text-white">Administración</h1>
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Gestión de Cobranzas
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Recaudación Mensual */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black tracking-wider text-emerald-500 uppercase">
              Este Mes
            </span>
          </div>
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Recaudación Mensual
          </p>
          <h3 className="text-3xl font-black text-white">{formatCurrency(stats.monthlyRevenue)}</h3>
        </div>

        {/* Pendiente de Cobro */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <AlertCircle size={20} />
            </div>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black tracking-wider text-amber-500 uppercase">
              Pendiente
            </span>
          </div>
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            A cobrar
          </p>
          <h3 className="text-3xl font-black text-white">{formatCurrency(stats.pendingRevenue)}</h3>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4">
        <div className="flex rounded-2xl bg-zinc-900/50 p-1">
          <button
            onClick={() => setFilterType('PENDING')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
              filterType === 'PENDING'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            A Cobrar
          </button>
          <button
            onClick={() => setFilterType('PAID')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
              filterType === 'PAID'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Pagados
          </button>
          <button
            onClick={() => setFilterType('ALL')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
              filterType === 'ALL'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Todos
          </button>
        </div>

        <SearchBar placeholder="Buscar cliente..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Detailed List */}
      <div className="flex flex-col gap-4">
        <h3 className="px-1 text-sm font-bold tracking-tighter text-zinc-400 uppercase">
          {filterType === 'PENDING'
            ? 'Pendientes de Pago'
            : filterType === 'PAID'
              ? 'Pagos Recientes'
              : 'Listado Completo'}
        </h3>
        <div className="flex flex-col gap-3">
          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
              <CheckCircle2 size={40} className="mb-2 text-zinc-600" />
              <p className="text-sm font-medium text-zinc-500">No hay clientes en esta lista</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="group-hover:border-primary/30 group-hover:text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition-colors">
                      <ReceiptText size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-bold text-white">{client.name}</h4>
                      <p className="truncate text-xs text-zinc-500">{client.address}</p>
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
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-xl font-black ${client.isPaid ? 'text-zinc-500' : 'text-white'}`}
                    >
                      {formatCurrency(client.cost)}
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      {client.isPaid ? 'Monto fijo' : 'A cobrar'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
