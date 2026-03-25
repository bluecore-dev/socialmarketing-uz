import { useState, useEffect, useRef } from "react";

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);

          if (prefersReducedMotion) {
            setCount(end);
            return;
          }

          const startTime = performance.now();
          const range = end - start;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased =
              progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            setCount(parseFloat((start + range * eased).toFixed(decimals)));

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          rafRef.current = requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, start, decimals, hasStarted]);

  return { count, ref };
}
