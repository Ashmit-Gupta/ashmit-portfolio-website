import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/content/experience";
import { getProjectBySlug } from "@/content/projects";

export function ExperienceSection() {
  const entries = experience.map((entry) => ({
    id: entry.id,
    company: entry.company,
    role: entry.role,
    period: entry.period,
    summary: entry.summary,
    projects: entry.projectSlugs
      .map((slug) => getProjectBySlug(slug))
      .filter((project) => project !== undefined)
      .map((project) => ({
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
      })),
  }));

  return (
    <section id="experience" className="py-24">
      <Container>
        <SectionHeading
          kicker="Experience"
          title="Where this was built"
          description="One engineer, three employers, one thread: ship it to production."
        />
        <ExperienceTimeline entries={entries} />
      </Container>
    </section>
  );
}
