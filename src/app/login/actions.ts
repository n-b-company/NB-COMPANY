'use server';

import { login as setAuthSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: unknown, formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // 1. Validar esquema con Zod
  const validatedFields = loginSchema.safeParse({
    username,
    password,
  });

  if (!validatedFields.success) {
    return {
      error: 'Datos inválidos. Por favor revise el formulario.',
    };
  }

  // 2. Validar credenciales contra .env
  const defaultUser = process.env.DEFAULT_USER;
  const defaultPass = process.env.DEFAULT_PASSWORD;

  if (username !== defaultUser || password !== defaultPass) {
    return {
      error: 'Usuario o contraseña incorrectos.',
    };
  }

  // 3. Crear JWT y Cookie
  await setAuthSession({ username });

  // 4. Redirigir
  redirect('/dashboard');
}
