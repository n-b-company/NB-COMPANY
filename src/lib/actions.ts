'use server';

import { ClientStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { logout as authLogout } from '@/lib/auth';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/upload';
import { generateShareToken } from '@/lib/share-token';

export async function logout() {
  await authLogout();
  redirect('/login');
}

export async function createClientWithInstallation(data: InstalacionFormValues) {
  try {
    // Validar datos en el servidor
    const validatedData = instalacionSchema.parse(data);

    let finalImageUrl: string | null = validatedData.image_url || null;
    let finalDniFront: string | null = validatedData.dni_front || null;
    let finalDniBack: string | null = validatedData.dni_back || null;

    // Si tenemos una cadena base64, la subimos a la API
    if (finalImageUrl && finalImageUrl.startsWith('data:image')) {
      const uploadedUrl = await uploadImage(finalImageUrl);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        throw new Error(
          'No se pudo subir la foto del local. Verifica la configuración del servidor.',
        );
      }
    }

    if (finalDniFront && finalDniFront.startsWith('data:image')) {
      const uploadedUrl = await uploadImage(finalDniFront);
      if (uploadedUrl) {
        finalDniFront = uploadedUrl;
      } else {
        throw new Error(
          'No se pudo subir la foto del DNI (Frente). Verifica la configuración del servidor.',
        );
      }
    }

    if (finalDniBack && finalDniBack.startsWith('data:image')) {
      const uploadedUrl = await uploadImage(finalDniBack);
      if (uploadedUrl) {
        finalDniBack = uploadedUrl;
      } else {
        throw new Error(
          'No se pudo subir la foto del DNI (Dorso). Verifica la configuración del servidor.',
        );
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
        dniFront: finalDniFront,
        dniBack: finalDniBack,
        serviceCost: validatedData.costo_servicio,
        notes: validatedData.notas,
      },
    });

    // 2. Crear la Instalación vinculada al cliente
    const installation = await prisma.installation.create({
      data: {
        clientId: client.id,
        equipmentCount: validatedData.cantidad_equipos,
        ipPorts: validatedData.ip_puertos?.map((p) => p.value) || [],
        techNotes: validatedData.notas,
        installedAt: new Date(validatedData.fecha_instalacion),
      },
    });

    // Revalidar rutas necesarias
    revalidatePath('/clientes');

    return { success: true, data: { client, installation } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: `Error: ${error.message}` };
    }
    return { success: false, error: 'Ocurrió un error inesperado al guardar los datos.' };
  }
}

