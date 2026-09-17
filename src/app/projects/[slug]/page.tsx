import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuroraCaseStudy } from "@/components/case-studies/aurora-case-study";
import { DevsecopsCaseStudy } from "@/components/case-studies/devsecops-case-study";
import { FaceLivenessCaseStudy } from "@/components/case-studies/face-liveness-case-study";
import { CaseStudyTemplate } from "@/components/sections/case-study-template";
import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
} from "@/content/projects";
import { routes } from "@/lib/constants/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.subtitle,
    alternates: {
      canonical: routes.project(project.slug),
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(slug);

  if (slug === "aurora") {
    return <AuroraCaseStudy prev={prev} next={next} />;
  }

  if (slug === "face-liveness-pipeline") {
    return <FaceLivenessCaseStudy prev={prev} next={next} />;
  }

  if (slug === "ienergy-devsecops-platform") {
    return <DevsecopsCaseStudy prev={prev} next={next} />;
  }

  return <CaseStudyTemplate project={project} prev={prev} next={next} />;
}
