import { FadeIn } from "@/components/motion/framer/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

export function ContactSection() {
  return (
    <section className="border-t border-line py-24">
      <Container>
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Contact
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl text-balance sm:text-5xl">
            If the work maps to a role, write.
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            Open to conversations about senior mobile, applied ML, or platform
            engineering.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              {site.email}
            </a>
            <a
              href={site.phoneHref}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              {site.phone}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              LinkedIn
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              GitHub
            </a>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
