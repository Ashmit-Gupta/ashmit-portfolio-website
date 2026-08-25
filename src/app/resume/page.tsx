import type { Metadata } from "next";
import Link from "next/link";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { resumes } from "@/content/resumes/resumes";
import { domainLabels, routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download Mobile/Flutter or Cloud/DevOps resumes for Ashmit Gupta.",
  alternates: {
    canonical: routes.resume,
  },
};

export default function ResumePage() {
  return (
    <section className="py-20">
      <Container>
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Resume
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl">Pick a cut</h1>
        <p className="mt-4 max-w-xl text-muted">
          Two public PDFs. The AI resume is not written yet. The Groundline and
          face-liveness case studies cover that work in more depth than a page
          of bullets.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {resumes.map((resume) => (
            <HoverLiftCard key={resume.domain}>
              <Card>
                <p className="font-mono text-xs text-accent uppercase">
                  {resume.domain === "general"
                    ? "General"
                    : domainLabels[resume.domain]}
                </p>
                <h2 className="mt-3 font-display text-2xl">{resume.label}</h2>
                {resume.file ? (
                  <a
                    href={resume.file}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ size: "sm" }), "mt-6")}
                  >
                    Download PDF
                  </a>
                ) : (
                  <p className="mt-6 text-sm text-muted">
                    Coming soon.{" "}
                    <Link href={routes.ai} className="text-foreground underline">
                      See AI work
                    </Link>{" "}
                    or email me.
                  </p>
                )}
              </Card>
            </HoverLiftCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
