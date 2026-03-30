import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TIME_SLOTS = {
  '16-18': { label: '16:00 - 18:00', time: '16:00 - 18:00' },
  '18-20:30': { label: '18:00 - 20:30', time: '18:00 - 20:30' },
} as const;

export const MORNING_SLOTS = {
  '10-13': { label: '10:00 - 13:00', time: '10:00 - 13:00' },
  '10-13:30': { label: '10:00 - 13:30', time: '10:00 - 13:30' },
} as const;

export type TimeSlotKey = keyof typeof TIME_SLOTS;
export type MorningSlotKey = keyof typeof MORNING_SLOTS;

type SlotInfo = { label: string; time: string };
type DaySlots = Partial<Record<string, SlotInfo>>;

export const getTimeSlotsForDay = (date: Date): DaySlots => {
  const day = date.getDay();
  
  if (day === 6) {
    return {
      '10-13:30': { label: '10:00 - 13:30', time: '10:00 - 13:30' },
    };
  }
  
  if (day === 3) {
    return {
      '10-13': { label: '10:00 - 13:00', time: '10:00 - 13:00' },
      '16-18': { label: '16:00 - 18:00', time: '16:00 - 18:00' },
      '18-20:30': { label: '18:00 - 20:30', time: '18:00 - 20:30' },
    };
  }
  
  return {
    '16-18': { label: '16:00 - 18:00', time: '16:00 - 18:00' },
    '18-20:30': { label: '18:00 - 20:30', time: '18:00 - 20:30' },
  };
};

export const ACTIVITY_TYPES = {
  ampliacion: { label: 'Ampliación', color: 'bg-activity-ampliacion' },
  contactos: { label: 'Contactos', color: 'bg-activity-contactos' },
  revelado: { label: 'Revelado de negativos', color: 'bg-activity-revelado' },
  otro: { label: 'Otros', color: 'bg-activity-otro' },
} as const;

export const ACTIVITY_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  revelado: { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-800' },
  ampliacion: { bg: 'bg-amber-950', text: 'text-amber-400', border: 'border-amber-800' },
  contactos: { bg: 'bg-purple-950', text: 'text-purple-400', border: 'border-purple-800' },
  otro: { bg: 'bg-gray-900', text: 'text-gray-400', border: 'border-gray-700' },
};

export type TimeSlot = keyof typeof TIME_SLOTS;
export type ActivityType = keyof typeof ACTIVITY_TYPES;
