# LabCal - Sistema de Reservas para Laboratorio Fotográfico

Calendario colaborativo para gestionar reservas de un laboratorio fotográfico analógico.

![LabCal Screenshot](https://via.placeholder.com/800x400?text=LabCal+-+Dark+Room+Calendar)

## Características

- Calendario mensual interactivo
- Sistema de reservas con franjas horarias (mañana/tarde)
- Tipos de actividad: Revelado, Ampliación, Hoja de contactos, Otro
- Gestión de compañía: privado (bloquea horario) o compartido
- Filtros por tipo de actividad
- Panel "Hoy en el lab"
- Autenticación simple por nombre
- Interfaz oscura estilo darkroom

## Stack Técnico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: TailwindCSS
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod
- **Contenerización**: Docker + Docker Compose

## Requisitos

- Docker y Docker Compose
- Git

## Instalación Rápida (Docker)

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd LabCal
```

2. Copiar variables de entorno:
```bash
cp .env.example .env
```

3. Iniciar con Docker Compose:
```bash
docker-compose up --build
```

4. La aplicación estará disponible en: http://localhost:3000

## Instalación Manual (Desarrollo)

### Requisitos
- Node.js 20+
- PostgreSQL 15+
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd LabCal
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar base de datos PostgreSQL y crear archivo `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/labcal"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Generar cliente Prisma y crear tablas:
```bash
npm run db:generate
npm run db:push
```

5. Poblar con datos de ejemplo:
```bash
npm run db:seed
```

6. Iniciar servidor de desarrollo:
```bash
npm run dev
```

7. Abrir http://localhost:3000

## API Endpoints

### Autenticación
```
POST /api/auth/login
Body: { "name": "nombre_usuario" }

POST /api/auth/logout
```

### Reservas
```
GET /api/reservations
Query: ?date=2024-01-15&month=2024-01&userId=xxx&activity=revelado

POST /api/reservations
Body: { date, timeSlot, activityType, notes, allowsCompany }

GET /api/reservations/[id]

PUT /api/reservations/[id]
Body: { date, timeSlot, activityType, notes, allowsCompany }

DELETE /api/reservations/[id]
```

### Usuarios
```
GET /api/users
```

## Lógica de Reservas

### Conflictos
- Una reserva **privada** (sin compañía) bloquea completamente el horario
- Una reserva **compartida** permite múltiples usuarios en la misma franja
- Para reservar en una franja con reservas compartidas, debes aceptar compañía

### Franjas Horarias
- **Mañana**: 08:00 - 14:00
- **Tarde**: 14:00 - 20:00

## Uso

1. **Iniciar sesión**: Ingresa tu nombre para acceder
2. **Ver calendario**: Navega entre meses con las flechas
3. **Crear reserva**: Haz clic en "+" o en un día
4. **Editar/Eliminar**: Solo tus propias reservas
5. **Filtrar**: Usa los filtros por tipo de actividad

## Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run start        # Iniciar producción
npm run lint         # Linting
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema
npm run db:seed      # Poblar datos ejemplo
npm run db:studio    # Abrir Prisma Studio
```

## Docker Commands

```bash
# Iniciar
docker-compose up --build

# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Ver logs
docker-compose logs -f app

# Recrear base de datos
docker-compose down -v && docker-compose up --build
```

## Estructura del Proyecto

```
/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Login/Logout
│   │   ├── reservations/ # CRUD reservas
│   │   └── users/        # Gestión usuarios
│   ├── components/       # Componentes React
│   │   ├── ui/           # Componentes base
│   │   ├── calendar/     # Calendario
│   │   └── reservation/  # Formularios reserva
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── lib/
│   ├── auth.ts           # Utilidades auth
│   ├── prisma.ts         # Cliente Prisma
│   ├── utils.ts          # Helpers
│   └── validations.ts    # Schemas Zod
├── prisma/
│   ├── schema.prisma     # Modelos datos
│   └── seed.ts           # Datos ejemplo
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Licencia

MIT
