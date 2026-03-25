import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function BlueCoreLogoMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-14 w-14">
      <defs>
        <linearGradient id="pggrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4F8A" />
          <stop offset="0.5" stopColor="#0077CC" />
          <stop offset="1" stopColor="#00C4FF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#pggrad)" />
      <path d="M11 10h10.5c3.5 0 6 2 6 5.2 0 1.8-.9 3.2-2.2 4 1.8.7 3 2.3 3 4.4C28.3 27.2 25.6 30 22 30H11V10z" fill="white" />
      <path d="M15.5 14v5h5.5c1.4 0 2.4-.9 2.4-2.5S22.4 14 21 14h-5.5zM15.5 22.5v5.5H22c1.6 0 2.7-1 2.7-2.7 0-1.7-1.1-2.8-2.7-2.8h-6.5z" fill="url(#pggrad)" />
    </svg>
  );
}

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    const alreadyLoaded = sessionStorage.getItem("bluecore_loaded");
    if (alreadyLoaded) {
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("bluecore_loaded", "1");
      setTimeout(() => setHasLoaded(true), 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (hasLoaded) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] bg-background flex flex-col items-center justify-center gap-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <BlueCoreLogoMark />
            <p className="font-display font-bold text-xl text-foreground tracking-tight mt-1">
              Blue<span className="text-primary">Core</span><span className="text-accent">.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 160 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
              className="h-full w-1/3 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
