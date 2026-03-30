'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CalendarDay } from './CalendarDay';
import { ReservationWithUser } from '@/app/components/reservation/types';

interface CalendarGridProps {
  reservations: ReservationWithUser[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  onReservationClick: (reservation: ReservationWithUser) => void;
  selectedDate: Date | null;
  filters: {
    activities: string[];
    userId: string | null;
  };
  currentUserId: string | null;
}

export function CalendarGrid({
  reservations,
  currentDate,
  onDateChange,
  onDayClick,
  onReservationClick,
  selectedDate,
  filters,
  currentUserId,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const generateDays = () => {
    const days: Date[] = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  };

  const filteredReservations = reservations.filter((r) => {
    if (filters.activities.length > 0 && !filters.activities.includes(r.activityType)) {
      return false;
    }
    if (filters.userId && r.userId !== filters.userId) {
      return false;
    }
    return true;
  });

  const getReservationsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredReservations.filter((r) => {
      const rDateStr = format(new Date(r.date), 'yyyy-MM-dd');
      return rDateStr === dateStr;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-mono font-semibold text-text-primary min-w-[200px] text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isSameMonth(currentDate, new Date()) ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onDateChange(new Date())}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Hoy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-text-secondary border-r border-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {generateDays().map((day, idx) => {
          const dayReservations = getReservationsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={idx}
              className={cn(
                'border-r border-b border-border last:border-r-0 min-h-[100px]',
                !isCurrentMonth && 'bg-bg-primary/50'
              )}
            >
              <CalendarDay
                date={day}
                reservations={dayReservations}
                isCurrentMonth={isCurrentMonth}
                isSelected={!!isSelected}
                isToday={isDayToday}
                onClick={() => onDayClick(day)}
                onReservationClick={onReservationClick}
                currentUserId={currentUserId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
