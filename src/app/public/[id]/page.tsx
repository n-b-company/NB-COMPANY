import React from 'react';
import prisma from '@/lib/prisma';
import { verifyShareToken } from '@/lib/share-token';
import PublicClientView from '@/components/public/PublicClientView';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PublicClientPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  // Verificar que haya token
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-white">Link Inválido</h1>
          <p className="text-zinc-400">
            Este link no tiene un token de acceso válido. Por favor contacta con el administrador.
          </p>
        </div>
      </div>
    );
  }

  // Verificar token
  const verification = await verifyShareToken(token);

  if (!verification.valid) {
    if (verification.expired) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-black text-red-500">Link Expirado</h1>
            <p className="text-zinc-400">
              Este link ha expirado. Por favor contacta con el administrador para obtener un nuevo
              link.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-white">Error de Acceso</h1>
          <p className="text-zinc-400">
            {verification.error || 'Hubo un error al verificar el acceso.'}
          </p>
        </div>
      </div>
    );
  }

  // Verificar que el clientId del token coincida con el de la URL
  if (verification.clientId !== id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-white">Link Inválido</h1>
          <p className="text-zinc-400">El link no corresponde al cliente solicitado.</p>
        </div>
      </div>
    );
  }

  // Obtener datos del cliente
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      installations: {
        orderBy: { installedAt: 'desc' },
      },
    },
  });

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-white">Cliente No Encontrado</h1>
          <p className="text-zinc-400">El cliente que buscas no existe o fue eliminado.</p>
        </div>
      </div>
    );
  }

  return <PublicClientView client={client} />;
}
