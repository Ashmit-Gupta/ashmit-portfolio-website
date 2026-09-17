export interface ExperienceProjectCard {
  slug?: string;
  title: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  projects: ExperienceProjectCard[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "ienergy-digital",
    company: "IEnergy Digital",
    role: "Software Engineer",
    period: "July 2025 – Present",
    summary:
      "Designing and shipping real-time IoT monitoring systems for industrial machines and field teams, an on-device face-liveness verification pipeline for workforce attendance, and the adaptive Flutter architecture and cloud infrastructure that run the company's internal services and products.",
    projects: [
      {
        slug: "aurora",
        title: "Real-Time IoT Monitoring Platform",
        description:
          "Live telemetry, GPS, and BLE sensor tracking for industrial machines and field workers, rendered on a real-time map with 3,500+ live markers across 250+ connected machines.",
      },
      {
        slug: "face-liveness-pipeline",
        title: "On-Device Face Liveness & Anti-Spoof Verification",
        description:
          "Face-capture pipeline for workforce attendance combining on-device ML detection, a custom anti-spoof classifier, and an active liveness challenge to defeat photo and video spoofing.",
      },
      {
        slug: "ienergy-devsecops-platform",
        title: "Cloud Infrastructure & DevSecOps Platform",
        description:
          "Terraform-provisioned AWS infrastructure running a Kubernetes cluster for internal services, with a Jenkins pipeline gated by Trivy scanning and a self-hosted SonarQube server posting per-push severity reports to Teams.",
      },
      {
        title: "Adaptive Multi-Platform Architecture",
        description:
          "Authored the internal standard for a single codebase adapting across phone, tablet, foldable, and desktop, with strict separation between logic, layout, and rendering so new form factors are additive, not rewrites.",
      },
    ],
  },
  {
    id: "whatbytes",
    company: "WhatBytes",
    role: "Software Engineer",
    period: "Feb 2025 – June 2025",
    summary:
      "Refactored a Flutter codebase to Clean Architecture, lifting frame rate ~35% and unit test coverage ~40%.",
    projects: [
      {
        slug: "whatbytes-refactor",
        title: "WhatBytes Flutter refactor",
        description: "From a monolith to Clean Architecture you can test",
      },
    ],
  },
  {
    id: "adm",
    company: "ADM Education and Welfare Society",
    role: "Software Engineer",
    period: "Sep 2024 – Feb 2025",
    summary:
      "Built two native Android apps for real-time NGO ambulance dispatch, with live tracking over Server-Sent Events.",
    projects: [
      {
        slug: "adm-ambulance-apps",
        title: "Ambulance dispatch apps",
        description: "Two native Android clients for live NGO dispatch",
      },
    ],
  },
];
