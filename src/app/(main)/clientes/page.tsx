import prisma from '@/lib/prisma';
import ClientesClient from '@/components/ClientesClient';

export default async function ClientesPage() {
  // Fetch real clients from database on the server
  const clients = await prisma.client.findMany({
    include: {
      installations: true,
      payments: true,
    },
    orderBy: { name: 'asc' },
  });

  return <ClientesClient initialClients={clients} />;
}
