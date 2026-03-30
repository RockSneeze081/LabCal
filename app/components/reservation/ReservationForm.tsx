'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Toggle } from '@/app/components/ui/toggle';
import { Button } from '@/app/components/ui/button';
import { ACTIVITY_TYPES, TIME_SLOTS } from '@/lib/utils';
import { ReservationFormData, ReservationWithUser } from './types';
import { Users, Lock } from 'lucide-react';

interface ReservationFormProps {
  date: Date;
  reservation?: ReservationWithUser | null;
  currentUserName: string;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isEditing?: boolean;
}

export function ReservationForm({
  date,
  reservation,
  currentUserName,
  onSubmit,
  onCancel,
  onDelete,
  isEditing = false,
}: ReservationFormProps) {
  const [formData, setFormData] = React.useState<ReservationFormData>({
    date: format(date, 'yyyy-MM-dd'),
    timeSlot: reservation?.timeSlot || 'morning',
    activityType: reservation?.activityType || 'revelado',
    notes: reservation?.notes || '',
    allowsCompany: reservation?.allowsCompany || false,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData({
      date: format(date, 'yyyy-MM-dd'),
      timeSlot: reservation?.timeSlot || 'morning',
      activityType: reservation?.activityType || 'revelado',
      notes: reservation?.notes || '',
      allowsCompany: reservation?.allowsCompany || false,
    });
  }, [date, reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const activityOptions = Object.entries(ACTIVITY_TYPES).map(([value, { label }]) => ({
    value,
    label,
  }));

  const timeSlotOptions = Object.entries(TIME_SLOTS).map(([value, { label, time }]) => ({
    value,
    label: `${label} (${time})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-950 border border-red-800 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Fecha"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <Select
        label="Franja horaria"
        value={formData.timeSlot}
        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as 'morning' | 'afternoon' })}
        options={timeSlotOptions}
        required
      />

      <Select
        label="Tipo de actividad"
        value={formData.activityType}
        onChange={(e) => setFormData({ ...formData, activityType: e.target.value as ReservationFormData['activityType'] })}
        options={activityOptions}
        required
      />

      <Textarea
        label="Notas (opcional)"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Describe brevemente tu actividad..."
        rows={3}
      />

      <div className="p-3 bg-bg-tertiary rounded-md border border-border">
        <Toggle
          checked={formData.allowsCompany}
          onChange={(checked) => setFormData({ ...formData, allowsCompany: checked })}
          label="Permitir compañía"
          description={
            formData.allowsCompany
              ? 'Otros usuarios pueden reservar este horario'
              : 'Solo tú ocuparás el laboratorio'
          }
        />
        <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
          {formData.allowsCompany ? (
            <>
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Reserva compartida</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Reserva privada - bloquea el horario</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          {isEditing && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={onDelete}
              disabled={loading}
            >
              Eliminar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Guardar cambios' : 'Crear reserva'}
          </Button>
        </div>
      </div>
    </form>
  );
}
