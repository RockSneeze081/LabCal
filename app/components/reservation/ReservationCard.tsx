'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ACTIVITY_TYPES, TIME_SLOTS } from '@/lib/utils';
import { Badge, StatusBadge } from '@/app/components/ui/badge';
import { ReservationWithUser } from './types';
import { Edit2, Trash2, Users, Lock } from 'lucide-react';

interface ReservationCardProps {
  reservation: ReservationWithUser;
  isOwn: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function ReservationCard({
  reservation,
  isOwn,
  onEdit,
  onDelete,
  compact = false,
}: ReservationCardProps) {
  const activityInfo = ACTIVITY_TYPES[reservation.activityType as keyof typeof ACTIVITY_TYPES];
  const timeSlotInfo = TIME_SLOTS[reservation.timeSlot as keyof typeof TIME_SLOTS];

  const activityVariant = reservation.activityType as 'revelado' | 'ampliacion' | 'contactos' | 'otro';

  return (
    <div
      className={cn(
        'bg-bg-secondary rounded-lg border transition-all',
        reservation.allowsCompany ? 'border-blue-800' : 'border-red-800',
        !compact && 'p-3',
        compact && 'px-2 py-1.5'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={activityVariant} size="sm">
              {activityInfo?.label}
            </Badge>
            <StatusBadge
              status={reservation.allowsCompany ? 'shared' : 'occupied'}
              label={reservation.allowsCompany ? 'Compartido' : 'Privado'}
            />
          </div>
          
          {!compact && (
            <>
              <p className="mt-2 font-medium text-text-primary">{reservation.user.name}</p>
              <p className="text-sm text-text-secondary mt-1">
                {timeSlotInfo?.label} ({timeSlotInfo?.time})
              </p>
              {reservation.notes && (
                <p className="text-sm text-text-muted mt-2 line-clamp-2">
                  {reservation.notes}
                </p>
              )}
            </>
          )}

          {compact && (
            <p className="text-xs text-text-secondary mt-1 truncate">
              {reservation.user.name} · {timeSlotInfo?.label}
            </p>
          )}
        </div>

        {isOwn && !compact && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-950/50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
        {reservation.allowsCompany ? (
          <Users className="w-3 h-3" />
        ) : (
          <Lock className="w-3 h-3" />
        )}
        <span>
          {format(new Date(reservation.date), 'EEEE, d MMM', { locale: require('date-fns/locale/es') })}
        </span>
      </div>
    </div>
  );
}
