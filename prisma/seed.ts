import 'dotenv/config';
import { PrismaClient, ClientStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

const CLIENTS_DATA = [
  {
    name: 'Kiosco El Mandarina',
    ownerName: 'Carlos Villagra',
    phone: '3814556677',
    address: 'Av. Avellaneda 400',
    between: 'Santiago y Corrientes',
    status: 'ACTIVE',
    serviceCost: 25000,
    latitude: -26.8305,
    longitude: -65.203,
    notes: 'Cliente nuevo, todo OK.',
    createdAt: '2026-01-25T10:00:00.000Z',
    updatedAt: '2026-01-25T10:00:00.000Z',
  },
  {
    name: 'Farmacia Del Pueblo',
    ownerName: 'Susana Gimenez',
    phone: '3815112233',
    address: 'San Juan 850',
    between: 'Junín y Salta',
    status: 'ACTIVE',
    serviceCost: 35000,
    latitude: -26.829,
    longitude: -65.208,
    notes: 'Pagó por adelantado.',
    createdAt: '2025-12-01T09:00:00.000Z',
    updatedAt: '2026-01-28T15:30:00.000Z',
  },
  {
    name: 'Verdulería La Huerta',
    ownerName: 'Pedro Picapiedra',
    phone: '3816778899',
    address: 'Lavalle 1200',
    between: 'Rioja y Alberdi',
    status: 'ACTIVE',
    serviceCost: 15000,
    latitude: -26.835,
    longitude: -65.215,
    notes: 'Solo efectivo.',
    createdAt: '2026-01-15T11:00:00.000Z',
    updatedAt: '2026-01-15T11:00:00.000Z',
  },
  {
    name: 'Drugstore 24hs',
    ownerName: 'Mariano Martinez',
    phone: '3814123456',
    address: '25 de Mayo 300',
    between: 'Córdoba y Mendoza',
    status: 'ACTIVE',
    serviceCost: 30000,
    latitude: -26.825,
    longitude: -65.201,
    notes: 'Pedir llave al guardia.',
    createdAt: '2025-11-20T14:00:00.000Z',
    updatedAt: '2026-01-30T09:00:00.000Z',
  },
  {
    name: 'Panadería El Trigal',
    ownerName: 'Ana Maria Polo',
    phone: '3815998877',
    address: 'Muñecas 600',
    between: 'Maipú y Junín',
    status: 'ACTIVE',
    serviceCost: 28000,
    latitude: -26.8275,
    longitude: -65.2045,
    notes: 'Se le cortó internet ayer.',
    createdAt: '2026-01-10T08:30:00.000Z',
    updatedAt: '2026-01-10T08:30:00.000Z',
  },
  {
    name: 'Carnicería Los Amigos (A punto de vencer)',
    ownerName: 'Jorge Rial',
    phone: '3816554433',
    address: 'Av. Belgrano 1500',
    between: 'Ejército y Viamonte',
    status: 'ACTIVE',
    serviceCost: 25000,
    latitude: -26.819,
    longitude: -65.22,
    notes: 'Llamar para cobrar.',
    createdAt: '2025-10-05T10:00:00.000Z',
    updatedAt: '2026-01-05T10:00:00.000Z',
  },
  {
    name: 'Librería Técnica (A punto de vencer)',
    ownerName: 'Lucia Galán',
    phone: '3814889900',
    address: 'Crisóstomo Álvarez 700',
    between: 'Chacabuco y Buenos Aires',
    status: 'ACTIVE',
    serviceCost: 20000,
    latitude: -26.832,
    longitude: -65.206,
    notes: 'Paga siempre el día 5.',
    createdAt: '2025-08-15T16:00:00.000Z',
    updatedAt: '2026-01-04T16:00:00.000Z',
  },
  {
    name: 'Gimnasio Power (A punto de vencer)',
    ownerName: 'La Roca',
    phone: '3815223344',
    address: 'Santiago 1100',
    between: 'Balcarce y Monteagudo',
    status: 'ACTIVE',
    serviceCost: 40000,
    latitude: -26.824,
    longitude: -65.199,
    notes: 'Revisar lector de huellas.',
    createdAt: '2025-09-01T12:00:00.000Z',
    updatedAt: '2026-01-06T12:00:00.000Z',
  },
  {
    name: 'Bar La previa (VENCIDO)',
    ownerName: 'Dipy Papa',
    phone: '3816000000',
    address: 'Chacabuco 150',
    between: 'San Lorenzo y Las Piedras',
    status: 'ACTIVE',
    serviceCost: 45000,
    latitude: -26.831,
    longitude: -65.209,
    notes: 'DEBE 2 MESES.',
    createdAt: '2025-06-20T20:00:00.000Z',
    updatedAt: '2025-12-20T20:00:00.000Z',
  },
  {
    name: 'Maxikiosco Azul (VENCIDO)',
    ownerName: 'Azul Profundo',
    phone: '3814777777',
    address: 'Roca 200',
    between: 'Entre Ríos y Moreno',
    status: 'ACTIVE',
    serviceCost: 22000,
    latitude: -26.836,
    longitude: -65.212,
    notes: 'No contesta el teléfono.',
    createdAt: '2025-05-10T11:00:00.000Z',
    updatedAt: '2025-12-15T11:00:00.000Z',
  },
  {
    name: 'Zapatería Pies (VENCIDO)',
    ownerName: 'Cenicienta',
    phone: '3815888888',
    address: 'Peatonal Mendoza 550',
    between: '25 de Mayo y Muñecas',
    status: 'ACTIVE',
    serviceCost: 30000,
    latitude: -26.828,
    longitude: -65.2035,
    notes: 'Cortar servicio si no paga hoy.',
    createdAt: '2025-07-01T09:30:00.000Z',
    updatedAt: '2025-12-28T09:30:00.000Z',
  },
  {
    name: 'Miniservice El Tata',
    ownerName: 'Don Tata',
    phone: '3813999999',
    address: 'Av. Mitre 800',
    between: 'Santa Fe y Marcos Paz',
    status: 'ACTIVE',
    serviceCost: 18000,
    latitude: -26.822,
    longitude: -65.2155,
    notes: 'Todo en orden.',
    createdAt: '2026-01-20T10:15:00.000Z',
    updatedAt: '2026-01-20T10:15:00.000Z',
  },
  {
    name: 'Ferretería El Tornillo',
    ownerName: 'Tuerca Loca',
    phone: '3816333333',
    address: 'Av. Colón 1200',
    between: 'Lamadrid y Lavalle',
    status: 'ACTIVE',
    serviceCost: 35000,
    latitude: -26.838,
    longitude: -65.225,
    notes: 'Cliente conflictivo, tratar con cuidado.',
    createdAt: '2025-11-15T14:45:00.000Z',
    updatedAt: '2026-01-29T14:45:00.000Z',
  },
  {
    name: 'Sushi Club',
    ownerName: 'Takuma Sato',
    phone: '3815001122',
    address: 'Av. Perón 2500',
    between: 'Yerba Buena',
    status: 'ACTIVE',
    serviceCost: 55000,
    latitude: -26.815,
    longitude: -65.28,
    notes: 'Requiere soporte técnico mensual.',
    createdAt: '2025-12-10T18:00:00.000Z',
    updatedAt: '2026-01-25T18:00:00.000Z',
  },
  {
    name: 'Heladería Grido',
    ownerName: 'Franquicia 1',
    phone: '3814224466',
    address: 'Av. Alem 500',
    between: 'Rondo y Bolivar',
    status: 'ACTIVE',
    serviceCost: 30000,
    latitude: -26.84,
    longitude: -65.21,
    notes: null,
    createdAt: '2026-01-02T11:30:00.000Z',
    updatedAt: '2026-01-02T11:30:00.000Z',
  },
  {
    name: 'PetShop Huesitos (A punto de vencer)',
    ownerName: 'Lassie Dog',
    phone: '3816998800',
    address: 'Mate de Luna 1800',
    between: 'Paso de los Andes',
    status: 'ACTIVE',
    serviceCost: 25000,
    latitude: -26.823,
    longitude: -65.23,
    notes: 'Recordar enviarle factura.',
    createdAt: '2025-09-20T15:00:00.000Z',
    updatedAt: '2026-01-07T15:00:00.000Z',
  },
  {
    name: 'Restaurante El Portal',
    ownerName: 'Gato Dumas',
    phone: '3815776655',
    address: '24 de Septiembre 1100',
    between: 'Marco Avellaneda',
    status: 'ACTIVE',
    serviceCost: 48000,
    latitude: -26.83,
    longitude: -65.22,
    notes: 'Pagó con transferencia.',
    createdAt: '2025-10-30T21:00:00.000Z',
    updatedAt: '2026-01-31T21:00:00.000Z',
  },
  {
    name: 'Tienda de Ropa Mía',
    ownerName: 'Ricky Sarkany',
    phone: '3814332211',
    address: 'Cordoba 450',
    between: 'Laprida y 25 de Mayo',
    status: 'ACTIVE',
    serviceCost: 28000,
    latitude: -26.826,
    longitude: -65.202,
    notes: 'Quiere agregar otra sucursal.',
    createdAt: '2026-01-18T10:00:00.000Z',
    updatedAt: '2026-01-18T10:00:00.000Z',
  },
  {
    name: 'Kiosco de la Escuela (VENCIDO)',
    ownerName: 'Portera Marta',
    phone: '3815123123',
    address: 'España 1600',
    between: 'Italia',
    status: 'ACTIVE',
    serviceCost: 15000,
    latitude: -26.818,
    longitude: -65.218,
    notes: 'Dice que paga cuando empiecen las clases.',
    createdAt: '2025-03-15T08:00:00.000Z',
    updatedAt: '2025-11-30T08:00:00.000Z',
  },
  {
    name: 'Vinoteca Baco',
    ownerName: 'Dios Griego',
    phone: '3816887766',
    address: 'Santa Fe 550',
    between: 'Laprida',
    status: 'ACTIVE',
    serviceCost: 38000,
    latitude: -26.821,
    longitude: -65.205,
    notes: 'Todo perfecto.',
    createdAt: '2025-12-05T19:00:00.000Z',
    updatedAt: '2026-02-01T19:00:00.000Z',
  },
];

async function main() {
  console.log('Borrando datos existentes...');

  await prisma.payment.deleteMany({});
  await prisma.installation.deleteMany({});
  await prisma.client.deleteMany({});

  console.log('Sembrando nuevos datos agrupados...');

  for (let i = 0; i < CLIENTS_DATA.length; i++) {
    const clientItem = CLIENTS_DATA[i];
    const { createdAt, updatedAt, ...rest } = clientItem;

    const client = await prisma.client.create({
      data: {
        ...rest,
        status: rest.status as ClientStatus,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });

    // Crear una instalación por defecto
    await prisma.installation.create({
      data: {
        clientId: client.id,
        equipmentCount: 1,
        techNotes: 'Instalación migrada',
        installedAt: new Date(createdAt),
      },
    });

    // Crear un pago para cada cliente con referenceId único
    if (client.name.includes('VENCIDO')) {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: client.serviceCost || 0,
          currency: 'ARS',
          status: 'PENDING' as PaymentStatus,
          method: 'CASH' as PaymentMethod,
          description: 'Abono vencido',
          period: new Date(updatedAt),
          createdAt: new Date(updatedAt),
          referenceId: `VENC-${client.id.substring(client.id.length - 4)}-${i}`,
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: client.serviceCost || 0,
          currency: 'ARS',
          status: 'PAID' as PaymentStatus,
          method: 'TRANSFER' as PaymentMethod,
          description: 'Abono al día',
          paidAt: new Date(updatedAt),
          period: new Date(updatedAt),
          createdAt: new Date(updatedAt),
          referenceId: `PAID-${client.id.substring(client.id.length - 4)}-${i}`,
        },
      });
    }
  }

  console.log(`Seed finalizado: ${CLIENTS_DATA.length} clientes creados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
