# LabCal - Sistema de Reservas para Laboratorio Fotográfico Analógico

## 1. Concepto & Visión

LabCal es un calendario colaborativo minimalista para fotógrafos analógicos que comparten un laboratorio oscuro. La experiencia evoca la atmósfera íntima de un cuarto oscuro: rojo oscuro, sombras suaves, precisión técnica. Es donde la nostalgia analógica se encuentra con la eficiencia digital moderna.

La interfaz transmite calma y concentración, como el momento antes de revelar una imagen latente.

## 2. Design Language

### Aesthetic Direction
Inspiración: Interfaz de software de cuarto oscuro (Darkroom Timer apps) mezclada con la limpieza de Notion. Oscuro pero cálido, técnico pero accesible.

### Color Palette
```
--bg-primary: #0D0D0D        // Negro profundo (fondo principal)
--bg-secondary: #1A1A1A     // Gris muy oscuro (cards, paneles)
--bg-tertiary: #262626      // Gris oscuro (hover states)
--border: #333333           // Bordes sutiles
--text-primary: #F5F5F5     // Blanco cálido (texto principal)
--text-secondary: #A3A3A3   // Gris claro (texto secundario)
--text-muted: #737373       // Gris medio (placeholders)

--accent-red: #DC2626       // Rojo oscuro (darkroom, acciones principales)
--accent-red-glow: #EF4444  // Rojo brillante (hover del rojo)
--accent-amber: #F59E0B    // Ámbar (advertencias, ocupado)

--status-available: #22C55E // Verde (disponible)
--status-occupied: #EF4444  // Rojo (ocupado sin compañía)
--status-shared: #3B82F6    // Azul (compartido/con compañía)
--status-pending: #A855F7   // Púrpura (pendiente de confirmación)
```

### Activity Type Colors
```
--activity-revelado: #DC2626     // Rojo oscuro (negativos)
--activity-ampliacion: #F59E0B  // Ámbar (copias en papel)
--activity-contactos: #8B5CF6    // Violeta (hoja de contactos)
--activity-otro: #6B7280         // Gris (otro)
```

### Typography
- **Headings**: JetBrains Mono (monospace, técnico)
- **Body**: Inter (limpio, legible)
- **Fallbacks**: system-ui, -apple-system, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 6px (small), 8px (medium), 12px (large)
- Card shadows: 0 4px 6px rgba(0,0,0,0.4)

### Motion Philosophy
- Transiciones suaves: 150ms ease-out (micro), 300ms ease-out (macro)
- Hover states: scale(1.02) con sombra
- Modales: fade-in con slide-up sutil
- Calendario: transición entre semanas/meses con fade
- Toast notifications: slide-in desde arriba derecha

### Visual Assets
- **Icons**: Lucide React (línea fina, consistente)
- **Decorative**: Líneas rojas inspiradas en cuarto oscuro
- **Empty states**: Ilustraciones minimalistas en línea

## 3. Layout & Structure

### Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Logo + User badge + Navigation)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │  SIDEBAR    │  │  MAIN CONTENT                       │   │
│  │  - Filtros  │  │  - Calendar View (Week/Month)       │   │
│  │  - Stats    │  │  - Reservation Modal                 │   │
│  │  - Legend   │  │  - Reservation List                  │   │
│  │  - Today    │  │                                     │   │
│  └─────────────┘  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- Desktop (>1024px): Sidebar + Calendar lado a lado
- Tablet (768-1024px): Sidebar colapsable
- Mobile (<768px): Sidebar como drawer, calendario en vista semanal

### Visual Pacing
- Header: Compacto, siempre visible
- Sidebar: Información densa pero organizada
- Calendar: Protagonista visual, máximo espacio
- Modals: Centrados, con overlay oscuro

## 4. Features & Interactions

### Core Features

#### 4.1 Autenticación Simple
- Input para nombre de usuario
- Botón "Entrar" o presionar Enter
- Sesión guardada en localStorage/cookie
- Botón "Cerrar sesión" en header
- Validación: nombre no vacío, sin caracteres especiales extremos

