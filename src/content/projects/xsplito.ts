import type { CaseStudyProject } from "@/types/project";

export const xsplito: CaseStudyProject = {
  slug: "xsplito",
  title: "Xsplito",
  subtitle: "A Flutter expense-splitting app shipped to Play Store",
  domains: ["mobile"],
  primaryDomain: "mobile",
  role: "Solo · design through store listing",
  timeframe: "Personal project",
  stack: ["Flutter", "Riverpod", "Dio", "Firebase", "Clean Architecture"],
  metrics: [{ label: "Distribution", value: "Play Store" }],
  externalLink:
    "https://play.google.com/store/apps/details?id=com.xsplito_mobile_app",
  externalLinkLabel: "Play Store",
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "Xsplito is a personal, cross-platform expense splitter. I wanted a full path through Clean Architecture, Riverpod, and Firebase that ended in a public store listing, not a repo that only runs on my device.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "Flutter client with Clean Architecture and Riverpod. Dio for HTTP. Firebase for auth and push. The same discipline I use at work, applied to a product I could iterate on without a committee.",
    },
    {
      id: "result",
      heading: "Result",
      body: "Shipped to the Play Store as a public listing people can install. The value for me was the last mile: signing, store listing, and living with something that is no longer only on my device.",
    },
  ],
};
