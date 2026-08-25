import Link from "next/link";
import type { ReactNode } from "react";
import { TextReveal } from "@/components/motion/gsap/text-reveal";
import { Container } from "@/components/ui/container";
import { HeroNetwork } from "@/components/visuals/hero-network";
import { routes } from "@/lib/constants/routes";
import { site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

const heroButtonInner =
  "relative z-10 inline-flex h-12 items-center justify-center gap-2 px-6 font-mono text-[11px] tracking-[0.18em] uppercase transition-[color,background-color,border-color,transform] duration-300";

function HeroCta({
  href,
  children,
  variant,
}: {
  href: string;
  children: ReactNode;
  variant: "primary" | "secondary";
}) {
  const animated = variant === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        animated ? "hero-cta hero-cta-primary" : "border border-line hover:border-accent",
      )}
    >
      {animated ? <span aria-hidden="true" className="hero-cta-border" /> : null}
      <span
        className={cn(
          heroButtonInner,
          "w-full rounded-[3px]",
          animated
            ? "bg-foreground text-background group-hover:bg-accent group-hover:text-accent-fg"
            : "bg-transparent text-foreground group-hover:text-accent",
        )}
      >
        {children}
      </span>
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <TextReveal
            className="max-w-3xl font-display text-3xl leading-[1.15] text-balance sm:text-5xl"
            text={site.headline}
          />
          <p className="mt-6 max-w-xl text-lg text-muted text-pretty">{site.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <HeroCta href={`${routes.home}#experience`} variant="primary">
              See what I&apos;ve built
            </HeroCta>
            <HeroCta href={`mailto:${site.email}`} variant="secondary">
              Let&apos;s connect
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </HeroCta>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroNetwork />
        </div>
      </Container>
    </section>
  );
}
