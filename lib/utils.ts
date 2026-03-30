import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TIME_SLOTS = {
  morning: { label: 'Mañana', time: '08:00 - 14:00' },
  afternoon: { label: 'Tarde', time: '14:00 - 20:00' },
} as const;

export const ACTIVITY_TYPES = {
  revelado: { label: 'Revelado de negativos', color: 'bg-activity-revelado' },
  ampliacion: { label: 'Ampliación/copias', color: 'bg-activity-ampliacion' },
  contactos: { label: 'Hoja de contactos', color: 'bg-activity-contactos' },
  otro: { label: 'Otro', color: 'bg-activity-otro' },
} as const;

export const ACTIVITY_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  revelado: { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-800' },
  ampliacion: { bg: 'bg-amber-950', text: 'text-amber-400', border: 'border-amber-800' },
  contactos: { bg: 'bg-purple-950', text: 'text-purple-400', border: 'border-purple-800' },
  otro: { bg: 'bg-gray-900', text: 'text-gray-400', border: 'border-gray-700' },
};

export type TimeSlot = keyof typeof TIME_SLOTS;
export type ActivityType = keyof typeof ACTIVITY_TYPES;
