'use client';

import ErrorView from '@/components/ui/ErrorView';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorView
      message="No pudimos conectar con la base de datos para cargar el tablero principal."
      onReset={reset}
    />
  );
}
