'use client';

import React from 'react';
import { useForm, useWatch, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, Store, User, Phone, MapPin, Hash, FileText, Trash2, Plus } from 'lucide-react';
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
      ip_puertos:
        installation?.ipPorts && installation.ipPorts.length > 0
          ? installation.ipPorts.map((ip) => ({ value: ip }))
          : [{ value: '' }],
      notas: client.notes || '',
      image_url: client.imageUrl || '',
      dni_front: client.dniFront || '',
      dni_back: client.dniBack || '',
      costo_servicio: client.serviceCost || 0,
      fecha_instalacion: installation?.installedAt
        ? new Date(installation.installedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      latitude: client.latitude,
      longitude: client.longitude,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ip_puertos',
  });

  const currentImageUrl = useWatch({ control, name: 'image_url' });

  const latitudeValue = useWatch({ control, name: 'latitude' });
  const longitudeValue = useWatch({ control, name: 'longitude' });

  const [coordInput, setCoordInput] = React.useState('');

  // Sincronizar coordenadas del formulario al input
  React.useEffect(() => {
    if (document.activeElement?.id !== 'coordenadas-config') {
      if (latitudeValue && longitudeValue) {
        setCoordInput(`${latitudeValue}, ${longitudeValue}`);
      } else if (!latitudeValue && !longitudeValue) {
        setCoordInput('');
      }
    }
  }, [latitudeValue, longitudeValue]);

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

      <FormSection title="Datos del Cliente" icon={User}>
        <div className="grid grid-cols-1 gap-4">
          <Controller
            name="dni_front"
            control={control}
            render={({ field }) => (
              <ImageCapture
                label="Foto DNI (Frente)"
                // Si hay valor nuevo (field.value), mostrarlo. Si no, no mostramos nada o podríamos mostrar un placeholder
                value={field.value}
                onImageCapture={(base64) => field.onChange(base64)}
                error={errors.dni_front?.message}
                required={false}
              />
            )}
          />
          <Controller
            name="dni_back"
            control={control}
            render={({ field }) => (
              <ImageCapture
                label="Foto DNI (Dorso)"
                value={field.value}
                onImageCapture={(base64) => field.onChange(base64)}
                error={errors.dni_back?.message}
                required={false}
              />
            )}
          />
        </div>
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

        <div className="space-y-4 pt-2">
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <LocationCapture
                label="Captura Automática"
                value={
                  field.value && longitudeValue ? { lat: field.value, lng: longitudeValue } : null
                }
                onLocationCapture={(coords) => {
                  setValue('latitude', coords?.lat ?? null);
                  setValue('longitude', coords?.lng ?? null);
                }}
                error={errors.latitude?.message}
                required={false}
              />
            )}
          />

          <Input
            id="coordenadas-config"
            label="Coordenadas (Lat, Lng)"
            placeholder="-34.123456, -58.123456"
            value={coordInput}
            onChange={(e) => {
              const value = e.target.value;
              setCoordInput(value);

              const parts = value.split(',');
              if (parts.length === 2) {
                const lat = parseFloat(parts[0].trim());
                const lng = parseFloat(parts[1].trim());
                if (!isNaN(lat)) setValue('latitude', lat);
                if (!isNaN(lng)) setValue('longitude', lng);
              } else {
                if (value === '') {
                  setValue('latitude', null);
                  setValue('longitude', null);
                }
              }
            }}
          />
        </div>
      </FormSection>

      <FormSection title="Datos Técnicos" icon={Hash}>
        <div className="flex flex-col gap-4">
          <Input
            label="Cant. Equipos"
            type="number"
            {...register('cantidad_equipos', { valueAsNumber: true })}
            error={errors.cantidad_equipos?.message}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-400">Lg / Puertos de Acceso</label>
              <button
                type="button"
                onClick={() => append({ value: '' })}
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <Plus size={14} /> Agregar Lg
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="relative flex items-center gap-2">
                <div className="w-full">
                  <Input
                    id={`ip-${index}`}
                    placeholder="Ej: 192.168.1.1:8080"
                    {...register(`ip_puertos.${index}.value`)}
                    error={errors.ip_puertos?.[index]?.value?.message}
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                    title="Eliminar Lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Notas Internas"
            icon={FileText}
            rows={4}
            {...register('notas')}
            error={errors.notas?.message}
            required={false}
          />
        </div>
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
