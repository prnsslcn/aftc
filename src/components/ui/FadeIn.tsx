"use client";

import { motion } from "framer-motion";

const directionOffset = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -64 },
  right: { x: 64 },
  scale: { scale: 0.88 },
  none: {},
} as const;

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: keyof typeof directionOffset;
  delay?: number;
  duration?: number;
}

export default function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
