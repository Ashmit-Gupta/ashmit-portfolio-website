import Link from "next/link";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { StaggerIn } from "@/components/motion/gsap/stagger-in";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CaseStudyProject } from "@/types/project";
import { domainLabels, routes } from "@/lib/constants/routes";

export function ProjectCard({ project }: { project: CaseStudyProject }) {
  return (
    <HoverLiftCard>
      <Link href={routes.project(project.slug)} className="block h-full">
        <Card className="flex h-full flex-col justify-between hover:border-accent">
          <div>
            <div className="flex flex-wrap gap-2">
              {project.domains.map((domain) => (
                <Badge key={domain}>{domainLabels[domain]}</Badge>
              ))}
            </div>
            <h3 className="mt-4 font-display text-2xl">{project.title}</h3>
            <p className="mt-2 text-sm text-muted">{project.subtitle}</p>
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <p className="font-mono text-xs text-muted">
              {project.metrics[0]?.value} {project.metrics[0]?.label}
            </p>
            <span className="inline-flex items-center gap-1 text-sm">
              Read
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </Card>
      </Link>
    </HoverLiftCard>
  );
}

export function SelectedWork({ projects }: { projects: CaseStudyProject[] }) {
  return (
    <section id="selected-work" className="py-24">
      <Container>
        <SectionHeading
          kicker="Selected work"
          title="Four pieces worth sitting with"
          description="Industrial IoT, on-device liveness, a retrieval lab on EKS, and the DevSecOps path that ships the rest."
        />
        <StaggerIn className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.slug} data-stagger-item>
              <ProjectCard project={project} />
            </div>
          ))}
        </StaggerIn>
      </Container>
    </section>
  );
}
