'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ASSETS } from '@/constants/constants';
import { User as UserIcon } from 'lucide-react';

export default function AppHeader() {
  const [techImage, setTechImage] = useState<string | null>(null);

  useEffect(() => {
    // Load image from localStorage
    const savedImage = localStorage.getItem('tech_image');
    if (savedImage) {
      requestAnimationFrame(() => {
        setTechImage(savedImage);
      });
    }

    // Sync image changes from other parts of the app
    const handleSync = () => {
      const updatedImage = localStorage.getItem('tech_image');
      setTechImage(updatedImage);
    };

    window.addEventListener('tech-image-updated', handleSync);
    return () => window.removeEventListener('tech-image-updated', handleSync);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
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
          <h2 className="text-sm leading-tight font-bold text-white">Técnico</h2>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            Control
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="border-primary/20 relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-zinc-900 shadow-inner transition-all">
          {techImage ? (
            <Image
              src={techImage}
              alt="Avatar"
              fill
              unoptimized
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon size={18} className="text-zinc-600" />
          )}
        </div>
      </div>
    </header>
  );
}
