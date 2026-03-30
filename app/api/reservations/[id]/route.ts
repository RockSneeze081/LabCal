import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { updateReservationSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json(
      { error: 'Error al obtener reserva' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateReservationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    if (existingReservation.userId !== session.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar esta reserva' },
        { status: 403 }
      );
    }

    const { date, timeSlots, activityType, notes, allowsCompany } = result.data;

    for (const slot of timeSlots) {
      const otherReservations = await prisma.reservation.findMany({
        where: {
          date: new Date(date),
          timeSlots: { has: slot },
          id: { not: id },
        },
      });

      if (otherReservations.length > 0) {
        const hasPrivateReservation = otherReservations.some(r => !r.allowsCompany);
        
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

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        date: new Date(date),
        timeSlots,
        activityType,
        notes: notes || null,
        allowsCompany,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Error al actualizar reserva' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    if (existingReservation.userId !== session.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta reserva' },
        { status: 403 }
      );
    }

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar reserva' },
      { status: 500 }
    );
  }
}
