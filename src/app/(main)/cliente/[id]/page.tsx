import React from 'react';
import prisma from '@/lib/prisma';
import DetalleClienteClient from '@/components/cliente/DetalleClienteClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleClientePage({ params }: PageProps) {
  const { id } = await params;

  // Fetch client with related installations and payments
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      installations: {
        orderBy: { installedAt: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return <DetalleClienteClient client={client} />;
}
