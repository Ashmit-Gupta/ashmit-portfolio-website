import type { Domain } from "@/types/domain";

export const techEcosystem: { domain: Domain; label: string; items: string[] }[] =
  [
    {
      domain: "mobile",
      label: "Mobile",
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
      label: "AI / ML",
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
      label: "Cloud",
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
