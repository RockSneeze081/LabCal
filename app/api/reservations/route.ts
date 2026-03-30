import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { reservationSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const userId = searchParams.get('userId');
    const activity = searchParams.get('activity');

    const where: Record<string, unknown> = {};

    if (date) {
      where.date = new Date(date);
    }

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (userId) {
      where.userId = userId;
    }

    if (activity) {
      where.activityType = activity;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const result = reservationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { date, timeSlots, activityType, notes, allowsCompany } = result.data;

    for (const slot of timeSlots) {
      const existingReservations = await prisma.reservation.findMany({
        where: {
          date: new Date(date),
          timeSlots: { has: slot },
        },
      });

      if (existingReservations.length > 0) {
        const hasPrivateReservation = existingReservations.some(r => !r.allowsCompany);
        
        if (hasPrivateReservation) {
          return NextResponse.json(
            { error: `Ya existe una reserva privada en el horario ${slot}` },
            { status: 409 }
          );
        }

        if (!allowsCompany) {
          return NextResponse.json(
            { error: `Ya existen reservas compartidas en ${slot}. Solo puedes reservar si aceptas compañía` },
            { status: 409 }
          );
        }
      }
    }

    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        timeSlots,
        activityType,
        notes: notes || null,
        allowsCompany,
        userId: session.id,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Error al crear reserva' },
      { status: 500 }
    );
  }
}
