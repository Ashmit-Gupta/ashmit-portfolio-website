"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";

export function SiteBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);
  const orbC = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      const scrollOrbs = [
        { el: orbA.current, y: 220, x: -80 },
        { el: orbB.current, y: -160, x: 90 },
        { el: orbC.current, y: 140, x: 40 },
      ];

      scrollOrbs.forEach(({ el, y, x }) => {
        if (!el) return;
        gsap.to(el, {
          y,
          x,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
          },
        });
      });

      if (grid.current) {
        gsap.to(grid.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (!fine || !spot.current) return;

      gsap.set(spot.current, { xPercent: -50, yPercent: -50, opacity: 0 });

      const onMove = (event: PointerEvent) => {
        gsap.to(spot.current, {
          x: event.clientX,
          y: event.clientY,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(spot.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);
      document.documentElement.addEventListener("mouseleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
        document.documentElement.removeEventListener("mouseleave", onLeave);
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={grid}
        className="absolute -inset-[20%] opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 163, 106, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 163, 106, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <div
        ref={orbA}
        className="absolute top-[-10%] left-[-8%] h-[42vw] max-h-[520px] w-[42vw] max-w-[520px]"
      >
        <div className="orb-breathe h-full w-full rounded-full bg-accent/25 blur-3xl" />
      </div>
      <div
        ref={orbB}
        className="absolute top-[18%] right-[-12%] h-[36vw] max-h-[460px] w-[36vw] max-w-[460px]"
      >
        <div className="orb-breathe orb-breathe-delayed h-full w-full rounded-full bg-[#7d9b8a]/20 blur-3xl" />
      </div>
      <div
        ref={orbC}
        className="absolute bottom-[-8%] left-[28%] h-[32vw] max-h-[400px] w-[32vw] max-w-[400px]"
      >
        <div className="orb-breathe orb-breathe-slow h-full w-full rounded-full bg-accent/16 blur-3xl" />
      </div>

      <div
        ref={spot}
        className="absolute top-0 left-0 h-[42rem] w-[42rem] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(201,163,106,0.18) 0%, rgba(201,163,106,0.05) 32%, transparent 68%)",
        }}
      />

      <div className="site-grain absolute inset-0 opacity-[0.09]" />
    </div>
  );
}
