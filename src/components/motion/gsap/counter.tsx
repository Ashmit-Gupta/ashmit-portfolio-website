"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { parseMetricValue } from "@/lib/utils/format-metric";
import { cn } from "@/lib/utils/cn";

export function MetricCounter({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const parsed = parseMetricValue(value);

  useGSAP(
    () => {
      if (reduced || !parsed || !numberRef.current) return;
      const state = { n: 0 };
      gsap.to(state, {
        n: parsed.number,
        duration: 1.35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: numberRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (!numberRef.current) return;
          numberRef.current.textContent = `${parsed.prefix}${Math.round(state.n).toLocaleString("en-US")}${parsed.suffix}`;
        },
      });
    },
    { dependencies: [reduced, value] },
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="font-mono text-3xl tracking-tight text-foreground sm:text-4xl">
        {parsed ? (
          <span ref={numberRef}>
            {`${parsed.prefix}${parsed.number.toLocaleString("en-US")}${parsed.suffix}`}
          </span>
        ) : (
          value
        )}
      </p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
