import React from 'react';
import { Calendar, Receipt } from 'lucide-react';
import EntityCard from '@/components/ui/EntityCard';

import { Payment } from '@/types';

interface ClientHistoryProps {
  payments?: Payment[];
  clientName: string;
  clientPhone: string;
}

export default function ClientHistory({
  payments = [],
  clientName,
  clientPhone,
}: ClientHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-zinc-500 italic">No hay historial de pagos registrado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {payments.map((payment, idx) => {
        const getTicketHref = () => {
          if (payment.status !== 'PAID') return undefined;

          const params = new URLSearchParams({
            id: `#${payment.id.substring(payment.id.length - 8).toUpperCase()}`,
            empresa: clientName,
            monto: `ARS $ ${payment.amount.toLocaleString()}`,
            vencimiento: payment.period
              ? new Intl.DateTimeFormat('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(
                  new Date(
                    new Date(payment.period).setMonth(new Date(payment.period).getMonth() + 1),
                  ),
                )
              : '-- --- ----',
            fecha: payment.paidAt
              ? new Intl.DateTimeFormat('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(payment.paidAt))
              : '',
            telefono: clientPhone,
          });
          return `/comprobante?${params.toString()}`;
        };

        return (
          <EntityCard
            key={payment.id || idx}
            headerLabel={
              payment.paidAt
                ? new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(
                    new Date(payment.paidAt),
                  )
                : 'Pendiente'
            }
            icon={Receipt}
            title={payment.description || 'Renovación de Suscripción'}
            subtitle="Cobro de Servicio"
            amount={`${payment.currency} $${payment.amount.toLocaleString()}`}
            statusText={payment.status === 'PAID' ? 'COBRADO' : 'PENDIENTE'}
            statusVariant={payment.status === 'PAID' ? 'success' : 'warning'}
            metadata={[
              {
                icon: Calendar,
                text: payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString('es-AR')
                  : 'No pagado',
              },
            ]}
            actionHref={getTicketHref()}
          />
        );
      })}
    </div>
  );
}
