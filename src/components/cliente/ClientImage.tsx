'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientImageProps } from '@/types';
import { X, CameraOff } from 'lucide-react';

export default function ClientImage({ src, alt }: ClientImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasImage = src && src.trim() !== '';

  return (
    <>
      <div
        onClick={() => hasImage && setIsOpen(true)}
        className={`group relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl ${
          hasImage ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {hasImage ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-full border border-white/10 bg-zinc-950/60 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                Click para ampliar
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-600">
              <CameraOff size={24} />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Sin foto de fachada
            </p>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/95 p-4 backdrop-blur-xl transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative aspect-auto max-h-[85vh] w-full max-w-[500px] overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-110 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-950/50 text-white backdrop-blur-md transition-colors hover:bg-zinc-950/80"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <X size={20} />
            </button>
            <Image
              src={src}
              alt={alt}
              width={800}
              height={1200}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
