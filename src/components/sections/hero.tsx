import Link from "next/link";
import { TextReveal } from "@/components/motion/gsap/text-reveal";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroNetwork } from "@/components/visuals/hero-network";
import { routes } from "@/lib/constants/routes";
import { site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-accent uppercase">
            {site.role}
          </p>
          <TextReveal
            className="mt-5 max-w-3xl font-display text-4xl leading-[1.12] text-balance sm:text-6xl"
            text={site.headline}
          />
          <p className="mt-6 max-w-xl text-lg text-muted text-pretty">{site.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${routes.home}#selected-work`} className={cn(buttonVariants({ size: "lg" }))}>
              Selected work
            </Link>
            <Link
              href={`mailto:${site.email}`}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Email me
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroNetwork />
        </div>
      </Container>
    </section>
  );
}