#### 4.2 Calendario Semanal/Mensual
- Toggle entre vista semanal y mensual
- Navegación: flechas < > para cambiar semana/mes
- Botón "Hoy" para volver al momento actual
- Ver mes actual destacado en vista semanal
- Click en día abre modal de creación (día seleccionado)
- Click en reserva existente abre modal de edición

#### 4.3 Crear Reserva
- **Campos obligatorios**:
  - Fecha (seleccionada o actual)
  - Franja horaria: Mañana (8:00-14:00) / Tarde (14:00-20:00)
  - Nombre del usuario (pre-llenado si logueado)
- **Campos opcionales**:
  - Tipo de actividad (dropdown)
  - Notas (textarea corto)
  - Permite compañía (toggle booleano, default: false)
- **Validación en tiempo real**:
  - Verificar disponibilidad antes de enviar
  - Mostrar error si conflicto (reserva sin compañía existente)

#### 4.4 Ver Reservas
- Lista de reservas del día seleccionado
- Cards con:
  - Nombre de usuario
  - Tipo de actividad (con color)
  - Franja horaria
  - Badge de compañía (🔒 privado / 🤝 compartido)
  - Acciones: Editar / Eliminar (solo propias)

#### 4.5 Editar/Eliminar Reserva
- Modal con campos pre-llenados
- Solo puede editar/eliminar el creador
- Confirmación antes de eliminar
- Al editar, re-validar conflictos

#### 4.6 Filtros
- Por tipo de actividad (checkboxes)
- Por usuario (dropdown)
- Filtros claros con opción "Limpiar filtros"

#### 4.7 "Quién está hoy"
- Panel en sidebar mostrando:
  - Lista de personas con reserva hoy
  - Tipo de actividad
  - Franja horaria
  - Indicador de compañía

### Interaction Details

#### Hover States
- Días del calendario: bg-tertiary, cursor pointer
- Reservas: scale(1.02), sombra más pronunciada
- Botones: cambio de color con transición

#### Click Feedback
- Ripple effect sutil en botones
- Feedback visual inmediato

#### Loading States
- Skeleton loaders para calendario
- Spinner en botones de acción
- Toast de "Guardando..." en submits

#### Error States
- Toast rojo con mensaje de error
- Inline errors en formularios
- Campo con borde rojo + mensaje debajo

#### Empty States
- Calendario vacío: "No hay reservas. ¡Sé el primero!"
- Búsqueda sin resultados: "No hay coincidencias"

## 5. Component Inventory

### 5.1 Header
- Logo: "LabCal" con icono de cámara estenopeica estilizado
- User badge: avatar con inicial + nombre
- Botón logout (X icon)
- Estados: logged-in, logged-out

### 5.2 Sidebar
- Título: "Filtros"
- Filtro de actividad (checkboxes con colores)
- Leyenda de colores
- Panel "Hoy en el lab" (sticky)
- Estados: expanded, collapsed (mobile)

### 5.3 CalendarGrid
- Header con días de semana
- Grid de celdas por día
- Indicadores de reserva (mini cards)
- Estados: loading, empty, populated

### 5.4 CalendarDay (celda individual)
- Número de día
- Indicadores de reserva (max 3 visibles + "+N")
- Hover: highlight
- Estados: default, today, selected, has-reservations, empty

### 5.5 ReservationCard
- Tipo de actividad (badge con color)
- Nombre de usuario
- Franja horaria
- Badge de compañía
- Estados: own, others, editable

### 5.6 Modal (base)
- Overlay oscuro
- Card centrada
- Header con título y X
- Body con formulario/contenido
- Footer con acciones
- Estados: closed, open, loading

### 5.7 ReservationForm
- Input nombre (disabled si logueado)
- Select actividad
- Toggle compañía
- Textarea notas
- Select franja horaria
- Botones: Cancelar, Guardar
- Estados: empty, filled, submitting, error

### 5.8 Toast
- Icono según tipo (success, error, info)
- Mensaje
- Auto-dismiss en 4s
- Botón X para cerrar
- Estados: success, error, info, warning

### 5.9 EmptyState
- Ilustración SVG minimalista
- Título
- Descripción
- CTA button (opcional)

