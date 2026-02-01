import React from 'react';
import Image from 'next/image';

interface ClientImageProps {
  src: string;
  alt: string;
}

export default function ClientImage({ src, alt }: ClientImageProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
