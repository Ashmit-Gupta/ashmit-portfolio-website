"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { impactGroups, type ImpactCard } from "@/content/metrics/impact-cards";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

const impactCards = impactGroups.flatMap((group) => group.cards);

function TraceRow({
  label,
  value,
  width,
  tone,
  animate,
  delay = 0,
}: {
  label: string;
  value: string;
  width: number;
  tone: "before" | "after" | "warn" | "bench-a" | "bench-b";
  animate: boolean;
  delay?: number;
}) {
  return (
    <div className="pipeline-trace-row grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-2.5">
      <span className="font-mono text-[0.58rem] tracking-[0.12em] text-muted/70 uppercase">
        {label}
      </span>
      <div className="pipeline-trace-track relative h-2 overflow-hidden rounded-sm bg-background/80">
        <motion.div
          className={cn("pipeline-trace-fill h-full rounded-sm", `pipeline-trace-${tone}`)}
          initial={animate ? { width: 0 } : { width: `${width}%` }}
          animate={{ width: `${width}%` }}
          transition={{
            duration: animate ? 0.9 : 0,
            delay: animate ? delay : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
      <span className="min-w-[3.5rem] text-right font-mono text-[0.62rem] tracking-wide text-muted/90">
        {value}
      </span>
    </div>
  );
}

function TracePanel({ card, animate }: { card: ImpactCard; animate: boolean }) {
  if (card.variant === "comparison" && card.comparisonA && card.comparisonB) {
    return (
      <div className="space-y-2.5">
        <TraceRow
          label={card.comparisonA.label}
          value={card.comparisonA.value}
          width={card.comparisonA.width}
          tone="bench-a"
          animate={animate}
          delay={0.08}
        />
        <TraceRow
          label={card.comparisonB.label}
          value={card.comparisonB.value}
          width={card.comparisonB.width}
          tone="bench-b"
          animate={animate}
          delay={0.18}
        />
      </div>
    );
  }

  if (card.variant === "zero") {
    return (
      <div className="space-y-2.5">
        <TraceRow
          label="before"
          value={card.deltaFrom ?? "keys"}
          width={card.beforeWidth}
          tone="warn"
          animate={animate}
          delay={0.08}
        />
        <TraceRow
          label="after"
          value={`${card.deltaTo} keys`}
          width={Math.max(card.afterWidth, 2)}
          tone="after"
          animate={animate}
          delay={0.18}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <TraceRow
        label="before"
        value={card.deltaFrom ?? ""}
        width={card.beforeWidth}
        tone="before"
        animate={animate}
        delay={0.08}
      />
      <TraceRow
        label="after"
        value={card.deltaTo ?? ""}
        width={card.afterWidth}
        tone="after"
        animate={animate}
        delay={0.18}
      />
    </div>
  );
}

function ImpactCardItem({
  card,
  animate,
}: {
  card: ImpactCard;
  animate: boolean;
}) {
  return (
    <article className="pipeline-stage-card group relative w-[min(100vw-3rem,23rem)] shrink-0 rounded-xl border border-line bg-surface/75 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-60"
      />

      <header className="border-b border-line/70 px-4 py-3">
        <h3 className="font-display text-lg tracking-tight text-foreground/95">
          {card.title}
        </h3>
      </header>

      <div className="px-4 py-4">
        <TracePanel card={card} animate={animate} />
        <p className="mt-4 text-sm leading-relaxed text-muted">{card.description}</p>
      </div>

      <footer className="border-t border-line/70 px-4 py-3">
        <p className="font-mono text-[0.65rem] leading-relaxed tracking-wide text-muted/85">
          <span className="text-accent/75">tool · </span>
          {card.tool}
        </p>
      </footer>
    </article>
  );
}

export function ImpactMarquee() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const animate = inView && !reduced;
  const loop = [...impactCards, ...impactCards];

  return (
    <div ref={sectionRef} className="pipeline-impact relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/85 to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/85 to-transparent sm:w-28"
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "pipeline-marquee-viewport overflow-hidden py-1",
          reduced && "pipeline-marquee-reduced",
        )}
      >
        <div
          className={cn(
            "pipeline-marquee-track flex w-max gap-4 pr-4 sm:gap-5 sm:pr-5",
            reduced && "pipeline-marquee-static",
          )}
          aria-label="Engineering impact"
        >
          {loop.map((card, index) => (
            <ImpactCardItem
              key={`${card.id}-${index}`}
              card={card}
              animate={animate}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
