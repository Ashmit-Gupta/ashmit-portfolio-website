export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  /** Slugs into content/projects, in display order. */
  projectSlugs: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "ienergy-digital",
    company: "IEnergy Digital",
    role: "Software Engineer",
    period: "July 2025 – Present",
    summary:
      "Designing and shipping Aurora, an industrial IoT platform, the on-device face-liveness capture pipeline, and the AWS platform that runs the company's internal services.",
    projectSlugs: ["aurora", "face-liveness-pipeline", "ienergy-devsecops-platform"],
  },
  {
    id: "whatbytes",
    company: "WhatBytes",
    role: "Software Engineer",
    period: "Feb 2025 – June 2025",
    summary:
      "Refactored a Flutter codebase to Clean Architecture, lifting frame rate ~35% and unit test coverage ~40%.",
    projectSlugs: ["whatbytes-refactor"],
  },
  {
    id: "adm",
    company: "ADM Education and Welfare Society",
    role: "Software Engineer",
    period: "Sep 2024 – Feb 2025",
    summary:
      "Built two native Android apps for real-time NGO ambulance dispatch, with live tracking over Server-Sent Events.",
    projectSlugs: ["adm-ambulance-apps"],
  },
];
