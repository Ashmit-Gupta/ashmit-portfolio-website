import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { devopsResume } from "@/content/resumes/resumes";
import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Cloud / DevOps resume for Ashmit Gupta — infrastructure, CI/CD, and platform engineering.",
  alternates: {
    canonical: routes.resume,
  },
};

export default function ResumePage() {
  const file = devopsResume.file;

  return (
    <section className="py-20">
      <Container>
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Resume
        </p>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl sm:text-6xl">
              Cloud / DevOps
            </h1>
            <p className="mt-4 max-w-xl text-muted">
              Infrastructure, CI/CD, and the platform the product runs on.
              Preview the PDF here, or download a copy.
            </p>
          </div>
          {file ? (
            <a
              href={file}
              download="Ashmit_Gupta_DevOps_Resume.pdf"
              className={cn(buttonVariants({ size: "lg" }), "shrink-0")}
            >
              Download PDF
            </a>
          ) : null}
        </div>

        {file ? (
          <div className="mt-10 overflow-hidden rounded-xl border border-line bg-surface">
            <iframe
              title="Ashmit Gupta Cloud / DevOps resume"
              src={`${file}#toolbar=0&navpanes=0&zoom=100`}
              className="block h-[1100px] w-full bg-background"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
