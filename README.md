# NB COMPANY - Sistema de Gestión

Sistema integral de administración para proveedores de servicios de internet y redes. Gestiona clientes, instalaciones, cobros y monitorea el estado de la red en tiempo real.

![NB Company Dashboard Banner](https://via.placeholder.com/1200x400/09090b/2866eb?text=NB+COMPANY+DASHBOARD)

## 🚀 Características Principales

- **Dashboard Interactivo**: KPIs en tiempo real de clientes activos, por vencer y vencidos.
- **Gestión de Clientes**:
  - Perfiles completos con geolocalización.
  - Estado de cuenta automático (Activo/Alerta/Vencido).
  - Historial de pagos y renovaciones.
- **Sistema de Cobranzas**:
  - Cálculo automático de montos (Servicio x Equipos).
  - Generación de Tickets/Recibos en PDF.
  - Envío directo de comprobantes por WhatsApp.
- **Georreferencia**: Mapa interactivo con la ubicación de todas las instalaciones.
- **Guía de Usuario**: Tour interactivo para nuevos usuarios (`driver.js`).
- **Diseño Premium**: Interfaz moderna, oscura y responsiva (Mobile-First).

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Base de Datos**: [MongoDB](https://www.mongodb.com/) (vía [Prisma ORM](https://www.prisma.io/)).
- **UI Components**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/).
- **Utilidades**: `jspdf`, `html-to-image`, `zod`, `react-hook-form`.

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Base de datos MongoDB (URL de conexión)

### 1. Clonar el repositorio

```bash
git clone https://github.com/n-b-company/NB-COMPANY.git
cd nb-company
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente ejemplo:

```env
# Conexión a Base de Datos (MongoDB)
DATABASE_URL="mongodb+srv://usuario:password@cluster.mongodb.net/nb-company"

# Secretos de Autenticación
JWT_SECRET="tu_super_secreto_aqui"
```

### 4. Inicializar Base de Datos

Generar el cliente de Prisma:

```bash
npx prisma generate
```

### 5. Correr el servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 📜 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Construye la aplicación para producción (incluye generación de Prisma).
- `pnpm start`: Inicia el servidor de producción.
- `pnpm lint`: Ejecuta el linter para verificar el código.
- `pnpm format`: Formatea el código usando Prettier.

## 📂 Estructura del Proyecto

```
src/
├── app/              # Rutas de la aplicación (Next.js App Router)
│   ├── (auth)/       # Rutas de autenticación (Login)
│   ├── (main)/       # Rutas principales (Dashboard, Clientes, etc.)
│   └── comprobante/  # Vista de ticket (aislada)
├── components/       # Componentes de UI reutilizables
├── lib/              # Utilidades, configuraciones y Server Actions
├── types/            # Definiciones de tipos TypeScript
└── constants/        # Constantes globales
prisma/
└── schema.prisma     # Esquema de base de datos
```

## 🤝 Contribución

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  Haz Commit de tus cambios (`git commit -m 'feat: agrega nueva funcionalidad'`).
4.  Haz Push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

---

© 2026 NB COMPANY S.A.
