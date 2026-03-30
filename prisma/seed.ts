import { PrismaClient } from '@prisma/client';
import { addDays, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.reservation.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Ana Fotógrafa' } }),
    prisma.user.create({ data: { name: 'Carlos Revelador' } }),
    prisma.user.create({ data: { name: 'María Ampliadora' } }),
    prisma.user.create({ data: { name: 'Pablo Contactos' } }),
    prisma.user.create({ data: { name: 'Lucía Analógica' } }),
  ]);

  console.log(`Created ${users.length} users`);

  const today = new Date();
  const reservations = [
    {
      date: addDays(today, 0),
      timeSlot: 'morning',
      activityType: 'revelado',
      notes: 'Película Kodak Tri-X 400',
      allowsCompany: false,
      userId: users[0].id,
    },
    {
      date: addDays(today, 0),
      timeSlot: 'afternoon',
      activityType: 'ampliacion',
      notes: 'Ampliar 5 fotos de la sesión urbana',
      allowsCompany: true,
      userId: users[2].id,
    },
    {
      date: addDays(today, 1),
      timeSlot: 'morning',
      activityType: 'contactos',
      notes: 'Revelar y hacer contactos del rollo ISO 100',
      allowsCompany: true,
      userId: users[3].id,
    },
    {
      date: addDays(today, 1),
      timeSlot: 'afternoon',
      activityType: 'revelado',
      notes: 'Dos rollos de Ilford HP5',
      allowsCompany: false,
      userId: users[1].id,
    },
    {
      date: addDays(today, 2),
      timeSlot: 'morning',
      activityType: 'otro',
      notes: 'Limpieza de equipo y organización',
      allowsCompany: true,
      userId: users[4].id,
    },
    {
      date: addDays(today, 2),
      timeSlot: 'afternoon',
      activityType: 'ampliacion',
      notes: 'Técnica de dodge y burn',
      allowsCompany: true,
      userId: users[0].id,
    },
    {
      date: addDays(today, 3),
      timeSlot: 'morning',
      activityType: 'revelado',
      notes: 'Película Fomapan 100',
      allowsCompany: false,
      userId: users[2].id,
    },
    {
      date: addDays(today, 4),
      timeSlot: 'afternoon',
      activityType: 'contactos',
      notes: 'Selección de negativos para ampliación',
      allowsCompany: true,
      userId: users[1].id,
    },
    {
      date: addDays(today, 5),
      timeSlot: 'morning',
      activityType: 'revelado',
      notes: 'Rollos del viaje a la montaña',
      allowsCompany: false,
      userId: users[3].id,
    },
    {
      date: addDays(today, 6),
      timeSlot: 'afternoon',
      activityType: 'ampliacion',
      notes: 'Album de fotos analógicas',
      allowsCompany: true,
      userId: users[4].id,
    },
    {
      date: addDays(today, 7),
      timeSlot: 'morning',
      activityType: 'revelado',
      notes: 'Prueba de nuevos reveladores',
      allowsCompany: false,
      userId: users[0].id,
    },
    {
      date: addDays(today, 8),
      timeSlot: 'afternoon',
      activityType: 'otro',
      notes: 'Taller de técnicas alternativas',
      allowsCompany: true,
      userId: users[2].id,
    },
  ];

  for (const reservation of reservations) {
    await prisma.reservation.create({
      data: {
        ...reservation,
        date: format(reservation.date, 'yyyy-MM-dd'),
      } as { date: Date; timeSlot: string; activityType: string; notes: string | null; allowsCompany: boolean; userId: string },
    });
  }

  console.log(`Created ${reservations.length} reservations`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
