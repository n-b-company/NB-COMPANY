# IA CONTEXT — NB COMPANY

> Este archivo provee contexto completo del proyecto para que la IA entienda la arquitectura, modelos, flujos y convenciones antes de hacer cualquier cambio.

---

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router) con React 19
- **Lenguaje**: TypeScript
- **Base de datos**: MongoDB via **Prisma ORM** (`@prisma/client ^6`)
- **Estilos**: Tailwind CSS v4
- **Formularios**: `react-hook-form` + `zod` para validación
- **Auth**: JWT con `jose`, sesión en cookie `httpOnly` de 24h
- **Storage de imágenes**: AWS S3 / Cloudflare R2 (`@aws-sdk/client-s3`)
- **Iconos**: `lucide-react`
- **Notificaciones**: `sonner`
- **PDF / Comprobantes**: `jspdf` + `html-to-image`
- **Tour guiado**: `driver.js`
- **Package manager**: `pnpm`

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (main)/               # Layout autenticado (AppHeader + BottomNavbar)
│   │   ├── dashboard/        # Página principal con stats
│   │   ├── clientes/         # Lista de clientes
│   │   ├── cliente/[id]/     # Detalle de cliente
│   │   ├── cobros/           # Gestión de cobros
│   │   ├── nueva-instalacion/# Alta de cliente + instalación
│   │   ├── mapa/             # Vista de mapa
│   │   └── perfil/           # Perfil del usuario
│   ├── comprobante/          # Generación de comprobante PDF
│   ├── login/                # Autenticación
│   ├── public/[id]/          # Vista pública compartible (sin auth)
│   └── page.tsx              # Redirect a /dashboard
├── components/
│   ├── ui/                   # Componentes reutilizables (EntityCard, SearchBar, etc.)
│   ├── cliente/              # Componentes del detalle de cliente
│   ├── public/               # Vista pública del cliente
│   ├── AppHeader.tsx
│   ├── BottomNavbar.tsx
│   ├── ClientesClient.tsx
│   ├── CobrosClient.tsx
│   └── DashboardClient.tsx
├── lib/
│   ├── actions.ts            # Server Actions (Next.js)
│   ├── auth.ts               # JWT + sesión
│   ├── prisma.ts             # Singleton de Prisma
│   ├── upload.ts             # Upload a R2/S3
│   ├── share-token.ts        # Token JWT para links públicos (24h)
│   ├── validations.ts        # Schemas Zod
│   └── utils/
│       └── status-calculator.ts  # Lógica de estado dinámico
├── constants/
│   ├── constants.ts          # STATUS_MAP, NAV_ITEMS, ASSETS, estilos
│   └── mockData.ts
└── types/
    └── index.ts              # Tipos TypeScript globales
