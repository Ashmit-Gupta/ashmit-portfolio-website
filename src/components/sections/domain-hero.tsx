import { Container } from "@/components/ui/container";
import type { DomainPageContent } from "@/content/domains";

export function DomainHero({ content }: { content: DomainPageContent }) {
  return (
    <section className="pt-16 pb-10 sm:pt-24">
      <Container>
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {content.kicker}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-balance sm:text-6xl">
          {content.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{content.lede}</p>
      </Container>
    </section>
  );
}
