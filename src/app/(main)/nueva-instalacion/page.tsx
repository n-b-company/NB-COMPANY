'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Store, Router, ArrowLeft, Save } from 'lucide-react';
import { FormSection, Input, Textarea } from '@/components/ui/FormElements';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { toast } from 'sonner';

export default function NuevaInstalacionPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstalacionFormValues>({
    resolver: zodResolver(instalacionSchema),
    defaultValues: {
      nombre: '',
      propietario: '',
      direccion: '',
      entre_calles: '',
      cantidad_equipos: 1,
      ip_puerto: '',
      notas: '',
    },
  });

  const onSubmit = async (data: InstalacionFormValues) => {
    // Aquí iría la lógica para guardar en la DB
    console.log(data);
    toast.success('Instalación registrada con éxito');
    router.push('/comprobante');
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8 pb-32">
      {/* Back Button */}
      <nav>
        <button
          onClick={() => router.back()}
          className="hover:text-primary flex items-center gap-2 text-sm text-zinc-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-white">
          Nueva Instalación
        </h1>
        <p className="text-sm text-zinc-500">
          Complete los datos del comercio y parámetros técnicos.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Datos del Comercio */}
        <FormSection title="Datos del Comercio" icon={Store}>
          <Input
            id="nombre"
            label="Nombre del Comercio"
            placeholder="Ingrese el nombre del comercio "
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <Input
            id="propietario"
            label="Propietario / Responsable"
            placeholder="Nombre completo"
            {...register('propietario')}
            error={errors.propietario?.message}
          />
          <Input
            id="direccion"
            label="Dirección"
            placeholder="Calle, número y ciudad"
            {...register('direccion')}
            error={errors.direccion?.message}
          />
          <Input
            id="entre_calles"
            label="Entre Calles"
            placeholder="Opcional"
            {...register('entre_calles')}
            error={errors.entre_calles?.message}
          />
          <Input
            id="cantidad_equipos"
            label="Cantidad de Equipos"
            type="number"
            min="1"
            placeholder="Total de equipos"
            {...register('cantidad_equipos', { valueAsNumber: true })}
            error={errors.cantidad_equipos?.message}
          />
        </FormSection>

        {/* Datos Técnicos */}
        <FormSection title="Datos Técnicos y Red" icon={Router}>
          <Input
            id="ip_puerto"
            label="IP / Puerto"
            placeholder="Ej: 192.168.1.1:8080"
            {...register('ip_puerto')}
            error={errors.ip_puerto?.message}
          />

          <Textarea
            id="notas"
            label="Notas u Observaciones"
            placeholder="Detalles adicionales..."
            rows={3}
            {...register('notas')}
            error={errors.notas?.message}
          />
        </FormSection>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary shadow-primary/20 hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            <Save size={20} />
            <span className="font-bold">
              {isSubmitting ? 'Guardando...' : 'Registrar Instalación'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
