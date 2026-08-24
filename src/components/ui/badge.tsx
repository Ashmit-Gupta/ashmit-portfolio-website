import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