export async function updateClient(clientId: string, data: InstalacionFormValues) {
  try {
    const validatedData = instalacionSchema.parse(data);

    // Manejar image_url: subir nueva o borrar
    let finalImageUrl: string | null | undefined = undefined;
    if (validatedData.image_url === '') {
      // Si es cadena vacía, borrar la imagen
      finalImageUrl = null;
    } else if (validatedData.image_url && validatedData.image_url.startsWith('data:image')) {
      // Si es base64, subir nueva imagen
      const uploaded = await uploadImage(validatedData.image_url);
      if (uploaded) {
        finalImageUrl = uploaded;
      } else {
        throw new Error(
          'No se pudo subir la foto del local. Verifica la configuración del servidor.',
        );
      }
    }

    // Manejar dni_front: subir nueva o borrar
    let finalDniFront: string | null | undefined = undefined;
    if (validatedData.dni_front === '') {
      finalDniFront = null;
    } else if (validatedData.dni_front && validatedData.dni_front.startsWith('data:image')) {
      const uploaded = await uploadImage(validatedData.dni_front);
      if (uploaded) {
        finalDniFront = uploaded;
      } else {
        throw new Error(
          'No se pudo subir la foto del DNI (Frente). Verifica la configuración del servidor.',
        );
      }
    }

    // Manejar dni_back: subir nueva o borrar
    let finalDniBack: string | null | undefined = undefined;
    if (validatedData.dni_back === '') {
      finalDniBack = null;
    } else if (validatedData.dni_back && validatedData.dni_back.startsWith('data:image')) {
      const uploaded = await uploadImage(validatedData.dni_back);
      if (uploaded) {
        finalDniBack = uploaded;
      } else {
        throw new Error(
          'No se pudo subir la foto del DNI (Dorso). Verifica la configuración del servidor.',
        );
      }
    }

    // 1. Actualizar Cliente
    await prisma.client.update({
      where: { id: clientId },
      data: {
        name: validatedData.nombre,
        ownerName: validatedData.propietario,
        phone: validatedData.telefono,
        address: validatedData.direccion,
        between: validatedData.entre_calles,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        // Only update images if we have new values (undefined is ignored by Prisma update)
        imageUrl: finalImageUrl,
        dniFront: finalDniFront,
        dniBack: finalDniBack,
        serviceCost: validatedData.costo_servicio,
        notes: validatedData.notas,
      },
    });

    // 2. Actualizar la primera instalación (asumiendo flujo 1:1)
    const installation = await prisma.installation.findFirst({
      where: { clientId },
      orderBy: { installedAt: 'desc' },
    });

    if (installation) {
      await prisma.installation.update({
        where: { id: installation.id },
        data: {
          equipmentCount: validatedData.cantidad_equipos,
          ipPorts: validatedData.ip_puertos?.map((p) => p.value) || [],
          techNotes: validatedData.notas,
        },
      });
    }

    revalidatePath(`/cliente/${clientId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Error desconocido al actualizar' };
  }
}

export async function toggleClientStatus(clientId: string, currentStatus: string) {
  try {
    const newStatus =
      currentStatus === ClientStatus.INACTIVE ? ClientStatus.ACTIVE : ClientStatus.INACTIVE;

    await prisma.client.update({
      where: { id: clientId },
      data: { status: newStatus },
    });

    revalidatePath(`/cliente/${clientId}`);

    return { success: true, newStatus };
  } catch {
    return { success: false, error: 'No se pudo cambiar el estado del cliente' };
  }
}
export async function renewSubscription(clientId: string, amount: number) {
  try {
    // 1. Obtener la fecha para el periodo del pago (el mes actual)
    const now = new Date();
    const period = new Date(now.getFullYear(), now.getMonth(), 1);

    // 2. Crear el registro de pago cobrado
    await prisma.payment.create({
      data: {
        clientId,
        amount,
        status: 'PAID',
        method: 'CASH',
        paidAt: now,
        period: period,
        description: `Renovación de suscripción - ${now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`,
      },
    });

    // 3. Actualizar el estado del cliente a ACTIVE
    await prisma.client.update({
      where: { id: clientId },
      data: { status: 'ACTIVE' },
    });

    // Solo revalidar la página del cliente para reducir escrituras
    revalidatePath(`/cliente/${clientId}`);

    return { success: true };
  } catch (error) {
    console.error('Error in renewSubscription:', error);
    return { success: false, error: 'No se pudo procesar la renovación' };
  }
}

// Obtener la imagen de perfil del usuario autenticado
export async function getUserProfileImage() {
  try {
    // Por ahora asumimos que hay un solo usuario admin
    // TODO: Implementar autenticación con sesión para obtener el user ID real
    const user = await prisma.user.findFirst({
      where: { username: 'nbadmin' },
      select: { profileImage: true },
    });

    return { success: true, profileImage: user?.profileImage || null };
  } catch (error) {
    console.error('Error getting profile image:', error);
    return { success: false, profileImage: null };
  }
}

// Actualizar la imagen de perfil del usuario
export async function updateProfileImage(imageData: string | null) {
  try {
    let finalImageUrl: string | null = imageData;

    // Si tenemos una cadena base64, la subimos a imgbb
    if (finalImageUrl && finalImageUrl.startsWith('data:image')) {
      const uploadedUrl = await uploadImage(finalImageUrl);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    // Por ahora asumimos que hay un solo usuario admin
    // TODO: Implementar autenticación con sesión para obtener el user ID real
    await prisma.user.updateMany({
      where: { username: 'nbadmin' },
      data: { profileImage: finalImageUrl },
    });

    revalidatePath('/perfil');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return { success: false, error: 'No se pudo actualizar la imagen de perfil' };
  }
}

// Generar link compartible para vendedor
export async function generateShareLink(clientId: string) {
  try {
    // Verificar que el cliente existe
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true },
    });

    if (!client) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    // Generar token con vencimiento de 24 horas
    const token = await generateShareToken(clientId, 24);

    // Construir URL (ajustar según tu dominio en producción)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/public/${clientId}?token=${token}`;

    return { success: true, shareUrl };
  } catch (error) {
    console.error('Error generating share link:', error);
    return { success: false, error: 'No se pudo generar el link de compartir' };
  }
}
