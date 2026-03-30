'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ACTIVITY_TYPE_COLORS } from '@/lib/utils';
import { ReservationWithUser } from '@/app/components/reservation/types';
import { Users, Lock } from 'lucide-react';

interface CalendarDayProps {
  date: Date;
  reservations: ReservationWithUser[];
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
  onReservationClick: (reservation: ReservationWithUser) => void;
  currentUserId: string | null;
}

export function CalendarDay({
  date,
  reservations,
  isCurrentMonth,
  isSelected,
  isToday,
  onClick,
  onReservationClick,
  currentUserId,
}: CalendarDayProps) {
  const morningReservations = reservations.filter((r) => r.timeSlot === 'morning');
  const afternoonReservations = reservations.filter((r) => r.timeSlot === 'afternoon');
  
  const maxVisiblePerSlot = 2;

  const hasConflict = reservations.some((r) => !r.allowsCompany);

  return (
    <div
      className={cn(
        'h-full p-1 cursor-pointer transition-colors hover:bg-bg-tertiary',
        isSelected && 'bg-bg-tertiary ring-1 ring-inset ring-accent-red',
        !isCurrentMonth && 'opacity-40'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between px-1 pt-1">
        <span
          className={cn(
            'inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full',
            isToday && 'bg-accent-red text-white',
            !isToday && 'text-text-primary'
          )}
        >
          {format(date, 'd')}
        </span>
        {hasConflict && (
          <Lock className="w-3 h-3 text-red-500" />
        )}
      </div>

      <div className="mt-1 space-y-0.5">
        {morningReservations.length > 0 && (
          <div className="space-y-0.5">
            {morningReservations.slice(0, maxVisiblePerSlot).map((r) => (
              <div
                key={r.id}
                className={cn(
                  'px-1 py-0.5 text-xs rounded truncate cursor-pointer transition-transform hover:scale-[1.02]',
                  ACTIVITY_TYPE_COLORS[r.activityType]?.bg,
                  ACTIVITY_TYPE_COLORS[r.activityType]?.text
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onReservationClick(r);
                }}
              >
                <div className="flex items-center gap-1">
                  {!r.allowsCompany ? (
                    <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                  ) : (
                    <Users className="w-2.5 h-2.5 flex-shrink-0" />
                  )}
                  <span className="truncate">{r.user.name}</span>
                </div>
              </div>
            ))}
            {morningReservations.length > maxVisiblePerSlot && (
              <div className="text-xs text-text-muted px-1">
                +{morningReservations.length - maxVisiblePerSlot} más
              </div>
            )}
          </div>
        )}

        {afternoonReservations.length > 0 && (
          <div className="space-y-0.5">
            {afternoonReservations.slice(0, maxVisiblePerSlot).map((r) => (
              <div
                key={r.id}
                className={cn(
                  'px-1 py-0.5 text-xs rounded truncate cursor-pointer transition-transform hover:scale-[1.02]',
                  ACTIVITY_TYPE_COLORS[r.activityType]?.bg,
                  ACTIVITY_TYPE_COLORS[r.activityType]?.text
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onReservationClick(r);
                }}
              >
                <div className="flex items-center gap-1">
                  {!r.allowsCompany ? (
                    <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                  ) : (
                    <Users className="w-2.5 h-2.5 flex-shrink-0" />
                  )}
                  <span className="truncate">{r.user.name}</span>
                </div>
              </div>
            ))}
            {afternoonReservations.length > maxVisiblePerSlot && (
              <div className="text-xs text-text-muted px-1">
                +{afternoonReservations.length - maxVisiblePerSlot} más
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
