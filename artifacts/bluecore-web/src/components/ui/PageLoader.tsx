import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            <img
              src={`${import.meta.env.BASE_URL}images/bluecore-logo.png`}
              alt="BlueCore"
              className="h-16 w-auto object-contain"
            />
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
