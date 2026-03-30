'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-text-primary placeholder:text-text-muted resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent',
            'transition-all duration-150',
            error && 'border-red-600 focus:ring-red-600',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
