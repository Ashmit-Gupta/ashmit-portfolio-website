import type { Domain } from "@/types/domain";

export const techEcosystem: { domain: Domain; label: string; items: string[] }[] =
  [
    {
      domain: "mobile",
      label: "Applications",
      items: [
        "Flutter",
        "Dart",
        "Riverpod",
        "Bloc",
        "Kotlin",
        "Swift",
        "Hive",
        "Firebase",
      ],
    },
    {
      domain: "ai",
      label: "AI Systems",
      items: [
        "ONNX Runtime",
        "ML Kit",
        "TensorFlow",
        "Ollama",
        "Qdrant",
        "FastAPI",
        "RAG",
        "BM25",
      ],
    },
    {
      domain: "cloud",
      label: "Cloud & Infrastructure",
      items: [
        "AWS",
        "Terraform",
        "Kubernetes",
        "GitHub Actions",
        "Jenkins",
        "Docker",
        "Argo CD",
        "Trivy",
      ],
    },
  ];
