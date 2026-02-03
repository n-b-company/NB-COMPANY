'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Router as RouterIcon, Store, Clock } from 'lucide-react';
import { ASSETS } from '@/constants/constants';
import { Client, Installation } from '@/types';

interface PublicClientViewProps {
  client: Client & {
    installations: Installation[];
  };
}

export default function PublicClientView({ client }: PublicClientViewProps) {
  const installation = client.installations[0];
  const equipmentCount = installation?.equipmentCount || 1;
  const ipPorts = installation?.ipPorts || [];

  return (
    <div className="flex h-screen flex-col overflow-y-auto bg-zinc-950 md:h-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-24">
            <Image
              src={ASSETS.LOGO}
              alt="NB COMPANY Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <h2 className="text-sm font-bold leading-tight text-white">Información</h2>
            <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
              Cliente
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-6 pb-12">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Store size={20} />
            <h1 className="text-2xl font-black text-white">{client.name}</h1>
          </div>
          <p className="text-sm text-zinc-500">
            ID: #{client.id.substring(client.id.length - 8).toUpperCase()}
          </p>
        </div>

        {/* Foto del comercio */}
        {client.imageUrl && (
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <div className="relative aspect-video w-full">
              <Image
                src={client.imageUrl}
                alt={`Fachada ${client.name}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Información de contacto */}
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
            Información de Contacto
          </h3>

          <div className="space-y-3">
            {/* Propietario */}
            {client.ownerName && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                  <Store size={18} className="text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">Propietario</p>
                  <p className="font-semibold text-white">{client.ownerName}</p>
                </div>
              </div>
            )}

            {/* Teléfono */}
            {client.phone && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                  <Phone size={18} className="text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">Teléfono</p>
                  <a
                    href={`tel:${client.phone}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Dirección */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                <MapPin size={18} className="text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-500">Dirección</p>
                <p className="font-semibold text-white">{client.address}</p>
                {client.between && (
                  <p className="text-sm text-zinc-400">Entre: {client.between}</p>
                )}
                {client.latitude && client.longitude && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${client.latitude},${client.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-primary hover:underline"
                  >
                    Ver en Google Maps →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Infraestructura */}
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
            Infraestructura Instalada
          </h3>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
              <RouterIcon size={18} className="text-zinc-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500">Servicio</p>
              <p className="font-semibold text-white">Alquiler de POSNET</p>
              <p className="mt-1 text-sm text-zinc-400">
                {equipmentCount} Terminal{equipmentCount !== 1 ? 'es' : ''} instalada
                {equipmentCount !== 1 ? 's' : ''}
              </p>

              {ipPorts.length > 0 && (
                <div className="mt-2 space-y-1">
                  {ipPorts.map((ip, index) => (
                    <p key={index} className="font-mono text-xs text-zinc-500">
                      • Lg: {ip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {client.serviceCost && client.serviceCost > 0 && (
            <div className="flex items-start gap-3 border-t border-zinc-800 pt-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                <Clock size={18} className="text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-500">Costo del Servicio</p>
                <p className="font-bold text-primary">
                  ${client.serviceCost.toLocaleString()} x terminal
                </p>
                <p className="text-sm text-zinc-400">
                  Total mensual: ${(client.serviceCost * equipmentCount).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notas */}
        {client.notes && (
          <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Observaciones
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {client.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center gap-2 pt-8 opacity-40">
          <div className="relative h-8 w-10 overflow-hidden">
            <Image src={ASSETS.LOGO} alt="Logo" fill className="object-contain grayscale" />
          </div>
          <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            NB COMPANY SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
