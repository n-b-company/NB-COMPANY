'use server';

import prisma from '@/lib/prisma';
import { logout as authLogout } from '@/lib/auth';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
  await authLogout();
  redirect('/login');
}

export async function createClientWithInstallation(data: InstalacionFormValues) {
  try {
    // Validar datos en el servidor
    const validatedData = instalacionSchema.parse(data);

    // Ejecutar transacción para asegurar integridad (Cliente + Instalación)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el Cliente
      const client = await tx.client.create({
        data: {
          name: validatedData.nombre,
          ownerName: validatedData.propietario,
          address: validatedData.direccion,
          between: validatedData.entre_calles,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          imageUrl: validatedData.image_url,
          notes: validatedData.notas,
        },
      });

      // 2. Crear la Instalación vinculada al cliente
      const installation = await tx.installation.create({
        data: {
          clientId: client.id,
          equipmentCount: validatedData.cantidad_equipos,
          ipPort: validatedData.ip_puerto,
          techNotes: validatedData.notas, // O alguna nota específica técnica
          installedAt: new Date(validatedData.fecha_instalacion),
        },
      });

      return { client, installation };
    });

    // Revalidar las rutas que listan clientes
    revalidatePath('/clientes');
    revalidatePath('/dashboard');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al crear cliente e instalación:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Ocurrió un error inesperado al guardar los datos.' };
  }
}
