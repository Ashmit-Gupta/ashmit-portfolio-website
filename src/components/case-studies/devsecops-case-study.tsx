"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { domainLabels, domainRoutes, routes } from "@/lib/constants/routes";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import type { CaseStudyProject } from "@/types/project";
import "./devsecops-case-study.css";

const GITHUB_DETAILED =
  "https://raw.githubusercontent.com/Ashmit-Gupta/k8-test-project/main/Scopify-Server-Architecture-Detailed.drawio";

const DETAILED_FILE = "/architecture/scopify-platform-architecture.drawio";
const SERVER_FILE = "/architecture/scopify-server-architecture.drawio";

const DIAGRAM_TABS = [
  {
    id: "detailed-aws",
    file: DETAILED_FILE,
    github: GITHUB_DETAILED,
    title: "AWS infrastructure topology",
    description:
      "VPC, public/private subnets, Nginx edge, NAT, security groups, and cluster EC2 layout across AZs.",
  },
  {
    id: "k8s-workload-arch",
    file: DETAILED_FILE,
    github: GITHUB_DETAILED,
    title: "Kubernetes workload architecture",
    description:
      "NodePort → Ingress Controller → Ingress → ClusterIP Service → Pods across control-plane and worker nodes.",
  },
  {
    id: "page-overview",
    file: SERVER_FILE,
    title: "Overview and tooling",
    description:
      "Four control planes: Terraform for AWS, Ansible for nodes, Git + Argo CD for cluster state, Jenkins for image CI.",
  },
  {
    id: "page-vpc",
    file: SERVER_FILE,
    title: "VPC and networking",
    description:
      "Custom VPC, public/private /20s across two AZs, Internet Gateway, NAT, and SSM interface endpoints.",
  },
  {
    id: "page-ec2",
    file: SERVER_FILE,
    title: "EC2 roles",
    description:
      "Public Nginx edge. Private Jenkins, Sonar, Nexus, kubeadm master, and two workers.",
  },
  {
    id: "page-k8s",
    file: SERVER_FILE,
    title: "Kubernetes bootstrap",
    description:
      "kubeadm on EC2, Calico CNI, Ingress-Nginx, EBS CSI, Argo CD, and application namespaces.",
  },
  {
    id: "page-traffic",
    file: SERVER_FILE,
    title: "Traffic and cluster contents",
    description:
      "Host-based TLS at the edge. Tools proxy to private EC2. Apps proxy to Ingress NodePort, then Services and Pods.",
  },
] as const;

const PLANES = [
  {
    kicker: "01 · Cloud",
    title: "Terraform",
    body: "VPC, subnets, routes, NAT, EIPs, EC2, security groups, IAM, and SSM VPC endpoints.",
  },
  {
    kicker: "02 · Nodes",
    title: "Ansible",
    body: "containerd, kubeadm, Calico, Ingress-Nginx, Jenkins/Sonar/Nexus, and the Nginx edge.",
  },
  {
    kicker: "03 · Cluster state",
    title: "Git + Argo CD",
    body: "Deployments, Services, Ingress, Jobs, and StorageClass references as desired state.",
  },
  {
    kicker: "04 · Application CI",
    title: "Jenkins",
    body: "Image build, Trivy scan, GHCR push, then a manifest tag bump for GitOps.",
  },
] as const;

const TOPO_STEPS = [
  {
    num: "01 / EDGE",
    title: "One public hop, then private",
    body: "Cloudflare resolves the host to the Nginx Elastic IP. Nginx terminates TLS and routes by Host. That is the only intentional public compute.",
  },
  {
    num: "02 / TOOLS",
    title: "CI lives inside the VPC",
    body: "jenkins, sonar, and nexus proxy to private EC2 ports. No public IPs on those boxes. Admin access is SSM Session Manager, not inbound SSH.",
  },
  {
    num: "03 / CLUSTER",
    title: "kubeadm, not a managed API yet",
    body: "Master plus two workers across private AZs. Ingress-Nginx NodePort is the Kubernetes upstream. Calico is the pod network.",
  },
  {
    num: "04 / GITOPS",
    title: "Jenkins builds. Argo deploys.",
    body: "CI pushes an immutable GHCR tag and bumps manifests in Git. Argo CD reconciles. A PreSync migrate Job has to succeed before the rollout.",
  },
] as const;

