export const motionConfig = {
  hero: {
    parallax: {
      // Keep it subtle; we will gate further via matchMedia + prefers-reduced-motion.
      maxShiftX: 12,
      maxShiftY: 8,
    },
  },
  reveal: {
    stagger: 0.06,
    duration: 0.6,
  },
};
