import { FadeIn } from "@/components/motion/framer/fade-in";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { techEcosystem } from "@/content/skills/tech-ecosystem";

export function TechEcosystem() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="Stack"
          title="Technologies I work with"
          description="Grouped by the work, not a logo wall."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {techEcosystem.map((group) => (
            <FadeIn key={group.domain}>
              <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                {group.label}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1 text-sm text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
