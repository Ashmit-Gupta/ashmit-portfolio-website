import type { CaseStudyProject } from "@/types/project";

export const groundline: CaseStudyProject = {
  slug: "groundline",
  title: "Groundline",
  subtitle: "A RAG platform for comparing retrieval strategies under control",
  domains: ["ai", "cloud"],
  primaryDomain: "ai",
  role: "Solo — product, model plane, and AWS platform",
  timeframe: "Personal project",
  stack: [
    "Python",
    "FastAPI",
    "React",
    "Ollama",
    "Qdrant",
    "BM25",
    "PostgreSQL",
    "AWS EKS",
    "Terraform",
    "Argo CD",
    "GitHub Actions",
    "Trivy",
  ],
  metrics: [
    { label: "EKS resources", value: "39+" },
    { label: "Node groups", value: "3" },
    { label: "Retrieval paths", value: "2" },
  ],
  featured: true,
  lensOverrides: [
    {
      domain: "ai",
      headline: "Same LLM. Same query. Only retrieval changes.",
      summary:
        "Vector search in Qdrant versus BM25 over structured concepts, with latency and source quality instrumented on a fixed Ollama model.",
      highlightSectionIds: [
        "problem",
        "engineering-decision",
        "implementation",
        "result",
      ],
    },
    {
      domain: "cloud",
      headline: "The model plane is a cluster, not a notebook",
      summary:
        "Custom EKS via Terraform, IRSA, JWT in front of ClusterIP-only AI services, GitOps through Argo CD with Trivy on the way in.",
      highlightSectionIds: [
        "context",
        "options-considered",
        "implementation",
        "result",
      ],
    },
  ],
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "Groundline is a personal full-stack RAG platform: React on the front, FastAPI for the API and AI server, Ollama serving the LLM. It is not another chatbot wrapper. I built it to answer a specific question: how much does retrieval strategy matter when the model stays fixed?\n\nThis is separate from the internal documentation assistant I later built at IEnergy. Groundline is the lab — two retrieval pipelines, one model, measurable divergence. The company tool is a productized search box over KT docs.",
    },
    {
      id: "problem",
      heading: "Problem",
      body: "Most RAG demos change too many variables at once: different prompts, different models, different chunkers. You cannot tell whether a better answer came from the embedder or from luck.\n\nI also did not want the AI plane on a laptop process or a public endpoint. If this was going to be a real system, the model runner belongs behind auth, on a cluster I can rebuild from Terraform, with no inbound path except what I explicitly expose.",
    },
    {
      id: "investigation",
      heading: "Investigation",
      body: "I locked the generator (llama via Ollama), top_k, and query set. Pipeline A is the default industry path: chunk, embed, store in Qdrant, retrieve by cosine similarity. Pipeline B is lexical: BM25 over concept files, with graph-style expansion through linked relationships.\n\nThe working hypothesis was simple. Vector RAG wins on broad unstructured text. Structured lexical retrieval wins when the question is a named concept and semantic nearness is not the same as correctness. A chunk can be close to “what is an internet gateway” and still be the wrong object.",
    },
    {
      id: "options-considered",
      heading: "Options considered",
      body: "Run everything in Docker Compose on a single node — faster to start, no IRSA, no GitOps, and a dead end the first time I need isolation. Put the LLM on a public GPU API — cheaper operationally, but it destroys the “same model, local weights” constraint and the cost story.\n\nManaged vector DBs would have removed Qdrant ops. They would also have mixed vendor retrieval into the experiment. I kept Qdrant and BM25 in my process so the only moving part is the retrieval strategy.",
    },
    {
      id: "engineering-decision",
      heading: "Engineering decision",
      body: "Two pipelines, one LLM, shared evaluation harness (retrieval latency, generation latency, sources, scores). Provision a custom EKS cluster with Terraform (39+ resources, three node groups). Scope IAM via IRSA. Put JWT in front of the AI plane. Keep model services on ClusterIP only.\n\nShip with GitHub Actions → ECR → Argo CD. Fail the path if Trivy is unhappy. Observe with Grafana. Recreate from code, not from a console session I will not remember in six months.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "FastAPI exposes a single query API that fans out to both retrievers, then calls Ollama with the chosen (or compared) context. React renders answers, sources, and timing side by side so a retrieval miss is visible instead of hidden behind a fluent paragraph.\n\nTerraform owns VPC through node groups. Argo CD reconciles the workloads. The AI services never get a public load balancer. If you cannot present a token, you never reach the generator.",
      media: [{ type: "diagram", diagramId: "groundline-platform" }],
    },
    {
      id: "result",
      heading: "Result",
      body: "I can ask the same question twice and see where vector and BM25 disagree — in sources, not in vibes. The cluster is rebuildable. The model plane is not on the public internet. Trivy is a gate, not a dashboard I glance at after a breach.\n\nThe project also taught the difference between “I can deploy Kubernetes” and “I can explain why this service is ClusterIP and that one is not.”",
    },
    {
      id: "reflection",
      heading: "Reflection",
      body: "Groundline exists because I was tired of RAG posts that never hold the model constant. The cloud work exists because a lab that cannot be reproduced is a blog post.\n\nThe IEnergy RAG assistant (chunk → embed → vector index → local Docker model runner) is the applied cousin: same retrieval instincts, different job. That one is for developers who should not grep a share drive. This one is for proving retrieval is doing the work.",
    },
  ],
};
