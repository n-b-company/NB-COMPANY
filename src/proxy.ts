import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/nueva-instalacion'];
// Rutas que son solo para invitados (login)
const publicRoutes = ['/login'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // 1. Obtener la sesión de la cookie
  const session = req.cookies.get('session')?.value;

  // 2. Decodificar la sesión
  const payload = session ? await decrypt(session).catch(() => null) : null;

  // 3. Redirigir si es necesario
  if (isProtectedRoute && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && payload) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
