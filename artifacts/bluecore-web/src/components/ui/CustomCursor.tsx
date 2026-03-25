import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 600, damping: 35 };
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 40 });
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, [tabindex]:not([tabindex='-1'])") !== null;
      setIsHovering(isInteractive);
      setIsPointer(isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (typeof window !== "undefined") {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return null;
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return null;
  }

  return (
    <motion.div
      style={{ opacity: isVisible ? 1 : 0 }}
      className="fixed inset-0 pointer-events-none z-[99999] mix-blend-difference"
    >
      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />

      {/* Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          opacity: isPointer ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.2 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
      />
    </motion.div>
  );
}
