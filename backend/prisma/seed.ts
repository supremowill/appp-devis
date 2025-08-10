import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Define Role enum locally to match the schema
enum Role {
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER'
}

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Create a driver
  const driver = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'driver@example.com',
      password: hashedPassword,
      role: Role.DRIVER,
      phone: '+55 44 99999-1111',
      carModel: 'Honda Civic 2020',
      carPlate: 'ABC-1234',
      cnh: '123456789',
    },
  });

  // Create a passenger
  const passenger = await prisma.user.upsert({
    where: { email: 'passenger@example.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'passenger@example.com',
      password: hashedPassword,
      role: Role.PASSENGER,
      phone: '+55 44 99999-2222',
    },
  });

  console.log('Seed data created:');
  console.log('Driver:', { id: driver.id, name: driver.name, email: driver.email });
  console.log('Passenger:', { id: passenger.id, name: passenger.name, email: passenger.email });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });