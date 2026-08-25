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

export interface DiagramSequenceBeat {
  id: string;
  phase: string;
  headline: string;
  detail: string;
  /** Omit on a beat that should read as a closing statement rather than add a new diagram node. */
  node?: {
    label: string;
    meta?: string;
  };
}

export interface DiagramSequenceContent {
  kicker: string;
  title: string;
  lede: string;
  beats: DiagramSequenceBeat[];
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
  /** A pinned, scroll-scrubbed sequence that builds a diagram up cumulatively beat by beat. */
  platformSequence?: DiagramSequenceContent;
}
