const diagrams: Record<string, { title: string; nodes: string[]; edges: string[] }> = {
  "aurora-map": {
    title: "Aurora map path",
    nodes: ["Telemetry / FCM / SSE", "Viewport + tile cache", "Pre-rendered overlays", "Live map"],
    edges: ["ingest", "scope", "paint"],
  },
  "liveness-pipeline": {
    title: "Capture pipeline",
    nodes: ["Camera preview", "ML Kit detect", "ONNX spoof + liveness", "Auto-capture"],
    edges: ["frames", "isolate", "commit"],
  },
  "groundline-platform": {
    title: "Groundline plane",
    nodes: ["React", "FastAPI", "Qdrant / BM25", "Ollama on ClusterIP"],
    edges: ["query", "retrieve", "generate"],
  },
  "devsecops-platform": {
    title: "Delivery gates",
    nodes: ["Git tag / PR", "Build + scan", "Approve", "Cluster / stores"],
    edges: ["CI", "Sonar / Trivy", "OIDC / Jenkins"],
  },
};

export function ArchitectureDiagram({ id }: { id: string }) {
  const diagram = diagrams[id];
  if (!diagram) return null;

  return (
    <figure className="overflow-x-auto rounded-2xl border border-line bg-background p-5">
      <figcaption className="mb-4 font-mono text-xs tracking-[0.18em] text-muted uppercase">
        {diagram.title}
      </figcaption>
      <ol className="flex min-w-max items-center gap-2">
        {diagram.nodes.map((node, index) => (
          <li key={node} className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
              {node}
            </span>
            {index < diagram.edges.length ? (
              <span className="font-mono text-[11px] text-accent">
                {diagram.edges[index]} →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
