'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Store, Router, ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { FormSection, Input, Textarea } from '@/components/ui/FormElements';
import { ImageCapture, LocationCapture, ModernDatePicker } from '@/components/ui/SpecialInputs';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { toast } from 'sonner';

import { createClientWithInstallation } from '@/lib/actions';

export default function NuevaInstalacionPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InstalacionFormValues>({
    resolver: zodResolver(instalacionSchema),
    defaultValues: {
      nombre: '',
      propietario: '',
      direccion: '',
      telefono: '',
      entre_calles: '',
      cantidad_equipos: 1,
      ip_puerto: '',
      notas: '',
      latitude: null,
      longitude: null,
      image_url: '',
      costo_servicio: 0,
      fecha_instalacion: new Date().toISOString().split('T')[0],
    },
  });

  const longitudeValue = useWatch({ control, name: 'longitude' });

  const onSubmit = async (data: InstalacionFormValues) => {
    try {
      const result = await createClientWithInstallation(data);

      if (result.success) {
        toast.success('Instalación registrada con éxito');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(result.error || 'No se pudo guardar la instalación');
      }
    } catch (err) {
      toast.error('Error de conexión con el servidor');
      console.error(err);
    }
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
          Complete los datos del comercio, capture la ubicación y la imagen del local.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Captura de Imagen y Fecha */}
        <div className="flex flex-col gap-6">
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageCapture
                label="Foto de la Tienda"
                value={field.value}
                onImageCapture={(base64) => field.onChange(base64)}
                error={errors.image_url?.message}
                required={false}
              />
            )}
          />

          <div className="space-y-6">
            <Controller
              name="fecha_instalacion"
              control={control}
              render={({ field }) => (
                <ModernDatePicker
                  label="Fecha de Instalación"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fecha_instalacion?.message}
                />
              )}
            />

            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <LocationCapture
                  label="Ubicación Geográfica"
                  value={
                    field.value && longitudeValue
                      ? { lat: field.value, lng: longitudeValue ?? 0 }
                      : null
                  }
                  onLocationCapture={(coords) => {
                    setValue('latitude', coords?.lat ?? null);
                    setValue('longitude', coords?.lng ?? null);
                  }}
                  error={errors.latitude?.message || errors.longitude?.message}
                  required={false}
                />
              )}
            />
          </div>
        </div>

        {/* Datos del Comercio */}
        <FormSection title="información del comercio" icon={Store}>
          <div className="flex flex-col gap-6">
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
              id="telefono"
              label="Teléfono / WhatsApp"
              placeholder="Ej: 1122334455"
              {...register('telefono')}
              error={errors.telefono?.message}
            />
            <Input
              id="costo_servicio"
              label="Costo del Servicio ($)"
              type="number"
              step="0.01"
              placeholder="Ej: 5000"
              {...register('costo_servicio', { valueAsNumber: true })}
              error={errors.costo_servicio?.message}
            />
          </div>

          <Input
            id="direccion"
            label="Dirección"
            placeholder="Calle, número y ciudad"
            {...register('direccion')}
            error={errors.direccion?.message}
          />

          <div className="flex flex-col gap-6">
            <Input
              id="entre_calles"
              label="Entre Calles"
              placeholder="Ej: Mitre y Belgrano"
              {...register('entre_calles')}
              error={errors.entre_calles?.message}
              required={false}
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
          </div>
        </FormSection>

        {/* Datos Técnicos */}
        <FormSection title="configuración técnica" icon={Router}>
          <Input
            id="ip_puerto"
            label="IP / Puerto de Acceso"
            placeholder="Ej: 192.168.1.1:8080"
            {...register('ip_puerto')}
            error={errors.ip_puerto?.message}
            required={false}
          />

          <Textarea
            id="notas"
            label="Notas u Observaciones"
            placeholder="Detalles adicionales sobre la instalación..."
            rows={3}
            {...register('notas')}
            error={errors.notas?.message}
            required={false}
          />
        </FormSection>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary shadow-primary/20 hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            <span className="font-bold tracking-wider uppercase">
              {isSubmitting ? 'Guardando...' : 'Finalizar Registro'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
