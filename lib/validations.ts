import { z } from 'zod';

export const loginSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre debe tener máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
});

export const reservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  timeSlots: z.array(z.string()).min(1, 'Selecciona al menos una franja horaria'),
  activityType: z.enum(['revelado', 'ampliacion', 'contactos', 'otro'], {
    required_error: 'Selecciona el tipo de actividad',
  }),
  notes: z.string().optional().default(''),
  allowsCompany: z.boolean().default(false),
});

export const updateReservationSchema = reservationSchema.extend({
  id: z.string().min(1, 'ID de reserva requerido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
