'use client';

import React, { useState } from 'react';
import { ReceiptText, Receipt, CreditCard, Calendar } from 'lucide-react';
import { CLIENTES_MOCK, COBROS_FILTER_OPTIONS } from '@/constants/mockData';
import Pagination from '@/components/ui/Pagination';
import EntityCard from '@/components/ui/EntityCard';
import { StatusVariant } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import FilterGroup from '@/components/ui/FilterGroup';

const ITEMS_PER_PAGE = 10;

// Transformamos los clientes en datos de pago realistas para el MOCK
const PAGOS_MOCK = CLIENTES_MOCK.map((cliente, idx) => {
  const statusValues: { [key: string]: { variant: StatusVariant; text: string } } = {
    success: { variant: 'success', text: 'Pagado' },
    warning: { variant: 'warning', text: 'Pendiente' },
    danger: { variant: 'danger', text: 'Rechazado' },
    inactive: { variant: 'inactive', text: 'Anulado' },
  };

  const statusInfo = statusValues[cliente.status] || statusValues.success;

  return {
    id: `TR-${idx + 1000}`,
    cliente: cliente.name,
    monto: (Math.random() * 50000 + 15000).toLocaleString('es-AR', { minimumFractionDigits: 0 }),
    fecha: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    metodo: Math.random() > 0.5 ? 'Efectivo' : 'Transferencia',
    status: statusInfo.variant,
    statusText: statusInfo.text,
  };
});

export default function CobrosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPagos = PAGOS_MOCK.filter((pago) => {
    const matchesSearch =
      pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pago.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredPagos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPagos = filteredPagos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            Historial de Transacciones
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Total Mes
          </p>
          <h3 className="text-2xl font-black text-white">$ 1.250.000</h3>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
            Pendiente
          </p>
          <h3 className="text-primary text-2xl font-black">$ 85.400</h3>
        </div>
      </div>

      {/* Search Bar & Filters Modular */}
      <div className="flex flex-col gap-4">
        <SearchBar
          placeholder="Buscar por cliente o ID de cobro..."
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
        <FilterGroup
          options={COBROS_FILTER_OPTIONS}
          activeFilter={filterStatus}
          onFilterChange={(id) => {
            setFilterStatus(id);
            setCurrentPage(1);
          }}
          label="Estado:"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {paginatedPagos.map((pago, idx) => (
          <EntityCard
            key={idx}
            icon={Receipt}
            title={pago.cliente}
            subtitle={pago.id}
            amount={`$ ${pago.monto}`}
            statusText={pago.statusText}
            statusVariant={pago.status as StatusVariant}
            metadata={[
              { icon: Calendar, text: pago.fecha },
              { icon: CreditCard, text: pago.metodo },
            ]}
            actionHref="/comprobante"
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
