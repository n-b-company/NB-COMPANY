'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Users, Filter } from 'lucide-react';
import { CLIENTES_MOCK } from '@/constants/mockData';
import Pagination from '@/components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredClientes = CLIENTES_MOCK.filter((cliente) => {
    const matchesSearch =
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cliente.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClientes = filteredClientes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filtering or searching
  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="my-4 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Clientes</h1>
          <p className="text-sm text-zinc-500">Gestión de comercios instalados</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="group mb-6">
        <div className="relative flex w-full items-center transition-all duration-300">
          <div className="group-focus-within:text-primary absolute left-4 text-zinc-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="ring-primary/20 focus:border-primary w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pr-4 pl-12 text-sm text-white shadow-inner transition-all outline-none placeholder:text-zinc-600 focus:ring-4"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="no-scrollbar mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        <div className="mr-2 flex items-center gap-2 text-zinc-500">
          <Filter size={16} />
          <span className="text-xs font-bold tracking-wider uppercase">Filtrar:</span>
        </div>
        {[
          { id: 'all', label: 'Todos' },
          { id: 'success', label: 'Al día' },
          { id: 'warning', label: 'Prox. Vencimiento' },
          { id: 'danger', label: 'Vencido' },
          { id: 'inactive', label: 'Desactivados' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === filter.id
                ? 'bg-primary text-white'
                : 'border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {paginatedClientes.length > 0 ? (
          paginatedClientes.map((cliente) => (
            <Link
              key={cliente.id}
              href={`/cliente/${cliente.id}`}
              className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:bg-zinc-800/50 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="group-hover:text-primary group-hover:border-primary flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 transition-colors">
                  <cliente.Icon size={24} />
                </div>
                <div>
                  <h4 className="group-hover:text-primary font-bold text-white transition-colors">
                    {cliente.name}
                  </h4>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase">
                    {cliente.address}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-[9px] font-black tracking-tighter uppercase ${
                    cliente.status === 'warning'
                      ? 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                      : cliente.status === 'danger'
                        ? 'border-red-500/20 bg-red-500/10 text-red-500'
                        : cliente.status === 'inactive'
                          ? 'border-zinc-500/20 bg-zinc-500/10 text-zinc-500'
                          : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {cliente.statusText}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-500 italic">
              No se encontraron clientes con esos filtros.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
