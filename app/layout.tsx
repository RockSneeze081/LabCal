import type { Metadata } from 'next';
import { ToastProvider } from '@/app/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'LabCal - Reservas de Laboratorio Fotográfico',
  description: 'Calendario colaborativo para reservar el laboratorio oscuro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-bg-primary">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
