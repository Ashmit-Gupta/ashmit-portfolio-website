import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/content/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
      <Container>
        <SectionHeading
          kicker="Experience"
          title="Where this was built"
          description="One engineer, three employers, one thread: ship it to production."
        />
        <ExperienceTimeline entries={experience} />
      </Container>
    </section>
  );
}
