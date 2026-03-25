export const COLORS = {
  primary: "hsl(211, 68%, 32%)",
  secondary: "hsl(205, 100%, 40%)",
  accent: "hsl(194, 100%, 50%)",
  background: "hsl(210, 40%, 98%)",
  foreground: "hsl(240, 28%, 14%)",
};

export const TIMING = {
  fast: 0.2,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring", stiffness: 200, damping: 20 },
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const PARALLAX = {
  slow: 0.3,
  medium: 0.5,
  fast: 0.7,
};

export const ANIMATION_VARIANTS = {
  fadeSlideUp: {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: TIMING.easeOut },
    },
  },
  fadeSlideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: TIMING.easeOut },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: TIMING.easeOut },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: TIMING.easeOut },
    },
  },
};
