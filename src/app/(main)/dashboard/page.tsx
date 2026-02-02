import prisma from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  // Fetch real clients from database on the server
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Pass data to the Client Component for interactivity
  return <DashboardClient initialClients={clients} />;
}
