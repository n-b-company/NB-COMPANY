'use client';

import { useState, useMemo } from 'react';
import { Users, Store, Clock } from 'lucide-react';
import { CLIENT_FILTER_OPTIONS } from '@/constants/mockData';
import Pagination from '@/components/ui/Pagination';
import EntityCard from '@/components/ui/EntityCard';
import { Client } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import FilterGroup from '@/components/ui/FilterGroup';
import { STATUS_MAP, STATUS_TEXT_MAP } from '@/constants/constants';
import { calculateDynamicStatus } from '@/lib/utils/status-calculator';

const ITEMS_PER_PAGE = 10;

interface ClientesClientProps {
  initialClients: Client[];
}

export default function ClientesClient({ initialClients }: ClientesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Procesar y Ordenar por prioridad de vencimiento
  const clientsWithStatus = useMemo(() => {
    const processed = initialClients.map((c) => {
      const { status, daysUntilExpiration } = calculateDynamicStatus(c);

      let dynamicText = STATUS_TEXT_MAP[status] || 'ACTIVO';
      if (status === 'WARNING') {
        dynamicText = `VENCE EN ${daysUntilExpiration} DÍAS`;
        if (daysUntilExpiration === 0) dynamicText = 'VENCE HOY';
        if (daysUntilExpiration === 1) dynamicText = 'VENCE MAÑANA';
      }

      return {
        ...c,
        dynamicStatus: status,
        dynamicText,
        daysUntilExpiration,
      };
    });

    // Orden: Más vencidos arriba, luego próximos a vencer, luego activos, inactivos al final
    return processed.sort((a, b) => {
      if (a.dynamicStatus === 'INACTIVE' && b.dynamicStatus !== 'INACTIVE') return 1;
      if (a.dynamicStatus !== 'INACTIVE' && b.dynamicStatus === 'INACTIVE') return -1;
      return a.daysUntilExpiration - b.daysUntilExpiration;
    });
  }, [initialClients]);

  // 2. Filtrado
  const filteredClientes = useMemo(() => {
    return clientsWithStatus.filter((cliente) => {
      const matchesSearch =
        cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.address.toLowerCase().includes(searchTerm.toLowerCase());

      const variant = STATUS_MAP[cliente.dynamicStatus] || 'inactive';
      const matchesFilter = filterStatus === 'all' || variant === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, clientsWithStatus]);

  // 3. Paginación
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClientes = filteredClientes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="my-4 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Clientes</h1>
            <p className="text-sm text-zinc-500">Gestión de Cobranzas</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 sm:flex">
          <Clock size={14} className="text-amber-500" />
          <span className="text-[10px] font-bold tracking-tighter text-zinc-400 uppercase">
            Orden por Urgencia
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Buscar por nombre o dirección..."
        value={searchTerm}
        onChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        className="mb-6"
      />

      {/* Filters */}
      <FilterGroup
        options={CLIENT_FILTER_OPTIONS}
        activeFilter={filterStatus}
        onFilterChange={(id) => {
          setFilterStatus(id);
          setCurrentPage(1);
        }}
        className="mb-8"
      />

      {/* Listado de Clientes */}
      <div className="flex min-h-[400px] flex-col gap-3">
        {paginatedClientes.length > 0 ? (
          paginatedClientes.map((cliente) => (
            <div key={cliente.id}>
              <EntityCard
                title={cliente.name}
                subtitle={cliente.address}
                imageUrl={cliente.imageUrl || undefined}
                icon={Store}
                statusText={cliente.dynamicText}
                statusVariant={STATUS_MAP[cliente.dynamicStatus] || 'success'}
                actionHref={`/cliente/${cliente.id}`}
              />
            </div>
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
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
