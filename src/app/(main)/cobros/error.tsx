'use client';

import ErrorView from '@/components/ui/ErrorView';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorView message="No pudimos cargar la información de cobros." onReset={reset} />;
}
