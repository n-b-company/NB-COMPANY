'use client';

import { useState, useMemo } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import EntityCard from '@/components/ui/EntityCard';
import StatsGrid from '@/components/ui/StatsGrid';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { STATUS_MAP, STATUS_TEXT_MAP } from '@/constants/constants';
import { Client } from '@/types';

interface DashboardClientProps {
  initialClients: Client[];
}

export default function DashboardClient({ initialClients }: DashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Calculate stats based on initial data
  const stats = useMemo(() => {
    return {
      active: initialClients.filter((c) => c.status === 'ACTIVE').length,
      warning: initialClients.filter((c) => c.status === 'WARNING').length,
      overdue: initialClients.filter((c) => c.status === 'OVERDUE').length,
    };
  }, [initialClients]);

  // Filter clients based on search term and status
  const filteredClients = useMemo(() => {
    let result = initialClients;

    // Filter by status if one is active
    if (filterStatus) {
      result = result.filter((c) => c.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowSearch) || c.address.toLowerCase().includes(lowSearch),
      );
    }

    return result.slice(0, 10);
  }, [searchTerm, filterStatus, initialClients]);

  return (
    <div className="my-4 px-6 py-8">
      {/* KPI Cards */}
      <StatsGrid
        active={stats.active}
        warning={stats.warning}
        overdue={stats.overdue}
        activeStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          placeholder="Buscar por nombre o dirección..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg font-bold tracking-tight text-white">
          {searchTerm ? 'Resultados de búsqueda' : 'Últimas Instalaciones'}
        </h3>
        <Link
          href="/clientes"
          className="text-primary text-xs font-bold tracking-wider uppercase hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {/* List Items from filtered data */}
      <div className="flex flex-col gap-3">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <EntityCard
              key={client.id}
              title={client.name}
              subtitle={client.address}
              imageUrl={client.imageUrl || undefined}
              icon={Store}
              statusText={STATUS_TEXT_MAP[client.status] || 'ACTIVO'}
              statusVariant={STATUS_MAP[client.status] || 'success'}
              actionHref={`/cliente/${client.id}`}
            />
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-zinc-500 italic">
              No se encontraron clientes que coincidan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
