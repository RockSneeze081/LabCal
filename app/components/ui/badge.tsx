import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'revelado' | 'ampliacion' | 'contactos' | 'otro';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-tertiary text-text-secondary border-border',
    revelado: 'bg-red-950 text-red-400 border-red-800',
    ampliacion: 'bg-amber-950 text-amber-400 border-amber-800',
    contactos: 'bg-purple-950 text-purple-400 border-purple-800',
    otro: 'bg-gray-900 text-gray-400 border-gray-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'available' | 'occupied' | 'shared';
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const styles = {
    available: 'bg-green-950/50 text-green-400 border-green-800',
    occupied: 'bg-red-950/50 text-red-400 border-red-800',
    shared: 'bg-blue-950/50 text-blue-400 border-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border',
        styles[status],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-green-400': status === 'available',
        'bg-red-400': status === 'occupied',
        'bg-blue-400': status === 'shared',
      })} />
      {label}
    </span>
  );
}
