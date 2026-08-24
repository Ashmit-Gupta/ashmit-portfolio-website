"use client";

import {
  useCallback,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

export function HoverLiftCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const shine = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduced || !shine.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      shine.current.style.opacity = "1";
      shine.current.style.left = `${event.clientX - rect.left}px`;
      shine.current.style.top = `${event.clientY - rect.top}px`;
    },
    [reduced],
  );

  const onLeave = useCallback(() => {
    if (shine.current) shine.current.style.opacity = "0";
  }, []);

  return (
    <motion.div
      className={cn("relative h-full", className)}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        <div
          ref={shine}
          aria-hidden="true"
          className="absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(201,163,106,0.28) 0%, transparent 70%)",
          }}
        />
      </div>
    </motion.div>
  );
}
