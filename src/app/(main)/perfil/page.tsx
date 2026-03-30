'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, User, Camera, ShieldCheck, BadgeCheck } from 'lucide-react';
import { logout, getUserProfileImage, updateProfileImage } from '@/lib/actions';
import { toast } from 'sonner';
import { ImageCapture } from '@/components/ui/SpecialInputs';
import Image from 'next/image';
import { ASSETS } from '@/constants/constants';

import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function PerfilPage() {
  const [techImage, setTechImage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isSavingImage, setIsSavingImage] = useState(false);

  // Cargar imagen desde la base de datos al montar
  useEffect(() => {
    const loadProfileImage = async () => {
      const result = await getUserProfileImage();
      if (result.success && result.profileImage) {
        setTechImage(result.profileImage);
      }
      setIsLoadingImage(false);
    };

    loadProfileImage();
  }, []);

  const handleUpdateImage = async (image: string | null) => {
    setIsSavingImage(true);
    setTechImage(image);

    try {
      const result = await updateProfileImage(image);
      if (result.success) {
        toast.success('Foto de perfil actualizada correctamente');
        // Dispatch event para sincronizar con otros componentes (como Header)
        window.dispatchEvent(new Event('tech-image-updated'));
      } else {
        toast.error(result.error || 'No se pudo actualizar la foto');
        // Revertir el cambio si falló
        const prevResult = await getUserProfileImage();
        setTechImage(prevResult.profileImage || null);
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Error al actualizar la foto de perfil');
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-10 pb-32">
      {(isLoggingOut || isSavingImage) && (
        <LoadingOverlay message={isSavingImage ? 'Guardando foto...' : 'Cerrando sesión...'} />
      )}
      {/* Header Perfil */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-2xl">
            {isLoadingImage ? (
              <div className="animate-pulse text-zinc-700">
                <User size={64} />
              </div>
            ) : techImage ? (
              <Image src={techImage} alt="Técnico" fill className="object-cover" unoptimized />
            ) : (
              <User size={64} className="text-zinc-700" />
            )}
          </div>
          <div className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-zinc-950 bg-emerald-500 text-white shadow-lg">
            <BadgeCheck size={20} />
          </div>
        </div>

        <h1 className="text-2xl font-black text-white">Admin NB Company</h1>
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-500">
          <ShieldCheck size={16} />
          Personal Autorizado
        </p>
      </div>

      {/* Sección de Carga de Imagen */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
            <Camera size={18} />
          </div>
          <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
            Foto del Técnico
          </h2>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <ImageCapture
            label="Actualizar Foto de Perfil"
            value={techImage || undefined}
            onImageCapture={handleUpdateImage}
            required={false}
          />
          <p className="mt-4 px-2 text-center text-xs leading-relaxed text-zinc-500 italic">
            Esta foto se guardará en la nube y estará disponible en todos tus dispositivos.
          </p>
        </div>
      </div>

      {/* Botón de Cierre de Sesión */}
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 py-5 text-red-500 transition-all hover:bg-red-500/20 active:scale-[0.98]"
        >
          <LogOut size={22} />
          <span className="text-lg font-black uppercase">Cerrar Sesión</span>
        </button>
      </div>

      {/* Versión y Soporte */}
      <div className="flex flex-col items-center gap-2 pt-8 opacity-40">
        <div className="relative h-8 w-10 overflow-hidden">
          <Image src={ASSETS.LOGO} alt="Logo" fill className="object-contain grayscale" />
        </div>
        <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          NB COMPANY v1.2.0 PRE-RELEASE
        </p>
      </div>
    </div>
  );
}
