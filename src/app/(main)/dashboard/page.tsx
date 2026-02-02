import prisma from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  // Fetch real clients from database on the server
  const clients = await prisma.client.findMany({
    include: {
      installations: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <DashboardClient initialClients={clients} />;
}
