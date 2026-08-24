import type { Domain } from "@/types/domain";

export const routes = {
  home: "/",
  mobile: "/mobile/",
  ai: "/ai/",
  cloud: "/cloud/",
  resume: "/resume/",
  project: (slug: string) => `/projects/${slug}/`,
} as const;

export const navLinks = [
  { href: routes.mobile, label: "Mobile" },
  { href: routes.ai, label: "AI" },
  { href: routes.cloud, label: "Cloud" },
  { href: routes.resume, label: "Resume" },
] as const;

export const domainRoutes: Record<Domain, string> = {
  mobile: routes.mobile,
  ai: routes.ai,
  cloud: routes.cloud,
};

export const domainLabels: Record<Domain, string> = {
  mobile: "Mobile",
  ai: "AI / ML",
  cloud: "Cloud",
};
