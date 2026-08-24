import Link from "next/link";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { StaggerIn } from "@/components/motion/gsap/stagger-in";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { domains } from "@/content/domains";
import { domainRoutes } from "@/lib/constants/routes";

export function DomainTeasers() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="Lenses"
          title="One engineer. Three ways in."
          description="The same person ships the client, the model, and the path to production. Pick the lens that matches the role you are hiring for."
        />
        <StaggerIn className="mt-12 grid gap-4 md:grid-cols-3">
          {Object.values(domains).map((domain) => (
            <div key={domain.domain} data-stagger-item>
              <HoverLiftCard>
                <Link href={domainRoutes[domain.domain]} className="block h-full">
                  <Card className="flex h-full flex-col justify-between transition-colors hover:border-accent">
                    <div>
                      <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                        {domain.kicker}
                      </p>
                      <h3 className="mt-4 font-display text-2xl leading-snug">
                        {domain.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted">{domain.lede}</p>
                    </div>
                    <p className="mt-8 inline-flex items-center gap-1 text-sm text-foreground">
                      Open {domain.kicker}
                      <span aria-hidden="true">↗</span>
                    </p>
                  </Card>
                </Link>
              </HoverLiftCard>
            </div>
          ))}
        </StaggerIn>
      </Container>
    </section>
  );
}
