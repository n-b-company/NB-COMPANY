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
      message="No pudimos cargar la lista de clientes. Por favor, verifica tu conexión."
      onReset={reset}
    />
  );
}
