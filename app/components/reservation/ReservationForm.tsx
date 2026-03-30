'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Toggle } from '@/app/components/ui/toggle';
import { Button } from '@/app/components/ui/button';
import { ACTIVITY_TYPES, getTimeSlotsForDay } from '@/lib/utils';
import { ReservationFormData, ReservationWithUser } from './types';
import { Users, Lock, Check } from 'lucide-react';

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
    timeSlots: reservation?.timeSlots || [],
    activityType: reservation?.activityType || 'ampliacion',
    notes: reservation?.notes || '',
    allowsCompany: reservation?.allowsCompany ?? true,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData({
      date: format(date, 'yyyy-MM-dd'),
      timeSlots: reservation?.timeSlots || [],
      activityType: reservation?.activityType || 'ampliacion',
      notes: reservation?.notes || '',
      allowsCompany: reservation?.allowsCompany ?? true,
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

  const availableTimeSlots = getTimeSlotsForDay(date);

  const toggleTimeSlot = (slot: string) => {
    const newSlots = formData.timeSlots.includes(slot)
      ? formData.timeSlots.filter((s) => s !== slot)
      : [...formData.timeSlots, slot];
    setFormData({ ...formData, timeSlots: newSlots });
  };

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

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Franjas horarias
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(availableTimeSlots).map(([slot, slotInfo]) => {
            if (!slotInfo) return null;
            const { label } = slotInfo;
            const isSelected = formData.timeSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggleTimeSlot(slot)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md border transition-colors
                  ${isSelected
                    ? 'bg-accent-red/20 border-accent-red text-accent-red'
                    : 'bg-bg-secondary border-border text-text-secondary hover:border-accent-red/50'
                  }
                `}
              >
                <span className={`
                  w-5 h-5 rounded border flex items-center justify-center transition-colors
                  ${isSelected
                    ? 'bg-accent-red border-accent-red'
                    : 'border-border'
                  }
                `}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </span>
                {label}
              </button>
            );
          })}
        </div>
        {formData.timeSlots.length === 0 && (
          <p className="text-xs text-red-400 mt-1">Selecciona al menos una franja horaria</p>
        )}
      </div>

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
          <Button type="submit" loading={loading} disabled={formData.timeSlots.length === 0}>
            {isEditing ? 'Guardar cambios' : 'Crear reserva'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-red focus:border-accent-red"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
