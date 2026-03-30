import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllReservations,
  updateReservation, 
  deleteReservation 
} from '@/lib/reservations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reservations = getAllReservations();
    const reservation = reservations.find(r => r.id === id);

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
    const { id } = await params;
    const body = await request.json();
    const { date, timeSlots, activityType, notes, allowsCompany, userId } = body;

    const reservations = getAllReservations();
    const existing = reservations.find(r => r.id === id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar esta reserva' },
        { status: 403 }
      );
    }

    for (const slot of timeSlots) {
      const otherReservations = reservations.filter(
        r => r.date === date && r.timeSlots.includes(slot) && r.id !== id
      );

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

    const updated = updateReservation(id, {
      date,
      timeSlots,
      activityType,
      notes: notes || null,
      allowsCompany,
    });

    return NextResponse.json({ reservation: updated });
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
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;
    
    const reservations = getAllReservations();
    const existing = reservations.find(r => r.id === id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta reserva' },
        { status: 403 }
      );
    }

    deleteReservation(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Error al eliminar reserva' },
      { status: 500 }
    );
  }
}
