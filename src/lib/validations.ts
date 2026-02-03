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
  telefono: z.string().min(8, 'El número de teléfono es demasiado corto'),
  entre_calles: z.string().optional(),
  cantidad_equipos: z
    .number({ message: 'Debe ser un número' })
    .min(1, 'Debe haber al menos 1 equipo'),
  ip_puertos: z.array(z.object({ value: z.string() })).optional(),
  costo_servicio: z
    .number({ message: 'Debe ser un número' })
    .min(0, 'El costo no puede ser negativo'),
  notas: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  image_url: z.string().optional(),
  dni_front: z.string().optional(),
  dni_back: z.string().optional(),
  fecha_instalacion: z.string().min(1, 'La fecha es obligatoria'),
});

export type InstalacionFormValues = z.infer<typeof instalacionSchema>;
