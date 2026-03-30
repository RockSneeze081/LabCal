'use client';

import * as React from 'react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Camera, LogOut, Plus, Filter, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Modal } from '@/app/components/ui/modal';
import { useToast, ToastProvider } from '@/app/components/ui/toast';
import { CalendarGrid } from '@/app/components/calendar/CalendarGrid';
import { ReservationForm } from '@/app/components/reservation/ReservationForm';
import { ReservationCard } from '@/app/components/reservation/ReservationCard';
import { ACTIVITY_TYPES, ACTIVITY_TYPE_COLORS } from '@/lib/utils';
import { ReservationWithUser, User, ReservationFormData } from '@/app/components/reservation/types';

function LabCalApp() {
  const { showToast } = useToast();
  
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loginName, setLoginName] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  
  const [reservations, setReservations] = React.useState<ReservationWithUser[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingReservation, setEditingReservation] = React.useState<ReservationWithUser | null>(null);
  
  const [filters, setFilters] = React.useState({
    activities: [] as string[],
    userId: null as string | null,
  });
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('labcal_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchReservations();
    fetchUsers();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (error) {
      showToast('Error al cargar reservas', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: loginName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Error al iniciar sesión');
        return;
      }

      setCurrentUser(data.user);
      localStorage.setItem('labcal_user', JSON.stringify(data.user));
      setLoginName('');
      showToast(`Bienvenido/a, ${data.user.name}!`, 'success');
    } catch (error) {
      setLoginError('Error de conexión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      localStorage.removeItem('labcal_user');
      showToast('Sesión cerrada', 'info');
    } catch (error) {
      showToast('Error al cerrar sesión', 'error');
    }
  };

  const handleCreateReservation = async (data: ReservationFormData) => {
    const url = editingReservation 
      ? `/api/reservations/${editingReservation.id}`
      : '/api/reservations';
    
    const method = editingReservation ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Error al guardar reserva');
    }

    await fetchReservations();
    setIsCreateModalOpen(false);
    setEditingReservation(null);
    showToast(
      editingReservation ? 'Reserva actualizada' : 'Reserva creada',
      'success'
    );
  };

  const handleDeleteReservation = async () => {
    if (!editingReservation) return;

    const confirmed = window.confirm('¿Eliminar esta reserva?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      await fetchReservations();
      setIsCreateModalOpen(false);
      setEditingReservation(null);
      showToast('Reserva eliminada', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error', 'error');
    }
  };

  const handleDayClick = (date: Date) => {
    if (!currentUser) return;
    setSelectedDate(date);
    setEditingReservation(null);
    setIsCreateModalOpen(true);
  };

  const handleReservationClick = (reservation: ReservationWithUser) => {
    if (!currentUser) return;
    setSelectedDate(new Date(reservation.date));
    setEditingReservation(reservation);
    setIsCreateModalOpen(true);
  };

  const todayReservations = reservations.filter((r) => isToday(new Date(r.date)));
  const selectedDateReservations = selectedDate
    ? reservations.filter((r) => {
        const rDate = new Date(r.date);
        return (
          rDate.getDate() === selectedDate.getDate() &&
          rDate.getMonth() === selectedDate.getMonth() &&
          rDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  const toggleActivityFilter = (activity: string) => {
    setFilters((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-red/20 mb-4">
              <Camera className="w-8 h-8 text-accent-red" />
            </div>
            <h1 className="text-3xl font-mono font-bold text-text-primary">LabCal</h1>
            <p className="text-text-secondary mt-2">
              Reserva tu espacio en el laboratorio fotográfico
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Tu nombre"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              error={loginError || undefined}
            />
            <Button type="submit" className="w-full" loading={isLoggingIn}>
              Entrar
            </Button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6">
            AFC, Laboratorio Analógico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-red/20">
              <Camera className="w-5 h-5 text-accent-red" />
            </div>
            <span className="text-xl font-mono font-bold text-text-primary">LabCal</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={filters.activities.length > 0 || filters.userId ? 'text-accent-red' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {filters.activities.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-accent-red text-white text-xs rounded">
                  {filters.activities.length}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-tertiary rounded-md">
              <div className="w-7 h-7 bg-accent-red rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-text-primary">{currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="p-1 text-text-muted hover:text-text-primary transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="px-4 py-3 border-t border-border bg-bg-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Actividades</span>
              {(filters.activities.length > 0 || filters.userId) && (
                <button
                  onClick={() => setFilters({ activities: [], userId: null })}
                  className="text-xs text-accent-red hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => toggleActivityFilter(key)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    filters.activities.includes(key)
                      ? 'bg-accent-red text-white border-accent-red'
                      : 'bg-bg-tertiary text-text-secondary border-border hover:border-text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="lg:w-72 bg-bg-secondary border-r border-border p-4 space-y-4">
          <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
            <h3 className="font-mono font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Hoy en el lab
            </h3>
            {todayReservations.length === 0 ? (
              <p className="text-sm text-text-muted">Sin reservas para hoy</p>
            ) : (
              <div className="space-y-2">
                {todayReservations.slice(0, 5).map((r) => (
                  <ReservationCard
                    key={r.id}
                    reservation={r}
                    isOwn={r.userId === currentUser.id}
                    compact
                  />
                ))}
                {todayReservations.length > 5 && (
                  <p className="text-xs text-text-muted">
                    +{todayReservations.length - 5} más
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
            <h3 className="font-mono font-semibold text-text-primary mb-3">Leyenda</h3>
            <div className="space-y-2">
              {Object.entries(ACTIVITY_TYPES).map(([key, { label }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded ${ACTIVITY_TYPE_COLORS[key]?.bg}`}
                  />
                  <span className="text-xs text-text-secondary">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Lock className="w-3 h-3 text-red-400" />
                <span className="text-xs text-text-secondary">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-text-secondary">Compartido</span>
              </div>
            </div>
          </div>

          {selectedDate && selectedDateReservations.length > 0 && (
            <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
              <h3 className="font-mono font-semibold text-text-primary mb-3">
                {format(selectedDate, 'EEEE, d MMM', { locale: es })}
              </h3>
              <div className="space-y-2">
                {selectedDateReservations.map((r) => (
                  <ReservationCard
                    key={r.id}
                    reservation={r}
                    isOwn={r.userId === currentUser.id}
                    compact
                    onEdit={() => handleReservationClick(r)}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="bg-bg-primary rounded-lg border border-border overflow-hidden flex-1">
            <CalendarGrid
              reservations={reservations}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onDayClick={handleDayClick}
              onReservationClick={handleReservationClick}
              selectedDate={selectedDate}
              filters={filters}
              currentUserId={currentUser.id}
            />
          </div>
        </main>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingReservation(null);
        }}
        title={editingReservation ? 'Editar reserva' : 'Nueva reserva'}
      >
        {selectedDate && (
          <ReservationForm
            date={selectedDate}
            reservation={editingReservation}
            currentUserName={currentUser.name}
            onSubmit={handleCreateReservation}
            onCancel={() => {
              setIsCreateModalOpen(false);
              setEditingReservation(null);
            }}
            onDelete={editingReservation ? handleDeleteReservation : undefined}
            isEditing={!!editingReservation}
          />
        )}
      </Modal>

      <button
        onClick={() => {
          setSelectedDate(new Date());
          setEditingReservation(null);
          setIsCreateModalOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-red hover:bg-accent-red-glow text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 darkroom-glow"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <LabCalApp />
    </ToastProvider>
  );
}
