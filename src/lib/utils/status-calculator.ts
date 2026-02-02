import { ClientStatus } from '@prisma/client';
import { Client } from '@/types';

export interface StatusResult {
  status: ClientStatus;
  daysUntilExpiration: number;
}

/**
 * Calculates the dynamic status of a client based on their last payment or installation date.
 */
export function calculateDynamicStatus(client: Client): StatusResult {
  // 1. If manually marked as INACTIVE, that takes precedence
  if (client.status === 'INACTIVE')
    return { status: ClientStatus.INACTIVE, daysUntilExpiration: 0 };

  // 2. Get base date (last paid renewal or installation date)
  const payments = client.payments || [];
  const installations = client.installations || [];

  const lastPaidPayment = [...payments]
    .filter((p) => p.status === 'PAID' && p.period)
    .sort((a, b) => (b.period?.getTime() || 0) - (a.period?.getTime() || 0))[0];

  const baseDate = lastPaidPayment?.period
    ? new Date(lastPaidPayment.period)
    : installations[0]?.installedAt
      ? new Date(installations[0].installedAt)
      : new Date(client.createdAt);

  // Expiration is exactly 1 month after the base date
  const expirationDate = new Date(baseDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationClean = new Date(expirationDate);
  expirationClean.setHours(0, 0, 0, 0);

  const diffTime = expirationClean.getTime() - today.getTime();
  const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 3. Apply business logic
  if (daysUntilExpiration < 0) {
    return { status: ClientStatus.OVERDUE, daysUntilExpiration }; // Overdue
  } else if (daysUntilExpiration <= 5) {
    return { status: ClientStatus.WARNING, daysUntilExpiration }; // Warning (5 days or less)
  }

  return { status: ClientStatus.ACTIVE, daysUntilExpiration }; // Active (Up to date)
}

/**
 * Returns counts of clients in each status
 */
export function getStatusCounts(clients: Client[]) {
  const counts = {
    ACTIVE: 0,
    WARNING: 0,
    OVERDUE: 0,
    INACTIVE: 0,
  };

  clients.forEach((client) => {
    const result = calculateDynamicStatus(client);
    counts[result.status]++;
  });

  return counts;
}
