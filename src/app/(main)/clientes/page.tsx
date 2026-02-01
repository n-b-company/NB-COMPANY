'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { CLIENTES_MOCK, CLIENT_FILTER_OPTIONS } from '@/constants/mockData';
import Pagination from '@/components/ui/Pagination';
import EntityCard, { StatusVariant } from '@/components/ui/EntityCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterGroup from '@/components/ui/FilterGroup';

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

      {/* Search Bar Modular */}
      <SearchBar
        placeholder="Buscar por nombre o dirección..."
        value={searchTerm}
        onChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        className="mb-6"
      />

      {/* Filters Modular */}
      <FilterGroup
        options={CLIENT_FILTER_OPTIONS}
        activeFilter={filterStatus}
        onFilterChange={(id) => {
          setFilterStatus(id);
          setCurrentPage(1);
        }}
        className="mb-8"
      />

      {/* Client List */}
      <div className="space-y-3">
        {paginatedClientes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {paginatedClientes.map((cliente) => (
              <EntityCard
                key={cliente.id}
                title={cliente.name}
                subtitle={cliente.address}
                icon={cliente.Icon}
                statusText={cliente.statusText}
                statusVariant={cliente.status as StatusVariant}
                actionHref={`/cliente/${cliente.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-500 italic">
              No se encontraron clientes con esos filtros.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
