'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, Store, User, Phone, MapPin, Hash, FileText } from 'lucide-react';
import { Input, Textarea, FormSection } from '@/components/ui/FormElements';
import { ImageCapture, LocationCapture } from '@/components/ui/SpecialInputs';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { Client, Installation } from '@/types';
import { updateClient } from '@/lib/actions';

interface ClientConfigProps {
  client: Client & {
    installations: Installation[];
  };
  onSuccess?: () => void;
}

export default function ClientConfig({ client, onSuccess }: ClientConfigProps) {
  const installation = client.installations[0];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InstalacionFormValues>({
    resolver: zodResolver(instalacionSchema),
    defaultValues: {
      nombre: client.name,
      propietario: client.ownerName || '',
      telefono: client.phone || '',
      direccion: client.address,
      entre_calles: client.between || '',
      cantidad_equipos: installation?.equipmentCount || 1,
      ip_puerto: installation?.ipPort || '',
      notas: client.notes || '',
      image_url: client.imageUrl || '',
      costo_servicio: client.serviceCost || 0,
      fecha_instalacion: installation?.installedAt
        ? new Date(installation.installedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      latitude: client.latitude,
      longitude: client.longitude,
    },
  });

  const currentImageUrl = useWatch({ control, name: 'image_url' });
  const watchLat = useWatch({ control, name: 'latitude' });
  const watchLng = useWatch({ control, name: 'longitude' });

  const currentCoords = {
    lat: watchLat || 0,
    lng: watchLng || 0,
  };

  const onSubmit = async (data: InstalacionFormValues) => {
    try {
      const result = await updateClient(client.id, data);

      if (result.success) {
        toast.success('Datos actualizados correctamente');
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Error al actualizar');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-10">
      <FormSection title="Foto del Local" icon={Store}>
        <ImageCapture
          label="Foto de Fachada"
          value={currentImageUrl || undefined}
          onImageCapture={(base64) => setValue('image_url', base64 || '')}
          error={errors.image_url?.message}
          required={false}
        />
      </FormSection>

      <FormSection title="Datos del Comercio" icon={Store}>
        <Input label="Nombre del Comercio" {...register('nombre')} error={errors.nombre?.message} />
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Propietario / Responsable"
            icon={User}
            {...register('propietario')}
            error={errors.propietario?.message}
          />
          <Input
            label="Teléfono / WhatsApp"
            icon={Phone}
            {...register('telefono')}
            error={errors.telefono?.message}
          />
          <Input
            label="Costo del Servicio ($)"
            type="number"
            step="0.01"
            icon={FileText}
            {...register('costo_servicio', { valueAsNumber: true })}
            error={errors.costo_servicio?.message}
          />
        </div>
      </FormSection>

      <FormSection title="Ubicación" icon={MapPin}>
        <Input label="Dirección" {...register('direccion')} error={errors.direccion?.message} />
        <Input
          label="Entre Calles / Referencias"
          {...register('entre_calles')}
          error={errors.entre_calles?.message}
          required={false}
        />
        <LocationCapture
          label="Coordenadas GPS"
          value={currentCoords.lat ? currentCoords : undefined}
          onLocationCapture={(coords) => {
            if (coords) {
              setValue('latitude', coords.lat);
              setValue('longitude', coords.lng);
            }
          }}
          error={errors.latitude?.message || errors.longitude?.message}
          required={false}
        />
      </FormSection>

      <FormSection title="Datos Técnicos" icon={Hash}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cant. Equipos"
            type="number"
            {...register('cantidad_equipos', { valueAsNumber: true })}
            error={errors.cantidad_equipos?.message}
          />
          <Input
            label="IP / Puerto"
            {...register('ip_puerto')}
            error={errors.ip_puerto?.message}
            required={false}
          />
        </div>
        <Textarea
          label="Notas Internas"
          icon={FileText}
          rows={4}
          {...register('notas')}
          error={errors.notas?.message}
          required={false}
        />
      </FormSection>

      <div className="px-6 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary shadow-primary/20 flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black text-zinc-950 uppercase shadow-2xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
