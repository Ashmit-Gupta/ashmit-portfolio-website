import type { CaseStudyProject } from "@/types/project";

export const whatbytesRefactor: CaseStudyProject = {
  slug: "whatbytes-refactor",
  title: "WhatBytes Flutter refactor",
  subtitle: "From a monolith to Clean Architecture you can test",
  domains: ["mobile"],
  primaryDomain: "mobile",
  role: "Software engineer",
  timeframe: "WhatBytes · Feb 2025 – July 2025",
  stack: ["Flutter", "Clean Architecture", "Dependency injection"],
  metrics: [
    { label: "Frame rate", value: "54 FPS" },
    { label: "FPS gain", value: "+35%" },
    { label: "Unit coverage", value: "+40%" },
  ],
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "WhatBytes had a Flutter codebase that had grown as a monolith: UI, business rules, and data access in the same widgets. Rendering cost showed up as dropped frames. Tests could not reach logic without standing up UI.\n\nDuring the role the studio also shipped production applications across gig work, healthcare, and solar/IoT. I treat those store listings as team deliveries, not as sole-author claims.",
    },
    {
      id: "problem",
      heading: "Problem",
      body: "Frame rate sat near 40 FPS in the hot paths we profiled. Business logic was not injectable, so unit tests were scarce and regressions hid in widgets.",
    },
    {
      id: "engineering-decision",
      heading: "Engineering decision",
      body: "Refactor toward Clean Architecture with dependency injection: presentation, domain, and data as separate layers. Profile with DevTools, then cut rebuilds and layout work that the monolith had accumulated.",
    },
    {
      id: "result",
      heading: "Result",
      body: "Frame rate moved from 40 to 54 FPS (~35%). Unit coverage rose ~40% because domain logic could be tested without a widget tree. The architecture is what made both numbers possible: the FPS work and the test work were the same decoupling.",
    },
  ],
};
