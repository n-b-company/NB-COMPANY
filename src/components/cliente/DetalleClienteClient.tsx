'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Phone, Router as RouterIcon } from 'lucide-react';

// Modulares de UI
import InfoGrid from '@/components/ui/InfoGrid';

// Componentes específicos de Cliente
import ClientHeader from '@/components/cliente/ClientHeader';
import ClientTabs from '@/components/cliente/ClientTabs';
import ClientImage from '@/components/cliente/ClientImage';
import AccountSummary from '@/components/cliente/AccountSummary';
import ClientHistory from '@/components/cliente/ClientHistory';
import ClientLocation from '@/components/cliente/ClientLocation';
import ClientActions from '@/components/cliente/ClientActions';
import ClientConfig from '@/components/cliente/ClientConfig';
import { toggleClientStatus } from '@/lib/actions';

import { Client, InfoItem, Installation, Payment } from '@/types';
import { STATUS_TEXT_MAP } from '@/constants/constants';
import { calculateDynamicStatus } from '@/lib/utils/status-calculator';

interface DetalleClienteClientProps {
  client:
    | (Client & {
        installations: Installation[];
        payments: Payment[];
      })
    | null;
}

export default function DetalleClienteClient({ client }: DetalleClienteClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Información');

  const { status, daysUntilExpiration } = client
    ? calculateDynamicStatus(client)
    : { status: 'ACTIVE', daysUntilExpiration: 30 };

  const tabs = ['Información', 'Ubicación', 'Historial', 'Configuración'];

  if (!client) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <h2 className="text-xl font-bold text-white">Cliente no encontrado</h2>
        <p className="mt-2 text-zinc-500">El cliente que buscas no existe o fue eliminado.</p>
        <button
          onClick={() => router.push('/clientes')}
          className="bg-primary mt-6 rounded-xl px-6 py-2.5 font-bold text-white"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  // Handlers para acciones
  const handleRenew = () => {
    toast.success('Iniciando proceso de renovación...');
    router.push('/comprobante');
  };

  const handleDeactivate = async () => {
    const isActivating = client.status === 'INACTIVE';
    const msg = isActivating
      ? '¿Estás seguro que deseas activar este cliente?'
      : '¿Estás seguro que deseas desactivar este cliente?';

    if (confirm(msg)) {
      const result = await toggleClientStatus(client.id, client.status);
      if (result.success) {
        toast.success(
          isActivating ? 'Cliente activado con éxito' : 'Cliente desactivado con éxito',
        );
        if (!isActivating) router.push('/dashboard');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleWhatsApp = () => {
    if (client.phone) {
      window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`, '_blank');
    } else {
      toast.error('Este cliente no tiene un teléfono registrado');
    }
  };

  // Preparar InfoGrid Items
  const infoItems: InfoItem[] = [
    {
      label: 'Teléfono',
      value: client.phone || 'No registrado',
      subValue: `Contacto: ${client.ownerName || 'Desconocido'}`,
      icon: Phone,
    },
    {
      label: 'Infraestructura',
      value: 'Alquiler de POSNET',
      subValue: `${client.installations[0]?.equipmentCount || 1} Terminales instaladas`,
      icon: RouterIcon,
    },
  ];

  // --- Lógica de Estado de Cuenta Corregida ---

  // 1. Encontrar el último pago cobrado
  const lastPayment = [...client.payments]
    .filter((p) => p.status === 'PAID')
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime(),
    )[0];

  // 2. Pagos pendientes (los que aún no se cobraron)
  const pendingPayments = client.payments.filter((p) => p.status === 'PENDING');
  const saldoTotal = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const formatDate = (date: Date | null | string) => {
    if (!date) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  // 3. Lógica Pro: Si status es OVERDUE, el "Vencimiento" es la fecha base que ya pasó.
  // Si está al día, el "Vencimiento" es "Al día".
  let vencimientoLabel = 'Al día';
  if (status === 'OVERDUE') {
    // Buscar la fecha que causó el vencimiento (1 mes después del último periodo o instalación)
    const baseDateForVenc =
      lastPayment?.period || client.installations[0]?.installedAt || client.createdAt;
    const vDate = new Date(baseDateForVenc);
    vDate.setMonth(vDate.getMonth() + 1);
    vencimientoLabel = formatDate(vDate);
  } else if (pendingPayments.length > 0) {
    vencimientoLabel = formatDate(pendingPayments[0].period || pendingPayments[0].createdAt);
  }

  const ultimoPagoText = lastPayment
    ? `${formatDate(lastPayment.paidAt || lastPayment.createdAt)} ($${lastPayment.amount.toLocaleString()})`
    : 'Sin pagos registrados';

  // 4. Próximo Vencimiento (Siempre es la fecha de la siguiente renovación estimada)
  const baseDateForNext =
    lastPayment?.period || client.installations[0]?.installedAt || client.createdAt;
  const nextRenovDate = new Date(baseDateForNext);
  nextRenovDate.setMonth(nextRenovDate.getMonth() + 1);
  const proximoVencimientoText = formatDate(nextRenovDate);

  // Status Text dinámico para el Header
  let dynamicStatusText = STATUS_TEXT_MAP[status] || 'ACTIVO';
  if (status === 'WARNING') {
    dynamicStatusText = `VENCE EN ${daysUntilExpiration} DÍAS`;
    if (daysUntilExpiration === 0) dynamicStatusText = 'VENCE HOY';
    if (daysUntilExpiration === 1) dynamicStatusText = 'VENCE MAÑANA';
  }

  return (
    <div className="flex flex-col pb-40">
      <ClientHeader
        name={client.name}
        id={`#${client.id.substring(client.id.length - 8).toUpperCase()}`}
        statusText={dynamicStatusText}
        onBack={() => router.back()}
      />

      <ClientTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-8 px-6 pt-8">
        {activeTab === 'Información' && (
          <>
            <div className="flex flex-col gap-8">
              {client.imageUrl && (
                <ClientImage src={client.imageUrl} alt={`Fachada ${client.name}`} />
              )}
              <InfoGrid items={infoItems} />
            </div>

            <AccountSummary
              vencimiento={vencimientoLabel}
              proximoVencimiento={proximoVencimientoText}
              saldoPendiente={`$${saldoTotal.toLocaleString()}`}
              ultimoPago={ultimoPagoText}
              notas={client.notes || 'Sin notas u observaciones adicionales.'}
            />
          </>
        )}

        {activeTab === 'Configuración' && (
          <ClientConfig client={client} onSuccess={() => setActiveTab('Información')} />
        )}

        {activeTab === 'Ubicación' && (
          <ClientLocation
            latitude={client.latitude || undefined}
            longitude={client.longitude || undefined}
            address={client.address}
            between={client.between || undefined}
          />
        )}

        {activeTab === 'Historial' && <ClientHistory payments={client.payments} />}

        {activeTab !== 'Configuración' && (
          <ClientActions
            onWhatsApp={handleWhatsApp}
            onRenew={handleRenew}
            onDeactivate={handleDeactivate}
            isInactive={status === 'INACTIVE'}
          />
        )}
      </div>
    </div>
  );
}
