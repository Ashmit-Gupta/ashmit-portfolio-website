import type { CaseStudyProject } from "@/types/project";

export const admAmbulanceApps: CaseStudyProject = {
  slug: "adm-ambulance-apps",
  title: "Ambulance dispatch apps",
  subtitle: "Two native Android clients for live NGO dispatch",
  domains: ["mobile"],
  primaryDomain: "mobile",
  role: "Software engineer",
  timeframe: "ADM Education and Welfare Society · Sep 2024 – Feb 2025",
  stack: ["Android", "Kotlin", "SSE", "OpenStreetMap", "Firebase Auth"],
  metrics: [{ label: "Native apps", value: "2" }],
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "ADM needed dispatch tooling for an NGO ambulance operation. Latency and location accuracy are not cosmetic: they sit on the path between a call and a vehicle.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "Two native Android applications on a modular architecture: operator/dispatch and field/driver. Live tracking over Server-Sent Events instead of polling. OpenStreetMap for the map surface. Firebase Auth for identity.\n\nSSE kept a persistent stream of location and status without the battery and server cost of a tight poll loop.",
    },
    {
      id: "result",
      heading: "Result",
      body: "Dispatch and field units shared a live picture without a commercial maps bill as a blocker. The work is the start of how I think about real-time systems: the transport is part of the product.",
    },
  ],
};