```

---

## Modelos de Base de Datos (Prisma / MongoDB)

### User
| Campo | Tipo | Notas |
|-------|------|-------|
| id | ObjectId | Auto |
| username | String | Único |
| password | String | Hasheado |
| name | String | |
| role | Role | ADMIN \| TECHNICIAN |
| profileImage | String? | URL o base64 |

### Client
| Campo | Tipo | Notas |
|-------|------|-------|
| id | ObjectId | |
| name | String | Nombre del comercio |
| ownerName | String? | Nombre del responsable |
| phone | String? | |
| address | String | |
| between | String? | Entre calles |
| status | ClientStatus | ACTIVE \| OVERDUE \| WARNING \| INACTIVE |
| notes | String? | |
| latitude/longitude | Float? | Coordenadas GPS |
| imageUrl | String? | Foto del local |
| dniFront/dniBack | String? | Fotos del DNI |
| serviceCost | Float? | Costo mensual del servicio |

### Installation
| Campo | Tipo | Notas |
|-------|------|-------|
| clientId | ObjectId | FK → Client |
| equipmentCount | Int | Cantidad de equipos |
| ipPorts | String[] | Ej: ["192.168.1.1:8080"] |
| techNotes | String? | |
| installedAt | DateTime | |

### Payment
| Campo | Tipo | Notas |
|-------|------|-------|
| clientId | ObjectId | FK → Client |
| amount | Float | |
| currency | String | Default "ARS" |
| status | PaymentStatus | PAID \| PENDING \| REJECTED \| CANCELLED |
| method | PaymentMethod | CASH \| TRANSFER \| DEBIT_CARD \| CREDIT_CARD |
| referenceId | String? | |
| description | String? | Ej: "Renovación Mayo 2024" |
| paidAt | DateTime? | |
| period | DateTime? | Mes que cubre el pago |

---

## Lógica de Estado Dinámico de Clientes

El estado del cliente **no se guarda estáticamente** (salvo INACTIVE). Se calcula en runtime con `calculateDynamicStatus()`:

1. Si `status === 'INACTIVE'` → retorna INACTIVE (tiene prioridad)
2. Busca el último pago con `status === 'PAID'` y toma su `period`
3. Si no hay pagos, usa `installedAt` de la primera instalación
4. Calcula `expirationDate = baseDate + 1 mes`
5. Compara con hoy:
   - `daysUntilExpiration < 0` → **OVERDUE**
   - `daysUntilExpiration <= 5` → **WARNING**
   - `daysUntilExpiration > 5` → **ACTIVE**

---

## Server Actions Principales (`src/lib/actions.ts`)

| Función | Descripción |
|---------|-------------|
| `createClientWithInstallation(data)` | Crea Client + Installation. Sube imágenes a R2 si son base64 |
| `updateClient(clientId, data)` | Actualiza Client + su Installation más reciente |
| `toggleClientStatus(clientId, currentStatus)` | Alterna entre ACTIVE e INACTIVE |
| `renewSubscription(clientId, amount)` | Crea Payment PAID, calcula el próximo periodo automáticamente |
| `getUserProfileImage()` | Obtiene imagen de perfil del usuario `nbadmin` |
| `updateProfileImage(imageData)` | Sube imagen a R2 o guarda base64, actualiza User |
| `generateShareLink(clientId)` | Genera JWT de 24h y retorna URL pública `/public/[id]?token=...` |

---

## Autenticación

- JWT firmado con `jose` (HS256), expiración 24h
- Sesión guardada en cookie `httpOnly` llamada `session`
- El middleware (`src/proxy.ts`) protege las rutas del grupo `(main)`
- La ruta `/public/[id]` es pública pero requiere token JWT en query param
- Usuario hardcodeado: `nbadmin` (TODO: multi-usuario)

---

## Convenciones de Código

- **Server Actions**: siempre `'use server'` al inicio, retornan `{ success: boolean, error?: string, data?: ... }`
- **Componentes Client**: sufijo `Client.tsx` o `'use client'` explícito
- **Validación**: Zod en `validations.ts`, se valida tanto en cliente (react-hook-form) como en servidor (actions)
- **Imágenes**: se capturan como base64 en el cliente, se suben a R2 en el servidor. Si falla R2, se guarda base64 directamente
- **Revalidación**: `revalidatePath()` solo en las rutas afectadas para minimizar escrituras
- **Estilos de estado**: usar `STATUS_MAP`, `STATUS_TEXT_MAP` y `STATUS_STYLES` de `constants.ts`
- **Navegación**: 5 ítems en `BottomNavbar` definidos en `NAV_ITEMS`

---

## Rutas de la App

| Ruta | Descripción |
|------|-------------|
| `/` | Redirect a `/dashboard` |
| `/login` | Login con usuario/contraseña |
| `/dashboard` | Stats generales (activos, warning, vencidos) |
| `/clientes` | Lista paginada y filtrable de clientes |
| `/cliente/[id]` | Detalle completo del cliente (tabs: info, historial, config) |
| `/cobros` | Gestión de cobros pendientes |
| `/nueva-instalacion` | Formulario de alta de cliente + instalación |
| `/mapa` | Mapa con ubicaciones de clientes |
| `/perfil` | Perfil del usuario admin |
| `/comprobante` | Generación de comprobante PDF |
| `/public/[id]` | Vista pública compartible (requiere token en query) |

---

## Variables de Entorno Necesarias

```env
DATABASE_URL=          # MongoDB connection string
AUTH_SECRET=           # Secret para JWT de sesión
NEXT_PUBLIC_BASE_URL=  # URL base del sitio (ej: https://nbcompany.com)
# Variables de R2/S3 para upload de imágenes
```
