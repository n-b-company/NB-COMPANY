import 'dotenv/config';
import { PrismaClient, ClientStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Borrando datos existentes...');

  // Limpiar base de datos en orden de dependencia
  await prisma.payment.deleteMany({});
  await prisma.installation.deleteMany({});
  await prisma.client.deleteMany({});

  console.log('Sembrando nuevos datos...');

  // 1. Crear Clientes
  const client1 = await prisma.client.create({
    data: {
      name: 'Supermercado Central',
      ownerName: 'Juan Pérez',
      email: 'juan@central.com',
      phone: '1122334455',
      address: 'Av. Corrientes 1234, CABA',
      between: 'Libertad y Talcahuano',
      status: 'ACTIVE' as ClientStatus,
      notes: 'Cliente preferencial, paga siempre a término.',
      latitude: -34.603722,
      longitude: -58.381592,
      imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=400',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Farmacia Nueva',
      ownerName: 'María García',
      email: 'maria@farmacianueva.com',
      phone: '1155667788',
      address: 'Calle Falsa 123, Avellaneda',
      between: 'Mitre y Belgrano',
      status: 'WARNING' as ClientStatus,
      notes: 'Requiere mantenimiento de cámaras cada 3 meses.',
      latitude: -34.662241,
      longitude: -58.365314,
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Kiosco El Paso',
      ownerName: 'Roberto Gómez',
      phone: '1199887766',
      address: '9 de Julio 50, Quilmes',
      status: 'OVERDUE' as ClientStatus,
      notes: 'Pago pendiente del mes pasado.',
      latitude: -34.721455,
      longitude: -58.257321,
    },
  });

  // 2. Crear Instalaciones
  await prisma.installation.createMany({
    data: [
      {
        clientId: client1.id,
        equipmentCount: 4,
        ipPort: '192.168.1.10:80',
        techNotes: 'Instalado con DVR Hikvision. Puerto 80 mapeado.',
        installedAt: new Date('2024-01-15'),
      },
      {
        clientId: client2.id,
        equipmentCount: 2,
        ipPort: '192.168.0.50:8000',
        techNotes: 'Cámaras IP inalámbricas.',
        installedAt: new Date('2024-02-20'),
      },
      {
        clientId: client3.id,
        equipmentCount: 1,
        ipPort: '10.0.0.5:8080',
        techNotes: 'Monitoreo básico entrada.',
        installedAt: new Date('2024-03-01'),
      },
    ],
  });

  // 3. Crear Pagos
  await prisma.payment.createMany({
    data: [
      {
        clientId: client1.id,
        amount: 15000,
        currency: 'ARS',
        status: 'PAID' as PaymentStatus,
        method: 'TRANSFER' as PaymentMethod,
        description: 'Abono Enero 2024',
        paidAt: new Date('2024-01-05'),
        period: new Date('2024-01-01'),
        referenceId: 'REF-001',
      },
      {
        clientId: client1.id,
        amount: 15000,
        currency: 'ARS',
        status: 'PAID' as PaymentStatus,
        method: 'TRANSFER' as PaymentMethod,
        description: 'Abono Febrero 2024',
        paidAt: new Date('2024-02-05'),
        period: new Date('2024-02-01'),
        referenceId: 'REF-002',
      },
      {
        clientId: client2.id,
        amount: 8000,
        currency: 'ARS',
        status: 'PAID' as PaymentStatus,
        method: 'CASH' as PaymentMethod,
        description: 'Instalación inicial',
        paidAt: new Date('2024-02-20'),
        referenceId: 'REF-003',
      },
      {
        clientId: client3.id,
        amount: 5000,
        currency: 'ARS',
        status: 'PENDING' as PaymentStatus,
        method: 'CASH' as PaymentMethod,
        description: 'Abono Marzo 2024',
        period: new Date('2024-03-01'),
        referenceId: 'REF-004',
      },
    ],
  });

  console.log('Seed finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
