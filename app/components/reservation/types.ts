export interface User {
  id: string;
  name: string;
}

export interface ReservationWithUser {
  id: string;
  date: Date | string;
  timeSlots: string[];
  activityType: 'revelado' | 'ampliacion' | 'contactos' | 'otro';
  notes: string | null;
  allowsCompany: boolean;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: User;
}

export interface ReservationFormData {
  date: string;
  timeSlots: string[];
  activityType: 'revelado' | 'ampliacion' | 'contactos' | 'otro';
  notes: string;
  allowsCompany: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  reservations?: ReservationWithUser[];
  reservation?: ReservationWithUser;
  users?: User[];
  user?: User;
}
