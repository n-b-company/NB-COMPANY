'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Modulares de UI
import InfoGrid from '@/components/ui/InfoGrid';
import { DEFAULT_INFO_ITEMS } from '@/constants/mockData';

// Componentes específicos de Cliente
import ClientHeader from '@/components/cliente/ClientHeader';
import ClientTabs from '@/components/cliente/ClientTabs';
import ClientImage from '@/components/cliente/ClientImage';
import AccountSummary from '@/components/cliente/AccountSummary';
import ClientHistory from '@/components/cliente/ClientHistory';
import ClientLocation from '@/components/cliente/ClientLocation';
import ClientActions from '@/components/cliente/ClientActions';

export default function DetalleClientePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Información');

  const tabs = ['Información', 'Ubicación', 'Historial'];

  // Handlers para acciones
  const handleRenew = () => {
    toast.success('Iniciando proceso de renovación...');
    router.push('/comprobante');
  };

  const handleDeactivate = () => {
    if (confirm('¿Estás seguro que deseas desactivar este cliente?')) {
      toast.success('Cliente desactivado con éxito');
      router.push('/dashboard');
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/123456789', '_blank');
  };

  return (
    <div className="flex flex-col pb-40">
      {/* Header Modular */}
      <ClientHeader
        name="Kiosco El Trébol"
        id="#CL-98234"
        statusText="Cliente Activo desde Enero 2024"
        onBack={() => router.back()}
      />

      {/* Tabs Modulares */}
      <ClientTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-8 px-6 pt-8">
        {/* Contenido según Tab Activa */}
        {activeTab === 'Información' && (
          <>
            <div className="flex flex-col gap-8">
              <ClientImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbNut0J06ooxmOExAol24WE5WNkYwrMHgY1w7ykz26XZ14VduBTZTYL5oQNtYXa3OeTLafG-CKoeeZm0LVh2fcQHQDQqE3aq2ULKwsJVQXRHSiA6Sf9mN8-lYgFd1E0_ZnVujQBWejZF2_odoSu6qM5kDkomR1IuD6q2YMSILb2_S6VKlSbl2GF0SmOlM6fkahfAczxatsLCT9WMQ9Yk9eqCCu7U0QazQuAKpht3DGMJNv6BmBguk8bOeUP5jHgLzaJDl03WO69Os"
                alt="Fachada Kiosco El Trébol"
              />
              <InfoGrid items={DEFAULT_INFO_ITEMS} />
            </div>

            <AccountSummary
              vencimiento="12 Oct 2024"
              saldoPendiente="$0.00"
              ultimoPago="10 Sep 2024"
              notas="El cliente prefiere visitas técnicas por la mañana antes de las 11:00 AM. El router está ubicado detrás del mostrador principal."
            />
          </>
        )}

        {activeTab === 'Ubicación' && <ClientLocation />}
        {activeTab === 'Historial' && <ClientHistory />}

        {/* Acciones Modulares */}
        <ClientActions
          onWhatsApp={handleWhatsApp}
          onRenew={handleRenew}
          onDeactivate={handleDeactivate}
        />
      </div>
    </div>
  );
}
