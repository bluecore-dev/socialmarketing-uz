import { useRef, useEffect } from "react";

interface UseMagneticHoverOptions {
  strength?: number;
  disabled?: boolean;
}

export function useMagneticHover<T extends HTMLElement = HTMLButtonElement>({
  strength = 15,
  disabled = false,
}: UseMagneticHoverOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) * 1.5;

      if (distance < maxDist) {
        const factor = 1 - distance / maxDist;
        const tx = dx * factor * (strength / 15);
        const ty = dy * factor * (strength / 15);
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        el.style.transition = "transform 0.15s ease-out";
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    };

    const parent = el.parentElement || document;
    parent.addEventListener("mousemove", handleMouseMove as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, disabled]);

  return ref;
}
