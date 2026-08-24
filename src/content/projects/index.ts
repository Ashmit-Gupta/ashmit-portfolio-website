import type { Domain } from "@/types/domain";
import type { CaseStudyProject } from "@/types/project";
import { admAmbulanceApps } from "./adm-ambulance-apps";
import { aurora } from "./aurora";
import { faceLivenessPipeline } from "./face-liveness-pipeline";
import { groundline } from "./groundline";
import { ienergyDevsecopsPlatform } from "./ienergy-devsecops-platform";
import { whatbytesRefactor } from "./whatbytes-refactor";
import { xsplito } from "./xsplito";

export const projects: CaseStudyProject[] = [
  aurora,
  faceLivenessPipeline,
  groundline,
  ienergyDevsecopsPlatform,
  whatbytesRefactor,
  xsplito,
  admAmbulanceApps,
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByDomain(domain: Domain) {
  return projects.filter((project) => project.domains.includes(domain));
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: projects[index - 1],
    next: projects[index + 1],
  };
}
