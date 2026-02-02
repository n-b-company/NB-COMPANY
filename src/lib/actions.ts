'use server';

import prisma from '@/lib/prisma';
import { logout as authLogout } from '@/lib/auth';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/upload';

export async function logout() {
  await authLogout();
  redirect('/login');
}

export async function createClientWithInstallation(data: InstalacionFormValues) {
  try {
    // Validar datos en el servidor
    const validatedData = instalacionSchema.parse(data);

    let finalImageUrl: string | null = validatedData.image_url || null;

    // Si tenemos una cadena base64, la subimos a la API
    if (finalImageUrl && finalImageUrl.startsWith('data:image')) {
      const uploadedUrl = await uploadImage(finalImageUrl);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    // 1. Crear el Cliente
    const client = await prisma.client.create({
      data: {
        name: validatedData.nombre,
        ownerName: validatedData.propietario,
        phone: validatedData.telefono,
        address: validatedData.direccion,
        between: validatedData.entre_calles,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        imageUrl: finalImageUrl,
        notes: validatedData.notas,
      },
    });

    // 2. Crear la Instalación vinculada al cliente
    const installation = await prisma.installation.create({
      data: {
        clientId: client.id,
        equipmentCount: validatedData.cantidad_equipos,
        ipPort: validatedData.ip_puerto,
        techNotes: validatedData.notas,
        installedAt: new Date(validatedData.fecha_instalacion),
      },
    });

    // Revalidar las rutas que listan clientes
    revalidatePath('/clientes');
    revalidatePath('/dashboard');

    return { success: true, data: { client, installation } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: `Error: ${error.message}` };
    }
    return { success: false, error: 'Ocurrió un error inesperado al guardar los datos.' };
  }
}
