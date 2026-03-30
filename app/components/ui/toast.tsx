'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styles = {
    success: 'bg-green-900/90 border-green-700 text-green-200',
    error: 'bg-red-900/90 border-red-700 text-red-200',
    info: 'bg-blue-900/90 border-blue-700 text-blue-200',
    warning: 'bg-amber-900/90 border-amber-700 text-amber-200',
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl animate-slide-in-right',
        styles[type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:opacity-70 transition-opacity ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<{ message: string; type: ToastType } | null>(null);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
