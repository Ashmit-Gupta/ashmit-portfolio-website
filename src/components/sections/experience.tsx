import Link from "next/link";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { StaggerIn } from "@/components/motion/gsap/stagger-in";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/content/experience";
import { getProjectBySlug } from "@/content/projects";
import { routes } from "@/lib/constants/routes";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
      <Container>
        <SectionHeading
          kicker="Experience"
          title="Where this was built"
          description="One engineer, three employers, one thread: ship it to production."
        />
        <div className="mt-12 divide-y divide-line border-y border-line">
          {experience.map((entry) => {
            const projects = entry.projectSlugs
              .map((slug) => getProjectBySlug(slug))
              .filter((project) => project !== undefined);

            return (
              <div key={entry.id} className="grid min-w-0 gap-6 py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl">{entry.company}</h3>
                  <p className="mt-1 font-mono text-xs tracking-[0.14em] text-muted uppercase">
                    {entry.role} · {entry.period}
                  </p>
                  <p className="mt-4 max-w-md text-muted">{entry.summary}</p>
                </div>

                <StaggerIn className="flex min-w-0 flex-col gap-3">
                  {projects.map((project) => (
                    <div key={project.slug} data-stagger-item className="min-w-0">
                      <HoverLiftCard className="min-w-0">
                        <Link
                          href={routes.project(project.slug)}
                          className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-surface/80 px-5 py-4 backdrop-blur-md transition-colors hover:border-accent"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-lg">{project.title}</p>
                            <p className="mt-1 truncate text-sm text-muted">
                              {project.subtitle}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted group-hover:text-foreground">
                            View project
                            <span aria-hidden="true">↗</span>
                          </span>
                        </Link>
                      </HoverLiftCard>
                    </div>
                  ))}
                </StaggerIn>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
