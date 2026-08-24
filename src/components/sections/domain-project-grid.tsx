import { StaggerIn } from "@/components/motion/gsap/stagger-in";
import { Container } from "@/components/ui/container";
import { ProjectCard } from "@/components/sections/selected-work";
import type { CaseStudyProject } from "@/types/project";

export function DomainProjectGrid({
  projects,
}: {
  projects: CaseStudyProject[];
}) {
  return (
    <section className="pb-24">
      <Container>
        <StaggerIn className="grid gap-4 md:grid-cols-2">
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
