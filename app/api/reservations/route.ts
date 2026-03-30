import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllReservations, 
  getReservationsByDate, 
  getReservationsByMonth,
  createReservation 
} from '@/lib/reservations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month');

    let reservations;
    
    if (date) {
      reservations = getReservationsByDate(date);
    } else if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      reservations = getReservationsByMonth(year, monthNum);
    } else {
      reservations = getAllReservations();
    }

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
    const body = await request.json();
    const { date, timeSlots, activityType, notes, allowsCompany, userId, userName } = body;

    if (!date || !timeSlots || !activityType || !userId || !userName) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const result = createReservation({
      date,
      timeSlots,
      activityType,
      notes: notes || null,
      allowsCompany: allowsCompany || false,
      userId,
      userName,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ reservation: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Error al crear reserva' },
      { status: 500 }
    );
  }
}
