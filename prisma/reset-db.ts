import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RESET DE BASE DE DATOS ---');

  try {
    console.log('Borrando pagos...');
    await prisma.payment.deleteMany({});

    console.log('Borrando instalaciones...');
    await prisma.installation.deleteMany({});

    console.log('Borrando clientes...');
    await prisma.client.deleteMany({});

    console.log('--- BASE DE DATOS LIMPIA ---');
    console.log('Se han conservado los usuarios del sistema.');
  } catch (error) {
    console.error('Error al resetear la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
