"use client";

import { useRef } from "react";
import { methodologySteps } from "@/content/methodology";
import { gsap, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";

export function PinnedSequence() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const pinAllowed =
        !reduced &&
        window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      if (!pinAllowed || !root.current) return;

      const steps = gsap.utils.toArray<HTMLElement>(
        "[data-method-step]",
        root.current,
      );

      gsap.set(steps, { opacity: 0, y: 28 });
      gsap.set(steps[0], { opacity: 1, y: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${steps.length * 90}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      steps.forEach((step, index) => {
        if (index === 0) return;
        timeline.to(steps[index - 1], { opacity: 0.18, y: -12, duration: 0.4 });
        timeline.to(step, { opacity: 1, y: 0, duration: 0.5 }, "<");
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="lg:flex lg:h-[100svh] lg:items-center">
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
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
        <ol className="flex flex-col gap-8 lg:relative lg:min-h-[22rem]">
          {methodologySteps.map((step, index) => (
            <li
              key={step.id}
              data-method-step
              className="border-t border-line pt-5 lg:absolute lg:inset-x-0 lg:top-0 lg:opacity-0 first:lg:opacity-100"
            >
              <p className="font-mono text-xs text-accent">
                0{index + 1}
              </p>
              <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
              <p className="mt-3 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
