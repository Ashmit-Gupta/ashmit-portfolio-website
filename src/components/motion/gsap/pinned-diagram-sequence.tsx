"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import type { DiagramSequenceContent } from "@/types/project";

export function PinnedDiagramSequence({
  kicker,
  title,
  lede,
  beats,
}: DiagramSequenceContent) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const nodeBeats = beats.filter((beat) => beat.node);
  const closing = beats[beats.length - 1]?.node
    ? undefined
    : beats[beats.length - 1];

  useGSAP(
    () => {
      if (!root.current) return;

      const pinAllowed =
        !reduced &&
        window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

      if (!pinAllowed) {
        // The headline stack is pre-hidden via lg:opacity-0 in CSS so the
        // pinned happy path never flashes an overlapping stack before GSAP
        // sets its own initial state. When we're not going to animate
        // (narrow viewport, coarse pointer, or prefers-reduced-motion at
        // desktop width), that CSS hide would otherwise never get undone.
        const headlineEls = gsap.utils.toArray<HTMLElement>(
          "[data-sequence-headline]",
          root.current,
        );
        gsap.set(headlineEls, { opacity: 1, y: 0 });
        return;
      }

      const headlineEls = gsap.utils.toArray<HTMLElement>(
        "[data-sequence-headline]",
        root.current,
      );
      const nodeEls = gsap.utils.toArray<HTMLElement>(
        "[data-sequence-node]",
        root.current,
      );
      const ringEls = gsap.utils.toArray<HTMLElement>(
        "[data-sequence-ring]",
        root.current,
      );
      const lineEls = gsap.utils.toArray<HTMLElement>(
        "[data-sequence-line]",
        root.current,
      );
      const closingEl = root.current.querySelector<HTMLElement>(
        "[data-sequence-closing]",
      );

      gsap.set(headlineEls, { opacity: 0, y: 24 });
      gsap.set(headlineEls[0], { opacity: 1, y: 0 });

      gsap.set(nodeEls, { opacity: 0, y: 16 });
      gsap.set(ringEls, { opacity: 0 });
      gsap.set(lineEls, { scaleY: 0 });
      if (closingEl) gsap.set(closingEl, { opacity: 0, y: 8 });
      if (nodeEls[0]) gsap.set(nodeEls[0], { opacity: 1, y: 0 });
      if (ringEls[0]) gsap.set(ringEls[0], { opacity: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${beats.length * 110}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      let nodeCursor = 0;

      beats.forEach((beat, index) => {
        if (index === 0) return;

        timeline.to(headlineEls[index - 1], {
          opacity: 0,
          y: -16,
          duration: 0.35,
        });
        timeline.to(
          headlineEls[index],
          { opacity: 1, y: 0, duration: 0.35 },
          "<0.08",
        );

        if (beat.node) {
          const targetIndex = nodeCursor + 1;
          const line = lineEls[targetIndex - 1];
          const node = nodeEls[targetIndex];
          const ring = ringEls[targetIndex];
          const prevRing = ringEls[nodeCursor];

          if (line) timeline.to(line, { scaleY: 1, duration: 0.35 }, "<");
          if (node) timeline.to(node, { opacity: 1, y: 0, duration: 0.4 }, "<0.1");
          if (prevRing) timeline.to(prevRing, { opacity: 0.25, duration: 0.3 }, "<");
          if (ring) timeline.to(ring, { opacity: 1, duration: 0.4 }, "<");

          nodeCursor = targetIndex;
        } else if (closingEl) {
          timeline.to(ringEls, { opacity: 0.6, duration: 0.4, stagger: 0.04 }, "<");
          timeline.to(closingEl, { opacity: 1, y: 0, duration: 0.5 }, "<0.1");
        }
      });
    },
    { scope: root, dependencies: [reduced, beats] },
  );

  return (
    <div ref={root} className="lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            {kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-balance sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-muted">{lede}</p>

          <div className="mt-10 lg:relative lg:min-h-[20rem]">
            {beats.map((beat, index) => (
              <div
                key={beat.id}
                data-sequence-headline
                className="border-t border-line pt-5 lg:absolute lg:inset-x-0 lg:top-0 lg:opacity-0 first:lg:opacity-100"
              >
                <p className="font-mono text-xs text-accent">
                  0{index + 1} / {beat.phase}
                </p>
                <h3 className="mt-2 font-display text-2xl">{beat.headline}</h3>
                <p className="mt-3 text-muted">{beat.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {nodeBeats.map((beat, index) => (
            <div key={beat.id} className="flex flex-col items-start">
              {index > 0 ? (
                <div
                  data-sequence-line
                  className="ml-[15px] h-8 w-px origin-top bg-line"
                />
              ) : null}
              <div
                data-sequence-node
                className="relative w-full rounded-lg border border-line bg-surface px-5 py-4"
              >
                <div
                  data-sequence-ring
                  className="pointer-events-none absolute inset-0 rounded-lg border border-accent"
                />
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span className="font-mono text-sm text-foreground">
                    {beat.node?.label}
                  </span>
                </div>
                {beat.node?.meta ? (
                  <p className="mt-1 pl-5 font-mono text-xs text-muted">
                    {beat.node.meta}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
          {closing ? (
            <p
              data-sequence-closing
              className="mt-6 border-l-2 border-accent pl-4 text-sm text-muted italic"
            >
              {closing.detail}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
