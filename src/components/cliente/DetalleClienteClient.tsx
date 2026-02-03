'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Phone, Router as RouterIcon, MapPin } from 'lucide-react';

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
import { toggleClientStatus, renewSubscription } from '@/lib/actions';

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
  const handleRenew = async () => {
    toast.loading('Procesando renovación...');

    // 1. Calcular el monto total (Costo Unitario x Cantidad de Equipos)
    const equipmentCount = client.installations[0]?.equipmentCount || 1;
    const totalAmount = (client.serviceCost || 0) * equipmentCount;

    // 2. Llamar a la acción del servidor para registrar el pago
    const result = await renewSubscription(client.id, totalAmount);

    if (result.success) {
      toast.dismiss();
      toast.success('Suscripción renovada con éxito');

      const params = new URLSearchParams({
        id: `#${client.id.substring(client.id.length - 8).toUpperCase()}`,
        empresa: client.name,
        monto: `ARS $ ${totalAmount.toLocaleString() || '0'}`,
        vencimiento: proximoVencimientoText,
        telefono: client.phone || '',
        terminales: String(equipmentCount),
      });
      router.push(`/comprobante?${params.toString()}`);
    } else {
      toast.dismiss();
      toast.error(result.error || 'Error al renovar');
    }
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

  // Preparar lista de Lg's
  const ipPorts = client.installations[0]?.ipPorts || [];
  const terminalList = ipPorts.length > 0 ? ipPorts.map((ip) => `• Lg: ${ip}`).join('\n') : '';

  const infrastructureSubValue = `${client.installations[0]?.equipmentCount || 1} Terminales instaladas${terminalList ? `\n${terminalList}` : ''}`;

  // Preparar InfoGrid Items
  const infoItems: InfoItem[] = [
    {
      label: 'Teléfono',
      value: client.phone || 'No registrado',
      subValue: `Contacto: ${client.ownerName || 'Desconocido'}`,
      icon: Phone,
    },
    {
      label: 'Dirección',
      value: client.address,
      subValue: client.between ? `Entre: ${client.between}` : undefined,
      icon: MapPin,
      actionUrl:
        client.latitude && client.longitude
          ? `https://www.google.com/maps/search/?api=1&query=${client.latitude},${client.longitude}`
          : undefined,
      actionLabel: 'Ver en Mapa',
    },
    {
      label: 'Infraestructura',
      value: 'Alquiler de POSNET',
      subValue: infrastructureSubValue,
      icon: RouterIcon,
    },
  ];

  // 1. Encontrar el último pago cobrado
  const lastPayment = [...client.payments]
    .filter((p) => p.status === 'PAID')
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime(),
    )[0];

  // 2. Pagos pendientes (los que aún no se cobraron)
  const pendingPayments = client.payments.filter((p) => p.status === 'PENDING');
  const dbPendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  // Calcular costo mensual
  const equipmentCount = client.installations[0]?.equipmentCount || 1;
  const monthlyCost = (client.serviceCost || 0) * equipmentCount;

  let saldoTotal = 0;
  if (status === 'OVERDUE') {
    if (dbPendingAmount > 0) {
      saldoTotal = dbPendingAmount;
    } else {
      // Fallback: Calcular deuda estimada based on days overdue
      // daysUntilExpiration es negativo cuando está vencido
      const monthsOwed = Math.ceil(Math.abs(daysUntilExpiration) / 30);
      saldoTotal = Math.max(1, monthsOwed) * monthlyCost;
    }
  }

  const formatDate = (date: Date | null | string) => {
    if (!date) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

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

  // 4. Próximo Vencimiento
  // Si el cliente está vencido, calculamos la próxima fecha desde hoy.
  // Si está al día, sumamos un mes al último periodo pagado.
  const today = new Date();
  const lastPeriod = lastPayment?.period ? new Date(lastPayment.period) : null;
  const baseDateForNext = status === 'OVERDUE' || !lastPeriod ? today : lastPeriod;

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

  const getBottomPadding = () => {
    if (activeTab === 'Configuración') return 'pb-4';
    if (activeTab === 'Historial') return 'pb-6';
    return 'pb-24';
  };

  return (
    <div className={`flex flex-col ${getBottomPadding()}`}>
      <ClientHeader
        name={client.name}
        id={`#${client.id.substring(client.id.length - 8).toUpperCase()}`}
        statusText={dynamicStatusText}
        onBack={() => router.back()}
      />

      <ClientTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-3 px-6 pt-2">
        {activeTab === 'Información' && (
          <>
            <div className="flex flex-col gap-3">
              <ClientImage src={client.imageUrl || ''} alt={`Fachada ${client.name}`} />
              <InfoGrid items={infoItems} />
            </div>

            <AccountSummary
              vencimiento={vencimientoLabel}
              saldoPendiente={`$${saldoTotal.toLocaleString()}`}
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

        {activeTab === 'Historial' && (
          <ClientHistory
            payments={client.payments}
            clientName={client.name}
            clientPhone={client.phone || ''}
          />
        )}

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
