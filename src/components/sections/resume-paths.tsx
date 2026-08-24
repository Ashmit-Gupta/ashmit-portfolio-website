import Link from "next/link";
import { HoverLiftCard } from "@/components/motion/framer/hover-lift-card";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { resumes } from "@/content/resumes/resumes";
import { domainLabels } from "@/lib/constants/routes";

export function ResumePaths() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="Resumes"
          title="Two PDFs, one person"
          description="Mobile-first and cloud-first cuts of the same career. An AI-specific resume is not ready yet."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {resumes.map((resume) => {
            const inner = (
              <Card className="flex h-full flex-col justify-between">
                <div>
                  <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                    {resume.domain === "general"
                      ? "General"
                      : domainLabels[resume.domain]}
                  </p>
                  <h3 className="mt-3 font-display text-2xl">{resume.label}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {resume.file
                      ? `Updated ${resume.updated}`
                      : "Coming soon — Groundline is the AI case study in the meantime."}
                  </p>
                </div>
                <p className="mt-8 text-sm">
                  {resume.file ? "Download PDF" : "Not available yet"}
                </p>
              </Card>
            );

            if (!resume.file) {
              return (
                <div key={resume.domain} className="opacity-70">
                  {inner}
                </div>
              );
            }

            return (
              <HoverLiftCard key={resume.domain}>
                <a
                  href={resume.file}
                  className="block h-full"
                  target="_blank"
                  rel="noreferrer"
                >
                  {inner}
                </a>
              </HoverLiftCard>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted">
          Prefer a page? See the{" "}
          <Link href="/resume/" className="text-foreground underline">
            resume index
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
