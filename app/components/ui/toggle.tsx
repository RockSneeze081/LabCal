'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-bg-primary',
          checked ? 'bg-accent-red' : 'bg-bg-tertiary border border-border'
        )}
      >
        <span
          className={cn(
            'inline-flex h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0.5',
            'mt-0.5'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-text-primary">{label}</span>
          )}
          {description && (
            <span className="text-xs text-text-muted">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