const ADRS = [
  {
    id: "ADR-001",
    title: "kubeadm instead of EKS",
    body: "Own the control plane first. Lower lab cost, real CNI/Ingress/CSI wiring, no managed SLA.",
  },
  {
    id: "ADR-002",
    title: "SSM instead of a bastion",
    body: "Private EC2s have no inbound SSH. Session Manager is the break-glass path.",
  },
  {
    id: "ADR-004",
    title: "Nginx as the sole public edge",
    body: "One EIP, host routing, wildcard TLS. Cheap and explicit. Also a single HTTPS SPOF.",
  },
  {
    id: "ADR-005",
    title: "Argo CD for CD",
    body: "Git is the desired-state API. Jenkins must not be the cluster mutator of record.",
  },
  {
    id: "ADR-006",
    title: "GHCR for images",
    body: "Immutable git-SHA tags. No stale :latest deploys onto the workers.",
  },
  {
    id: "ADR-010",
    title: "Calico CNI",
    body: "Classic kubeadm networking on the overlay the cluster actually runs.",
  },
] as const;

const TF_STEPS = [
  "VPC",
  "IGW + public/private subnets",
  "Public route table → Internet Gateway",
  "NAT EIP → NAT Gateway",
  "Private default route → NAT",
  "Security groups",
  "IAM SSM role + instance profile",
  "VPC endpoints for SSM",
  "EC2 instances",
  "Nginx EIP associated to the edge node",
] as const;

function viewerSrc(fileUrl: string, pageId: string) {
  const params = new URLSearchParams({
    highlight: "0000ff",
    edit: "_blank",
    layers: "1",
    nav: "1",
    "page-id": pageId,
  });
  return `https://viewer.diagrams.net/?${params.toString()}#U${encodeURIComponent(fileUrl)}`;
}

