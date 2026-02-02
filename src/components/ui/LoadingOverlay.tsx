'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ASSETS } from '@/constants/constants';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Cerrando sesión...' }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xl"
    >
      <div className="relative mb-8 h-16 w-32">
        <Image src={ASSETS.LOGO} alt="Logo" fill className="object-contain" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          <Loader2 size={40} />
        </motion.div>

        <p className="text-sm font-black tracking-widest text-white uppercase italic">{message}</p>
      </div>

      <div className="absolute bottom-10">
        <p className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
          NB COMPANY SECURE SYSTEM
        </p>
      </div>
    </motion.div>
  );
}
