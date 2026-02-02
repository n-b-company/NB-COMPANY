import React from 'react';
import { Calendar, Receipt } from 'lucide-react';
import EntityCard from '@/components/ui/EntityCard';

import { Payment } from '@/types';

interface ClientHistoryProps {
  payments?: Payment[];
}

export default function ClientHistory({ payments = [] }: ClientHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-zinc-500 italic">No hay historial de pagos registrado.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {payments.map((payment, idx) => (
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
          actionHref="/comprobante"
        />
      ))}
    </div>
  );
}
