import React from 'react';
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';

export default function ClientLocation() {
  return (
    <div className="flex flex-col gap-6">
      {/* Mini Map View */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
          alt="Map Background"
          fill
          className="object-cover opacity-50 contrast-125 grayscale"
        />
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-b via-transparent to-transparent" />

        {/* Central Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="bg-primary/20 absolute -inset-4 animate-ping rounded-full" />
            <div className="bg-primary relative rotate-45 transform rounded-2xl border-2 border-emerald-400 p-3 text-zinc-950 shadow-2xl">
              <MapPin size={24} className="-rotate-45 transform" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Floating Info */}
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="text-primary rounded-xl border border-zinc-800 bg-zinc-900 p-2">
              <MapIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                Coordenadas
              </p>
              <p className="text-xs font-bold text-white">-34.6037, -58.3816</p>
            </div>
          </div>
          <button className="bg-primary flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black text-zinc-950 uppercase transition-all hover:brightness-110">
            <Navigation size={14} fill="currentColor" />
            Navegar
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h4 className="mb-4 flex items-center gap-2 font-bold text-white">
          <MapPin size={18} className="text-primary" />
          Detalles de Ubicación
        </h4>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
              Dirección Principal
            </span>
            <p className="font-medium text-white">Av. Corrientes 1234, CABA</p>
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
              Referencias
            </span>
            <p className="text-sm text-zinc-400">
              Portón negro grande al lado del kiosco. Tocar timbre 4B.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
