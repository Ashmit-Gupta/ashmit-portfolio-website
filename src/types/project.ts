import type { Domain } from "./domain";

export type CaseStudySectionId =
  | "context"
  | "problem"
  | "investigation"
  | "options-considered"
  | "engineering-decision"
  | "implementation"
  | "result"
  | "reflection";

export interface DomainLensOverride {
  domain: Domain;
  headline?: string;
  highlightSectionIds?: CaseStudySectionId[];
  summary?: string;
}

export interface CaseStudySection {
  id: CaseStudySectionId;
  heading: string;
  body: string;
  media?: {
    type: "image" | "diagram" | "code";
    src?: string;
    diagramId?: string;
  }[];
}

export interface CaseStudyProject {
  slug: string;
  title: string;
  subtitle: string;
  domains: Domain[];
  primaryDomain: Domain;
  role: string;
  timeframe: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  sections: CaseStudySection[];
  lensOverrides?: DomainLensOverride[];
  featured?: boolean;
  heroImage?: string;
  externalLink?: string;
  externalLinkLabel?: string;
}