function DrawioGallery() {
  const [activeId, setActiveId] = useState(DIAGRAM_TABS[0].id);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const active = DIAGRAM_TABS.find((tab) => tab.id === activeId) ?? DIAGRAM_TABS[0];

  const fileUrl = useMemo(() => {
    const host = origin.replace(/^https?:\/\//, "");
    const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    if (local && "github" in active && active.github) return active.github;
    if (!origin) return active.github ?? active.file;
    return `${origin}${active.file}`;
  }, [active, origin]);

  const src = viewerSrc(fileUrl, active.id);

  return (
    <div className="ds-gallery">
      <div className="ds-tabs" role="tablist" aria-label="Architecture diagrams">
        {DIAGRAM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active.id}
            className={`ds-tab${tab.id === active.id ? " is-active" : ""}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <p className="ds-tab-desc">{active.description}</p>
      <div className="ds-frame-wrap">
        <iframe
          key={active.id}
          title={active.title}
          className="ds-frame"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="ds-gallery-links">
        <a href={src} target="_blank" rel="noopener noreferrer">
          Open live diagram
        </a>
        <a href={active.file} download>
          Download .drawio
        </a>
      </div>
    </div>
  );
}

export function DevsecopsCaseStudy({
  prev,
  next,
}: {
  prev?: CaseStudyProject;
  next?: CaseStudyProject;
}) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;

    if (reduced) {
      rootEl
        .querySelectorAll(
          ".ds-stat, .ds-beat, .ds-plane, .ds-node, .ds-connector, .ds-tf-row, .ds-adr",
        )
        .forEach((el) => el.classList.add("is-visible"));
      setStage(3);
      return;
    }

    const fadeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    rootEl.querySelectorAll(".ds-stat, .ds-beat").forEach((el) => fadeIo.observe(el));

    const stagger = (selector: string, delay: number) => {
      const container = rootEl.querySelector(selector);
      if (!container) return;
      const items = Array.from(container.children);
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            items.forEach((item, i) => {
              window.setTimeout(() => item.classList.add("is-visible"), i * delay);
            });
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.3 },
      );
      io.observe(container);
      return io;
    };

    const observers = [
      stagger("[data-ds-planes]", 120),
      stagger("[data-ds-ci]", 160),
      stagger("[data-ds-gitops]", 160),
      stagger("[data-ds-tf]", 70),
      stagger("[data-ds-adrs]", 90),
    ];

    const steps = rootEl.querySelectorAll<HTMLElement>("[data-ds-step]");
    const stepIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nextStage = Number(entry.target.getAttribute("data-stage"));
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            if (nextStage === stageRef.current) return;
            stageRef.current = nextStage;
            setStage(nextStage);
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" },
    );
    steps.forEach((step) => stepIo.observe(step));

    return () => {
      fadeIo.disconnect();
      observers.forEach((io) => io?.disconnect());
      stepIo.disconnect();
    };
  }, [reduced]);

  return (
    <article ref={root} className="ds-cs pb-16">
      <div className="ds-wrap">
        <header className="ds-hero">
          <p className="ds-eyebrow">
            Case study <span className="ds-tag">Cloud</span>
            <span className="ds-tag">DevSecOps</span>
          </p>
          <h1 className="ds-title">Terraform, kubeadm, and gated pipelines for internal services</h1>
          <p className="ds-subtitle">
            Four control planes on one VPC: Terraform for the footprint, Ansible for
            the nodes, Jenkins for images, Argo CD for desired cluster state.
          </p>
          <div className="ds-meta-row">
            <div>
              <div className="ds-label">Role</div>
              <div className="ds-value">Software engineer · platform and delivery</div>
            </div>
            <div>
              <div className="ds-label">Stack</div>
              <div className="ds-value">
                AWS, Terraform, Ansible, Kubernetes, Jenkins, SonarQube, Trivy,
                Argo CD, GHCR
              </div>
            </div>
            <div>
              <div className="ds-label">Surface</div>
              <div className="ds-value">
                Private kubeadm cluster, Nginx edge, GitOps delivery
              </div>
            </div>
          </div>
        </header>

        <div className="ds-stats">
          <div className="ds-stat">
            <div className="ds-num">6 min</div>
            <div className="ds-lbl">Jenkins deploy time</div>
          </div>
          <div className="ds-stat">
            <div className="ds-num">40 min</div>
            <div className="ds-lbl">deploy time before</div>
          </div>
          <div className="ds-stat">
            <div className="ds-num">7</div>
            <div className="ds-lbl">Terraform modules</div>
          </div>
          <div className="ds-stat">
            <div className="ds-num">8+</div>
            <div className="ds-lbl">hosted services</div>
          </div>
        </div>

        <section className="ds-beat">
          <p className="ds-beat-label">Context</p>
          <h2 className="ds-beat-title">Not SSH into a box and hope</h2>
          <p className="ds-beat-body">
            Internal services needed a path that was auditable: Terraform for the
            footprint, Ansible for configuration, a kubeadm cluster for workloads,
            Jenkins for gated image builds, Argo CD for what the cluster should be.
          </p>
          <p className="ds-beat-body">
            The diagrams on this page are the live topology — VPC, edge, nodes, and
            the Kubernetes traffic path — not a simplified slide.
          </p>
        </section>

        <section className="ds-beat">
          <p className="ds-beat-label">Problem</p>
          <h2 className="ds-beat-title">Forty minutes, public IPs, scans after the fact</h2>
          <p className="ds-beat-body">
            Deploys were slow and hard to audit. Instances with public IPs and SSH
            were the operational default. Quality and CVE scanning, if they happened,
            happened after the image was already running.
          </p>
        </section>

        <section className="ds-beat">
          <p className="ds-beat-label">Investigation</p>
          <h2 className="ds-beat-title">Time in the build. Risk in the network.</h2>
          <p className="ds-beat-body">
            The time was in image builds, uncached layers, and serial steps that did
            not need to be serial. The risk was bastions and public SSH.
          </p>
          <p className="ds-beat-body">
            kubeadm on EC2, rather than jumping straight to EKS, was a way to own
            the control plane, CNI, Ingress, and CSI before wrapping them in a
            managed API.
          </p>
        </section>
      </div>

      <div className="ds-wrap ds-wide">
        <section className="ds-beat" style={{ borderBottom: "none", paddingBottom: 8 }}>
          <p className="ds-beat-label" style={{ opacity: 1, transform: "none" }}>
            Control planes
          </p>
          <h2 className="ds-beat-title" style={{ opacity: 1, transform: "none" }}>
            Four owners, four lifecycles
          </h2>
          <div className="ds-planes" data-ds-planes>
            {PLANES.map((plane) => (
              <div key={plane.title} className="ds-plane">
                <div className="ds-plane-kicker">{plane.kicker}</div>
                <div className="ds-plane-title">{plane.title}</div>
                <div className="ds-plane-body">{plane.body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ds-wrap ds-wide">
        <section className="ds-beat">
          <p className="ds-beat-label">Architecture</p>
          <h2 className="ds-beat-title">The diagrams used to design and operate this</h2>
          <p className="ds-beat-body">
            AWS topology and Kubernetes traffic path from the platform draw.io
            source, plus the overview, VPC, EC2, bootstrap, and traffic pages.
          </p>
          <DrawioGallery />
        </section>
      </div>

      <div className="ds-wrap ds-wide">
        <section className="ds-pinned-section">
          <p className="ds-beat-label" style={{ opacity: 1, transform: "none" }}>
            Traffic
          </p>
          <h2
            className="ds-beat-title"
            style={{ opacity: 1, transform: "none", marginBottom: 0 }}
          >
            Scroll through the hops
          </h2>
          <div className="ds-pinned-grid">
            <div className="ds-pinned-slot">
              <div className="ds-topo">
                <div className={`ds-layer${stage >= 0 ? " is-on is-accent" : ""}`}>
                  <div className="ds-layer-name">DNS / TLS</div>
                  <div className="ds-layer-body">Cloudflare → Nginx EIP</div>
                </div>
                <div className={`ds-layer${stage >= 1 ? " is-on" : ""}`}>
                  <div className="ds-layer-name">Public subnet</div>
                  <div className="ds-layer-body">Nginx edge · NAT Gateway</div>
                </div>
                <div className={`ds-layer${stage >= 2 ? " is-on" : ""}`}>
                  <div className="ds-layer-name">Private subnet</div>
                  <div className="ds-layer-body">
                    Jenkins · Sonar · Nexus · master · workers
                  </div>
                </div>
                <div className={`ds-layer${stage >= 3 ? " is-on is-accent" : ""}`}>
                  <div className="ds-layer-name">GitOps</div>
                  <div className="ds-layer-body">
                    GHCR image → Git bump → Argo CD PreSync → Pods
                  </div>
                </div>
              </div>
            </div>
            <div>
              {TOPO_STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className="ds-pstep"
                  data-ds-step
                  data-stage={index}
                >
                  <p className="ds-pstep-num">{step.num}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="ds-wrap">
        <section className="ds-beat">
          <p className="ds-beat-label">CI</p>
          <h2 className="ds-beat-title">Jenkins builds. It does not own the cluster.</h2>
          <p className="ds-beat-body">
            Push to GitHub → Jenkins on private EC2 → docker build → Trivy → GHCR
            → commit image tags in the infra repo. Branch maps to env: main to
            prod, dev to dev.
          </p>
          <div className="ds-diagram-wrap" data-ds-ci>
            <div className="ds-node">
              <div className="ds-node-title">GitHub</div>
              <div className="ds-node-sub">backend repo</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">Jenkins</div>
              <div className="ds-node-sub">private EC2</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">GHCR</div>
              <div className="ds-node-sub">git SHA tag</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">Manifest bump</div>
              <div className="ds-node-sub">infra repo</div>
            </div>
          </div>
        </section>

        <section className="ds-beat">
          <p className="ds-beat-label">GitOps</p>
          <h2 className="ds-beat-title">Desired state is Git, not kubectl set image</h2>
          <p className="ds-beat-body">
            Argo CD watches Kustomize paths. Sync starts with a PreSync migrate
            Job. If that Job fails, the Deployment does not roll. Drift from a
            manual edit is something Git can heal.
          </p>
          <div className="ds-diagram-wrap" data-ds-gitops>
            <div className="ds-node">
              <div className="ds-node-title">Git manifests</div>
              <div className="ds-node-sub">dev / prod</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">Argo CD</div>
              <div className="ds-node-sub">reconciler</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">PreSync Job</div>
              <div className="ds-node-sub">migrate</div>
            </div>
            <div className="ds-connector" />
            <div className="ds-node">
              <div className="ds-node-title">Kubernetes</div>
              <div className="ds-node-sub">rollout</div>
            </div>
          </div>
        </section>

        <section className="ds-beat">
          <p className="ds-beat-label">Security</p>
          <h2 className="ds-beat-title">The cluster has no public IP. The edge does.</h2>
          <p className="ds-beat-body">
            Internet can hit Nginx on 80/443. Upstream is private. Cluster security
            groups expose 6443 and NodePorts only inside the VPC CIDR. Data volumes
            are encrypted gp3. Admins use SSM, not a bastion.
          </p>
        </section>

        <section className="ds-beat">
          <p className="ds-beat-label">Terraform</p>
          <h2 className="ds-beat-title">Create order is the architecture</h2>
          <p className="ds-beat-body">
            Private EC2 must not boot before NAT and SSM endpoints exist. Nodes
            wait on VPC, endpoints, IAM, and security groups — not just subnet IDs.
          </p>
          <div className="ds-tf" data-ds-tf>
            {TF_STEPS.map((step, index) => (
              <div key={step} className="ds-tf-row">
                <div className="ds-tf-n">{String(index + 1).padStart(2, "0")}</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ds-wrap ds-wide">
        <section className="ds-beat">
          <p className="ds-beat-label">Decisions</p>
          <h2 className="ds-beat-title">ADRs that still hold after the boxes are gone</h2>
          <p className="ds-beat-body">
            kubeadm vs EKS, SSM vs bastion, Nginx as edge, Argo for CD, GHCR for
            images, Calico for the overlay. Each one is a tradeoff, not a slogan.
          </p>
          <div className="ds-adr-row" data-ds-adrs>
            {ADRS.map((adr) => (
              <div key={adr.id} className="ds-adr">
                <div className="ds-adr-id">{adr.id}</div>
                <div className="ds-adr-title">{adr.title}</div>
                <div className="ds-adr-body">{adr.body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="ds-wrap">
        <section className="ds-beat">
          <p className="ds-beat-label">Result</p>
          <h2 className="ds-beat-title">Shorter deploys, no SSH as a feature</h2>
          <p className="ds-beat-body">
            Service deploys dropped from about 40 minutes to about 6. The SSH
            attack surface for those EC2s is gone. Production promotion is Git,
            scans, and Argo — not a session on the node.
          </p>
        </section>

        <div className="ds-foot flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={domainRoutes.cloud} className="hover:text-foreground">
            ← Back to {domainLabels.cloud}
          </Link>
          <div className="flex gap-6">
            {prev ? (
              <Link href={routes.project(prev.slug)} className="hover:text-accent">
                Previous: {prev.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={routes.project(next.slug)} className="hover:text-accent">
                Next: {next.title}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
