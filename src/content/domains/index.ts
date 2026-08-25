import type { Domain } from "@/types/domain";

export interface DomainPageContent {
  domain: Domain;
  kicker: string;
  title: string;
  lede: string;
}

export const domains: Record<Domain, DomainPageContent> = {
  mobile: {
    domain: "mobile",
    kicker: "Mobile",
    title: "Flutter in production: maps, identity, stores.",
    lede: "Industrial IoT, on-device capture, store releases, and the incident work that keeps them alive. Android, iOS, tablet, and the CI that actually ships.",
  },
  ai: {
    domain: "ai",
    kicker: "AI / ML",
    title: "On-device inference and retrieval you can measure.",
    lede: "ONNX liveness on phones, dual-pipeline RAG with a fixed LLM, and the difference between a demo notebook and a system with sources.",
  },
  cloud: {
    domain: "cloud",
    kicker: "Cloud",
    title: "Clusters, gates, and short-lived credentials.",
    lede: "Terraform, kubeadm, Jenkins with SonarQube and Trivy, EKS for Groundline, and Flutter trains that do not wait 50 minutes.",
  },
};