## 6. Technical Approach

### Framework & Architecture
```
/
├── app/
│   ├── layout.tsx              # Root layout con providers
│   ├── page.tsx                # Página principal (calendario)
│   ├── globals.css             # Tailwind + custom styles
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/route.ts  # Login simple
│   │   ├── reservations/
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   └── [id]/route.ts   # GET, PUT, DELETE
│   │   └── users/
│   │       └── route.ts        # GET, POST (simple)
│   └── components/
│       ├── ui/                 # Componentes base
│       ├── calendar/           # Componentes de calendario
│       └── reservation/        # Componentes de reserva
├── lib/
│   ├── prisma.ts               # Cliente Prisma
│   ├── auth.ts                 # Utilidades de auth
│   └── utils.ts                # Helpers
├── prisma/
│   ├── schema.prisma           # Modelos de datos
│   └── seed.ts                 # Datos de ejemplo
├── components.json             # shadcn/ui config
├── docker-compose.yml          # Orquestación
├── Dockerfile                  # Imagen de la app
└── .env.example                # Variables de entorno
```

### Data Model (Prisma)

```prisma
model User {
  id           String        @id @default(cuid())
  name         String        @unique
  createdAt    DateTime      @default(now())
  reservations Reservation[]
}

model Reservation {
  id           String   @id @default(cuid())
  date         DateTime @db.Date
  timeSlot     String   // "morning" | "afternoon"
  activityType String   // "revelado" | "ampliacion" | "contactos" | "otro"
  notes        String?
  allowsCompany Boolean  @default(false)
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([date, timeSlot, userId])
  @@index([date])
}
```

### API Design

#### POST /api/auth/login
```typescript
Request: { name: string }
Response: { user: User, token: string }
```

#### GET /api/reservations
```typescript
Query: { date?: string, month?: string, userId?: string, activity?: string }
Response: { reservations: Reservation[] }
```

#### POST /api/reservations
```typescript
Request: {
  date: string,
  timeSlot: "morning" | "afternoon",
  activityType: string,
  notes?: string,
  allowsCompany: boolean
}
Response: { reservation: Reservation }
Errors: 409 Conflict (overlapping reservation)
```

#### PUT /api/reservations/[id]
```typescript
Request: { ...same as POST }
Response: { reservation: Reservation }
```

#### DELETE /api/reservations/[id]
```typescript
Response: { success: true }
```

### Business Logic

#### Conflict Detection
```typescript
async function checkConflict(date, timeSlot, allowsCompany) {
  const existing = await prisma.reservation.findFirst({
    where: { date, timeSlot }
  });
  
  if (!existing) return { canBook: true };
  
  // Si la reserva existente no permite compañía, bloquear
  if (!existing.allowsCompany) {
    return { canBook: false, reason: "Reserva existente sin opción de compañía" };
  }
  
  // Si la nueva reserva no permite compañía, bloquear
  if (!allowsCompany) {
    return { canBook: false, reason: "Debes permitir compañía para esta franja" };
  }
  
  // Ambos permiten compañía, permitir múltiples
  return { canBook: true };
}
```

### Authentication Strategy
- Session basada en cookies HTTP-only
- Middleware para proteger rutas
- Nombre de usuario como identificador simple
- No contraseña (confianza entre usuarios del club)

### Validation (Zod)
```typescript
const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.enum(["morning", "afternoon"]),
  activityType: z.enum(["revelado", "ampliacion", "contactos", "otro"]),
  notes: z.string().optional(),
  allowsCompany: z.boolean()
});
```

## 7. Docker Configuration

### Dockerfile
- Imagen base: node:20-alpine
- Instalar dependencias
- Build de Next.js
- Puerto 3000 expuesto

### docker-compose.yml
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/labcal
    depends_on:
      - db
    volumes:
      - .env:/app/.env

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=labcal
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## 8. Seed Data

Usuarios de ejemplo:
- Ana Fotógrafa
- Carlos Revelador
- María Ampliadora
- Pablo Contactos
- Lucía Analógica

Reservas variadas durante las próximas 2 semanas para demostrar funcionalidad.
