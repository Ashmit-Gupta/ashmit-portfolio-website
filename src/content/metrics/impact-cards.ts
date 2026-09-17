export type ImpactLane = "product" | "platform";
export type ImpactDomain = "mobile" | "devops" | "cloud";
export type ImpactVariant = "delta" | "comparison" | "zero";

export type ImpactCard = {
  id: string;
  metric: string;
  lane: ImpactLane;
  domain: ImpactDomain;
  title: string;
  variant: ImpactVariant;
  deltaFrom?: string;
  deltaTo?: string;
  beforeWidth: number;
  afterWidth: number;
  comparisonA?: { label: string; value: string; width: number };
  comparisonB?: { label: string; value: string; width: number };
  description: string;
  tool: string;
};

export const impactGroups: {
  lane: ImpactLane;
  label: string;
  domains: string;
  cards: ImpactCard[];
}[] = [
  {
    lane: "product",
    label: "Product",
    domains: "Mobile",
    cards: [
      {
        id: "mobile-perf-cold-start",
        metric: "cold_start",
        lane: "product",
        domain: "mobile",
        title: "Cold Start",
        variant: "delta",
        deltaFrom: "3–5s",
        deltaTo: "1.4s",
        beforeWidth: 100,
        afterWidth: 28,
        description: "Measured p50 on Samsung A-series hardware",
        tool: "Firebase Performance traces, isolate parsing",
      },
      {
        id: "mobile-perf-memory",
        metric: "dart_heap",
        lane: "product",
        domain: "mobile",
        title: "Dart Heap",
        variant: "delta",
        deltaFrom: "320MB",
        deltaTo: "20MB",
        beforeWidth: 100,
        afterWidth: 6,
        description: "Live heap, pagination and screen-specific DTOs",
        tool: "Flutter DevTools memory profiling",
      },
      {
        id: "applied-ml",
        metric: "face_verify",
        lane: "product",
        domain: "mobile",
        title: "Face Verification",
        variant: "delta",
        deltaFrom: "6s",
        deltaTo: "2s",
        beforeWidth: 100,
        afterWidth: 33,
        description: "Detection and validation latency on device",
        tool: "ML Kit detection + ONNX Runtime anti-spoof",
      },
    ],
  },
  {
    lane: "platform",
    label: "Platform",
    domains: "DevOps · Cloud",
    cards: [
      {
        id: "release-engineering",
        metric: "ci_pipeline",
        lane: "platform",
        domain: "devops",
        title: "CI Pipeline",
        variant: "delta",
        deltaFrom: "50min",
        deltaTo: "12min",
        beforeWidth: 100,
        afterWidth: 24,
        description: "Dependency caching and parallel builds",
        tool: "GitHub Actions + Fastlane",
      },
      {
        id: "ai-infrastructure",
        metric: "rag_bench",
        lane: "platform",
        domain: "cloud",
        title: "Retrieval Architectures",
        variant: "comparison",
        beforeWidth: 62,
        afterWidth: 78,
        comparisonA: {
          label: "arch-a",
          value: "BM25 / OKF",
          width: 62,
        },
        comparisonB: {
          label: "arch-b",
          value: "Qdrant",
          width: 78,
        },
        description:
          "Two retrieval stacks, benchmarked head-to-head on one LLM",
        tool: "Qdrant vector search vs BM25/OKF traversal",
      },
      {
        id: "cloud-infrastructure",
        metric: "oidc_deploy",
        lane: "platform",
        domain: "cloud",
        title: "Cluster Auth",
        variant: "zero",
        deltaFrom: "keys",
        deltaTo: "0",
        beforeWidth: 100,
        afterWidth: 0,
        description: "Cluster deploy authenticates with no stored credentials",
        tool: "Terraform + GitHub OIDC → AWS IAM",
      },
    ],
  },
];
