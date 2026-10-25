import { useEffect, useState } from 'react';

interface PageLoaderProps {
  /** How long the loader stays fully visible before fading out, in milliseconds. */
  delay?: number;
}

/**
 * Full-screen loading overlay shown before a page is revealed.
 * Semi-transparent white background with a smooth black spinner.
 * Stays visible for `delay` ms, then fades out smoothly and unmounts.
 */
export default function PageLoader({ delay = 3000 }: PageLoaderProps) {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), delay);
    const removeTimer = setTimeout(() => setMounted(false), delay + 450);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [delay]);

  if (!mounted) return null;

  return (
    <div
      className={`page-loader${fading ? ' page-loader--hidden' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="page-loader__spinner" aria-hidden="true" />
    </div>
  );
}
