import fs from 'fs';
import path from 'path';

const RESERVATIONS_FILE = path.join(process.cwd(), 'reservations.json');

export interface Reservation {
  id: string;
  date: string;
  timeSlots: string[];
  activityType: string;
  notes: string | null;
  allowsCompany: boolean;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface ReservationsData {
  reservations: Reservation[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function readReservations(): ReservationsData {
  try {
    if (!fs.existsSync(RESERVATIONS_FILE)) {
      return { reservations: [] };
    }
    const data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { reservations: [] };
  }
}

function writeReservations(data: ReservationsData): void {
  fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(data, null, 2));
}

export function getAllReservations(): Reservation[] {
  return readReservations().reservations.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getReservationsByDate(date: string): Reservation[] {
  const { reservations } = readReservations();
  return reservations.filter(r => r.date === date);
}

export function getReservationsByMonth(year: number, month: number): Reservation[] {
  const { reservations } = readReservations();
  return reservations.filter(r => {
    const rDate = new Date(r.date);
    return rDate.getFullYear() === year && rDate.getMonth() === month;
  });
}

export function createReservation(
  data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
): Reservation | { error: string } {
  const { reservations } = readReservations();

  for (const slot of data.timeSlots) {
    const existingOnSlot = reservations.filter(
      r => r.date === data.date && r.timeSlots.includes(slot)
    );

    if (existingOnSlot.length > 0) {
      const hasPrivate = existingOnSlot.some(r => !r.allowsCompany);
      
      if (hasPrivate) {
        return { error: `Ya existe una reserva privada en el horario ${slot}` };
      }

      if (!data.allowsCompany) {
        return { error: `Ya existen reservas compartidas en ${slot}. Solo puedes reservar si aceptas compañía` };
      }
    }
  }

  const newReservation: Reservation = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reservations.push(newReservation);
  writeReservations({ reservations });

  return newReservation;
}

export function updateReservation(
  id: string,
  data: Partial<Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>>
): Reservation | null {
  const { reservations } = readReservations();
  const index = reservations.findIndex(r => r.id === id);

  if (index === -1) return null;

  reservations[index] = {
    ...reservations[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  writeReservations({ reservations });
  return reservations[index];
}

export function deleteReservation(id: string): boolean {
  const { reservations } = readReservations();
  const filtered = reservations.filter(r => r.id !== id);

  if (filtered.length === reservations.length) return false;

  writeReservations({ reservations: filtered });
  return true;
}
