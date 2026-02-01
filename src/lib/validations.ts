import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El usuario es requerido')
    .min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const instalacionSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  propietario: z.string().min(2, 'El nombre del responsable es obligatorio'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  entre_calles: z.string().optional(),
  cantidad_equipos: z
    .number({ message: 'Debe ser un número' })
    .min(1, 'Debe haber al menos 1 equipo'),
  ip_puerto: z.string().optional(),
  notas: z.string().optional(),
});

export type InstalacionFormValues = z.infer<typeof instalacionSchema>;
