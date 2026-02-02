import prisma from '@/lib/prisma';
import CobrosClient from '@/components/CobrosClient';

export default async function CobrosPage() {
  const clients = await prisma.client.findMany({
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      installations: true,
    },
    orderBy: { name: 'asc' },
  });

  return <CobrosClient initialClients={clients} />;
}
