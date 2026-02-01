'use client';

import React from 'react';
import { Plus, Package, AlertTriangle, Stethoscope, Store, Utensils, Fuel } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 my-4">
      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="group hover:border-primary/50 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Activos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Package size={18} />
            </div>
          </div>
          <p className="text-3xl leading-none font-black text-white">124</p>
        </div>

        <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-amber-500/50">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase">Vencer</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-3xl leading-none font-black text-amber-500">8</p>
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
            placeholder="Buscar cliente o comercio..."
            className="ring-primary/20 focus:border-primary w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pr-4 pl-12 text-sm text-white shadow-inner transition-all outline-none placeholder:text-zinc-600 focus:ring-4"
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg font-bold tracking-tight text-white">Vencimientos Críticos</h3>
        <button className="text-primary text-xs font-bold tracking-wider uppercase hover:underline">
          Ver todos
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {[
          {
            name: 'Farmacia Central',
            address: 'Av. Principal 123',
            status: 'warning',
            text: 'Vence en 3 días',
            Icon: Stethoscope,
          },
          {
            name: 'Tienda Don Juan',
            address: 'Calle Luna 45',
            status: 'danger',
            text: 'VENCIDO',
            Icon: Store,
          },
          {
            name: 'Restaurante El Faro',
            address: 'Malecón Sur KM 4',
            status: 'success',
            text: 'Al día',
            Icon: Utensils,
          },
          {
            name: 'Estación de Servicio',
            address: 'Ruta 5, KM 120',
            status: 'warning',
            text: 'Vence en 3 días',
            Icon: Fuel,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:bg-zinc-800/50 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="group-hover:text-primary group-hover:border-primary flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors">
                <item.Icon size={24} />
              </div>
              <div>
                <h4 className="group-hover:text-primary font-bold text-white transition-colors">
                  {item.name}
                </h4>
                <p className="text-[10px] font-medium text-zinc-500 uppercase">{item.address}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-[9px] font-black tracking-tighter uppercase ${
                  item.status === 'warning'
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                    : item.status === 'danger'
                      ? 'border-red-500/20 bg-red-500/10 text-red-500'
                      : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
