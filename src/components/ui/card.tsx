import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
