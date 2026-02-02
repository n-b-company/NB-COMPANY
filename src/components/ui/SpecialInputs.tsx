'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Calendar, Check, X, RefreshCw } from 'lucide-react';
import { ImageCaptureProps, LocationCaptureProps, DatePickerProps } from '@/types';

// --- Image Capture Component ---

export const ImageCapture = ({ label, onImageCapture, error, value }: ImageCaptureProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageCapture(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}>
        {label}
      </label>

      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
          preview
            ? 'border-primary/50 bg-primary/5'
            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
        } ${error ? 'border-red-500/50' : ''} p-4 text-center`}
      >
        {preview ? (
          <div className="relative h-48 w-full">
            <Image
              src={preview}
              alt="Store Preview"
              fill
              unoptimized
              className="rounded-lg object-cover shadow-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-3 py-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors group-hover:bg-zinc-700">
              <Camera size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">Presiona para tomar foto</p>
              <p className="text-xs text-zinc-500">O selecciona de tu galería</p>
            </div>
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- Location Capture Component ---

export const LocationCapture = ({
  label,
  onLocationCapture,
  error,
  value,
}: LocationCaptureProps) => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(value || null);

  const getPosition = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por el navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        onLocationCapture(newCoords);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        alert('Error al obtener la ubicación. Asegúrate de dar permisos.');
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}>
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-inner ${error ? 'border-red-500/50' : ''}`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${coords ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}
        >
          <MapPin size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          {coords ? (
            <p className="truncate text-xs text-zinc-300">
              Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
            </p>
          ) : (
            <p className="text-xs text-zinc-500">Ubicación no establecida</p>
          )}
        </div>
        <button
          type="button"
          onClick={getPosition}
          disabled={loading}
          className={`flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-bold transition-all ${
            coords
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-primary hover:bg-primary/90 shadow-primary/20 text-white shadow-lg'
          }`}
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : coords ? (
            <>
              <Check size={14} /> Actualizar
            </>
          ) : (
            'Obtener GPS'
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- Modern Date Picker ---

export const ModernDatePicker = ({ label, value, onChange, error, id }: DatePickerProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
          <Calendar size={18} />
        </div>
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`focus:ring-primary/50 block w-full rounded-lg border bg-zinc-900 py-2.5 pr-3 pl-10 text-white transition-colors outline-none focus:ring-2 ${
            error ? 'border-red-500/50' : 'focus:border-primary border-zinc-800'
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
