import React from 'react';
import { Calendar, Receipt } from 'lucide-react';
import EntityCard from '@/components/ui/EntityCard';

const HISTORY_MOCK = [
  { month: 'Mayo 2024', date: '15 de Mayo, 2024', amount: 'ARS $12.500', status: 'Cobrado' },
  { month: 'Abril 2024', date: '12 de Abril, 2024', amount: 'ARS $12.500', status: 'Cobrado' },
  { month: 'Marzo 2024', date: '10 de Marzo, 2024', amount: 'ARS $11.000', status: 'Cobrado' },
];

export default function ClientHistory() {
  return (
    <div className="flex flex-col gap-4">
      {HISTORY_MOCK.map((item, idx) => (
        <EntityCard
          key={idx}
          headerLabel={item.month}
          icon={Receipt}
          title="Renovación de Suscripción"
          subtitle="Plan Mensual Estándar"
          amount={item.amount}
          statusText={item.status}
          statusVariant="success"
          metadata={[{ icon: Calendar, text: item.date }]}
          actionHref="/comprobante"
        />
      ))}
    </div>
  );
}
