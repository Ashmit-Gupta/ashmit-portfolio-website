"use client";

import type { ReactNode } from "react";
import { ReducedMotionProvider } from "@/lib/animations/use-reduced-motion";
import { useLenis } from "@/lib/animations/use-lenis";

function LenisRoot({ children }: { children: ReactNode }) {
  useLenis();
  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <LenisRoot>{children}</LenisRoot>
    </ReducedMotionProvider>
  );
}
