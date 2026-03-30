'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Router,
  ArrowLeft,
  Save,
  RefreshCw,
  ArrowRight,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { FormSection, Input, Textarea } from '@/components/ui/FormElements';
import { ImageCapture, LocationCapture, ModernDatePicker } from '@/components/ui/SpecialInputs';

import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instalacionSchema, type InstalacionFormValues } from '@/lib/validations';
import { toast } from 'sonner';

import { createClientWithInstallation } from '@/lib/actions';

export default function NuevaInstalacionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
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
      ip_puertos: [{ value: '' }],
      notas: '',
      latitude: null,
      longitude: null,
      image_url: '',
      dni_front: '',
      dni_back: '',
      costo_servicio: undefined as unknown as number,
      fecha_instalacion: new Date().toISOString().split('T')[0],
    },
  });

  const longitudeValue = useWatch({ control, name: 'longitude' });
  const latitudeValue = useWatch({ control, name: 'latitude' });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ip_puertos',
  });

  const [coordInput, setCoordInput] = useState('');

  // Sincronizar coordenadas del formulario al input (si este no tiene el foco) - bidireccionalidad controlada
  React.useEffect(() => {
    if (document.activeElement?.id !== 'coordenadas') {
      if (latitudeValue && longitudeValue) {
        setCoordInput(`${latitudeValue}, ${longitudeValue}`);
      } else if (!latitudeValue && !longitudeValue) {
        setCoordInput('');
      }
    }
  }, [latitudeValue, longitudeValue]);

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

  const handleNextStep = async () => {
    const isStep1Valid = await trigger(['propietario', 'telefono']);

    if (isStep1Valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8 pb-32">
      {/* Back Button */}
      <nav className="flex items-center justify-between">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="hover:text-primary flex items-center gap-2 text-sm text-zinc-500 transition-colors"
        >
          <ArrowLeft size={16} />
          {step === 2 ? 'Volver al paso anterior' : 'Volver al inicio'}
        </button>
        <div className="text-sm font-medium text-zinc-500">
          Paso <span className="text-white">{step}</span> de 2
        </div>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-white">
          {step === 1 ? 'Datos del Cliente' : 'Datos del Comercio'}
        </h1>
        <p className="text-sm text-zinc-500">
          {step === 1
            ? 'Complete la información personal del titular.'
            : 'Complete la información del local y la instalación.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-8">
            {/* Datos del Cliente */}
            <FormSection title="Datos del Cliente" icon={Store}>
              <div className="flex flex-col gap-6">
                <Input
                  id="propietario"
                  label="Propietario / Responsable"
                  placeholder="Nombre completo del titular"
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Controller
                    name="dni_front"
                    control={control}
                    render={({ field }) => (
                      <ImageCapture
                        label="Foto DNI (Frente)"
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
              </div>
            </FormSection>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-primary/10 text-primary hover:bg-primary flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 px-8 py-4 text-base font-bold tracking-wider uppercase transition-all hover:text-zinc-950 active:scale-[0.98]"
              >
                Siguiente Paso <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <FormSection title="Datos del Comercio" icon={Store}>
              <div className="flex flex-col gap-6">
                <Input
                  id="nombre"
                  label="Nombre del Comercio"
                  placeholder="Ingrese el nombre del comercio"
                  {...register('nombre')}
                  error={errors.nombre?.message}
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
                  placeholder="Ej: Mitre y Belgrano"
                  {...register('entre_calles')}
                  error={errors.entre_calles?.message}
                  required={false}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    id="costo_servicio"
                    label="Costo del Servicio ($)"
                    type="number"
                    step="0.01"
                    placeholder="Ej: 5000"
                    {...register('costo_servicio', { valueAsNumber: true })}
                    error={errors.costo_servicio?.message}
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

                <Controller
                  name="image_url"
                  control={control}
                  render={({ field }) => (
                    <ImageCapture
                      label="Foto de la Tienda (Fachada)"
                      value={field.value}
                      onImageCapture={(base64) => field.onChange(base64)}
                      error={errors.image_url?.message}
                      required={false}
                    />
                  )}
                />
              </div>
            </FormSection>

            <FormSection title="Instalación y Técnica" icon={Router}>
              <div className="flex flex-col gap-6">
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

                {/* Latitud y Longitude Manual + Auto */}
                <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                      <MapPin size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white">Geolocalización</h3>
                  </div>

                  <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => (
                      <LocationCapture
                        label="Captura Automática"
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

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      id="coordenadas"
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
                          // Si el usuario borra todo, limpiar el estado del form
                          if (value === '') {
                            setValue('latitude', null);
                            setValue('longitude', null);
                          }
                        }
                      }}
                    />
                    {/* Hidden inputs to maintain form state if needed, though setValue handles it */}
                    <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
                    <input type="hidden" {...register('longitude', { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-400">
                      Lg / Puertos de Acceso
                    </label>
                    <button
                      type="button"
                      onClick={() => append({ value: '' })}
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      <Plus size={14} /> Agregar Lg
                    </button>
                  </div>

                  <div className="space-y-3">
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

                <Textarea
                  id="notas"
                  label="Notas u Observaciones"
                  placeholder="Detalles adicionales sobre la instalación..."
                  rows={3}
                  {...register('notas')}
                  error={errors.notas?.message}
                  required={false}
                />
              </div>
            </FormSection>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary shadow-primary/20 hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                <span className="font-bold tracking-wider uppercase">
                  {isSubmitting ? 'Guardando...' : 'Finalizar Registro'}
                </span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
