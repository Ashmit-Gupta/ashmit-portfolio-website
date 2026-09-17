"use client";

import Link from "next/link";
import { useRef } from "react";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { StaggerIn } from "@/components/motion/gsap/stagger-in";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap-config";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { routes } from "@/lib/constants/routes";

export type TimelineProject = {
  slug?: string;
  title: string;
  description: string;
};

export type TimelineEntry = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  projects: TimelineProject[];
};

export function ExperienceTimeline({ entries }: { entries: TimelineEntry[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!root.current || !fill.current) return;

      if (reduced) {
        gsap.set(fill.current, { scaleY: 1 });
        root.current
          .querySelectorAll("[data-timeline-item]")
          .forEach((item) => item.classList.add("is-active"));
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
            start: "top 72%",
            end: "bottom 28%",
            scrub: 0.45,
          },
        },
      );

      const items = gsap.utils.toArray<HTMLElement>(
        "[data-timeline-item]",
        root.current,
      );

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 68%",
          onEnter: () => item.classList.add("is-active"),
          onEnterBack: () => item.classList.add("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="experience-timeline relative mt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-2 bottom-2 left-[calc(0.6875rem-0.5px)] w-px bg-line sm:left-[calc(0.8125rem-0.5px)]"
      />
      <div
        ref={fill}
        aria-hidden="true"
        className="experience-timeline-fill pointer-events-none absolute top-2 bottom-2 left-[calc(0.6875rem-0.5px)] w-px origin-top bg-accent sm:left-[calc(0.8125rem-0.5px)]"
      />

      <ol className="flex flex-col">
        {entries.map((entry) => (
          <li
            key={entry.id}
            data-timeline-item
            className="experience-timeline-item relative grid min-w-0 gap-6 py-10 pl-10 sm:pl-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16"
          >
            <span
              aria-hidden="true"
              className="experience-timeline-dot absolute top-12 left-0 h-[1.375rem] w-[1.375rem] rounded-full border border-line bg-background sm:h-[1.625rem] sm:w-[1.625rem]"
            />

            <div className="min-w-0">
              <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">
                {entry.period}
              </p>
              <h3 className="mt-2 font-display text-2xl">{entry.company}</h3>
              <p className="mt-1 font-mono text-xs tracking-[0.14em] text-muted uppercase">
                {entry.role}
              </p>
              <p className="mt-4 max-w-md text-muted">{entry.summary}</p>
            </div>

            <StaggerIn className="flex min-w-0 flex-col gap-3">
              {entry.projects.map((project) => {
                const inner = (
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-surface/80 px-5 py-4 backdrop-blur-md">
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-snug">
                        {project.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {project.description}
                      </p>
                    </div>
                    {project.slug ? (
                      <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm text-muted group-hover:text-foreground">
                        View project
                        <span aria-hidden="true">↗</span>
                      </span>
                    ) : null}
                  </div>
                );

                return (
                  <div
                    key={project.slug ?? project.title}
                    data-stagger-item
                    className="min-w-0"
                  >
                    <HoverLiftCard className="min-w-0">
                      {project.slug ? (
                        <Link
                          href={routes.project(project.slug)}
                          className="group block transition-colors hover:[&>div]:border-accent"
                        >
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </HoverLiftCard>
                  </div>
                );
              })}
            </StaggerIn>
          </li>
        ))}
      </ol>
    </div>
  );
}
