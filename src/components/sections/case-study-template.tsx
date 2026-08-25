"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArchitectureDiagram } from "@/components/diagrams/architecture-diagram";
import { FadeIn } from "@/components/motion/framer/fade-in";
import { PinnedDiagramSequence } from "@/components/motion/gsap/pinned-diagram-sequence";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { MetricStat } from "@/components/ui/metric-stat";
import { domainLabels, domainRoutes, routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import type { Domain } from "@/types/domain";
import type { CaseStudyProject, CaseStudySectionId } from "@/types/project";

const sectionOrder: CaseStudySectionId[] = [
  "context",
  "problem",
  "investigation",
  "options-considered",
  "engineering-decision",
  "implementation",
  "result",
  "reflection",
];

function paragraphs(body: string) {
  return body.split("\n\n").filter(Boolean);
}

export function CaseStudyTemplate({
  project,
  prev,
  next,
}: {
  project: CaseStudyProject;
  prev?: CaseStudyProject;
  next?: CaseStudyProject;
}) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [lens, setLens] = useState<Domain>(project.primaryDomain);
  const override = project.lensOverrides?.find((item) => item.domain === lens);
  const highlights = new Set(override?.highlightSectionIds ?? []);
  const hasLens = project.domains.length > 1;

  useEffect(() => {
    setReady(true);
  }, []);

  const sections = useMemo(() => {
    const byId = new Map(project.sections.map((section) => [section.id, section]));
    return sectionOrder
      .map((id) => byId.get(id))
      .filter((section) => section !== undefined);
  }, [project.sections]);

  return (
    <article className="pb-24">
      <Container className="pt-16 sm:pt-20">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Case study
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-balance sm:text-6xl">
          {override?.headline ?? project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {override?.summary ?? project.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.domains.map((domain) => (
            <Badge key={domain}>{domainLabels[domain]}</Badge>
          ))}
        </div>
        <dl className="mt-8 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Role</dt>
            <dd className="mt-1">{project.role}</dd>
          </div>
          <div>
            <dt className="text-muted">Time</dt>
            <dd className="mt-1">{project.timeframe}</dd>
          </div>
          <div>
            <dt className="text-muted">Stack</dt>
            <dd className="mt-1 text-muted">{project.stack.join(" · ")}</dd>
          </div>
        </dl>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {project.metrics.map((metric) => (
            <MetricStat
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>

        {hasLens ? (
          <div
            className="mt-10 inline-flex rounded-full border border-line p-1"
            role="tablist"
            aria-label="Domain lens"
          >
            {project.domains.map((domain) => {
              const active = lens === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="relative rounded-full px-4 py-1.5 text-sm"
                  onClick={() => setLens(domain)}
                >
                  {active && ready && !reduced ? (
                    <motion.span
                      layoutId={`${project.slug}-lens`}
                      className="absolute inset-0 rounded-full bg-foreground"
                    />
                  ) : active ? (
                    <span className="absolute inset-0 rounded-full bg-foreground" />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10",
                      active ? "text-background" : "text-muted",
                    )}
                  >
                    {domainLabels[domain]}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </Container>

      {project.platformSequence ? (
        <Container className="mt-20">
          <PinnedDiagramSequence {...project.platformSequence} />
        </Container>
      ) : null}

      <Container className="mt-16 max-w-3xl">
        {sections.map((section) => {
          const emphasized = highlights.size === 0 || highlights.has(section.id);
          return (
            <FadeIn key={section.id}>
              <section
                className={cn(
                  "border-l-2 py-8 pl-5 sm:pl-8",
                  emphasized ? "border-accent" : "border-line opacity-60",
                )}
              >
                <h2 className="font-display text-2xl sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-muted">
                  {paragraphs(section.body).map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
                {section.media?.map((item) =>
                  item.type === "diagram" && item.diagramId ? (
                    <div key={item.diagramId} className="mt-6">
                      <ArchitectureDiagram id={item.diagramId} />
                    </div>
                  ) : null,
                )}
              </section>
            </FadeIn>
          );
        })}
      </Container>

      <Container className="mt-12 flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={domainRoutes[project.primaryDomain]}
          className="text-sm text-muted hover:text-foreground"
        >
          ← Back to {domainLabels[project.primaryDomain]}
        </Link>
        <div className="flex gap-6 text-sm">
          {prev ? (
            <Link href={routes.project(prev.slug)} className="hover:text-accent">
              Previous: {prev.title}
            </Link>
          ) : null}
          {next ? (
            <Link href={routes.project(next.slug)} className="hover:text-accent">
              Next: {next.title}
            </Link>
          ) : null}
        </div>
        {project.externalLink ? (
          <a
            href={project.externalLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-accent"
          >
            {project.externalLinkLabel ?? "External link"} ↗
          </a>
        ) : null}
      </Container>
    </article>
  );
}
