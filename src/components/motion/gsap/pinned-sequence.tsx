"use client";

import { useRef } from "react";
import { methodologySteps } from "@/content/methodology";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";

export function PinnedSequence() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current || !fill.current) return;

      if (reduced) {
        gsap.set(fill.current, { scaleY: 1 });
        root.current
          .querySelectorAll("[data-method-step]")
          .forEach((step) => step.classList.add("is-active"));
        return;
      }

      gsap.fromTo(
        fill.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 35%",
            scrub: 0.4,
          },
        },
      );

      const steps = gsap.utils.toArray<HTMLElement>(
        "[data-method-step]",
        root.current,
      );

      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 68%",
          onEnter: () => step.classList.add("is-active"),
          onEnterBack: () => step.classList.add("is-active"),
          onLeaveBack: () => step.classList.remove("is-active"),
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="methodology-sequence grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
      <div className="lg:sticky lg:top-28">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Methodology
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-balance sm:text-5xl">
          How I engineer
        </h2>
        <p className="mt-4 max-w-md text-muted">
          The same sequence on a map, a model, or a cluster: measure, separate
          concerns, ship through a gate, then debug the layer that is actually
          broken.
        </p>
      </div>

      <ol className="relative flex flex-col">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 bottom-2 left-[calc(0.6875rem-0.5px)] w-px bg-line sm:left-[calc(0.8125rem-0.5px)]"
        />
        <span
          ref={fill}
          aria-hidden="true"
          className="methodology-sequence-fill pointer-events-none absolute top-2 bottom-2 left-[calc(0.6875rem-0.5px)] w-px origin-top bg-accent sm:left-[calc(0.8125rem-0.5px)]"
        />

        {methodologySteps.map((step, index) => (
          <li
            key={step.id}
            data-method-step
            className="methodology-sequence-step relative py-8 pl-10 sm:pl-14 first:pt-0 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="methodology-sequence-dot absolute top-10 left-0 h-[1.375rem] w-[1.375rem] rounded-full border border-line bg-background sm:top-9 sm:h-[1.625rem] sm:w-[1.625rem]"
            />
            <p className="font-mono text-xs text-accent">0{index + 1}</p>
            <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
            <p className="mt-3 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
