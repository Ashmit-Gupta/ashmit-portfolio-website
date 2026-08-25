import type { CaseStudyProject } from "@/types/project";

export const ienergyDevsecopsPlatform: CaseStudyProject = {
  slug: "ienergy-devsecops-platform",
  title: "IEnergy DevSecOps platform",
  subtitle: "Terraform, kubeadm, and gated pipelines for internal services",
  domains: ["cloud"],
  primaryDomain: "cloud",
  role: "Software engineer · platform and delivery",
  timeframe: "IEnergy Digital · July 2025 – Present",
  stack: [
    "AWS",
    "Terraform",
    "Ansible",
    "Kubernetes",
    "Jenkins",
    "SonarQube",
    "Trivy",
    "GitHub Actions",
    "Docker",
    "Fastlane",
  ],
  metrics: [
    { label: "Jenkins deploy time", value: "6 min" },
    { label: "Deploy time before", value: "40 min" },
    { label: "Terraform modules", value: "7" },
    { label: "Hosted services", value: "8+" },
  ],
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "Alongside Aurora’s app CI, IEnergy needed a path for internal services that was not “SSH into a box and hope.” I architected an AWS DevSecOps platform: Terraform for the footprint, Ansible for configuration, a kubeadm cluster for workloads, Jenkins for gated deploys.\n\nThe mobile release train (GitHub Actions, Fastlane, Play, TestFlight, S3 artifacts) is the sibling system. This case study is the cluster and the Jenkins path that hosts eight-plus services.",
    },
    {
      id: "problem",
      heading: "Problem",
      body: "Deploys took around 40 minutes and were hard to audit. Instances with public IPs and SSH were the operational default. Quality and CVE scanning, if they happened, happened after the fact.\n\nYou cannot run industrial software that way. A bad image, a noisy Sonar report, or an open SSH port is not a style issue.",
    },
    {
      id: "investigation",
      heading: "Investigation",
      body: "The time was in image builds, uncached layers, and serial steps that did not need to be serial. The risk was in the network: bastions and public SSH expand the blast radius for a company that already had a TLS-chain incident on a public hostname.\n\nkubeadm, rather than jumping straight to EKS for this internal plane, was a deliberate way to understand the control plane before wrapping it in a managed API.",
    },
    {
      id: "options-considered",
      heading: "Options considered",
      body: "Lift everything onto EKS immediately: better managed control plane, more IAM surface, and a jump in cost and abstraction before the team had cluster muscle memory. Keep EC2 snowflakes: faster this week. Or: Terraform the VPC and cluster, Ansible the nodes, Jenkins with SonarQube and Trivy in front of kubectl, and SSM instead of SSH.\n\nI took the third. Groundline is where I later applied EKS + Argo CD on a personal cluster, with that muscle memory in place.",
    },
    {
      id: "engineering-decision",
      heading: "Engineering decision",
      body: "Seven Terraform modules, 30+ resources. kubeadm cluster. Jenkins pipelines that do not promote unless SonarQube quality gates pass and Trivy is clean. EC2 only in private subnets, administered through AWS Systems Manager, with no public IPs and no inbound SSH.\n\nFor the Flutter train: GitHub Actions, Dockerized builds, Fastlane, Git-tag versioning, OIDC into S3, protected production environment. Short-lived credentials. Manual approval before stores.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "Terraform owns the durable shape. Ansible owns node configuration. Jenkins runs the pipeline that builds, scans, and deploys. SSM Session Manager is the break-glass path.\n\nThe app pipeline assumes an IAM role via GitHub OIDC, uploads APK/AAB, mappings, and metadata to a private bucket, and can fan out to Firebase App Distribution or Play. Teams gets success/failure. Flavors and Xcode schemes keep dev and prod installable side by side, with dart-define validated at build time so iOS cannot silently ship without config again.",
      media: [{ type: "diagram", diagramId: "devsecops-platform" }],
    },
    {
      id: "result",
      heading: "Result",
      body: "Service deploys dropped from ~40 minutes to ~6 (~85%). App releases dropped from ~50 to ~12 minutes (~76%). The SSH attack surface for those EC2s is gone. Production store deploys require a human in GitHub Environments.\n\nThe TLS incident on the product hostname was still a server certificate-chain bug, but the platform work is how we stopped treating “the box is reachable” as a feature.",
    },
    {
      id: "reflection",
      heading: "Reflection",
      body: "Platform work is only real if an app engineer feels it as shorter, safer releases. The 12-minute Flutter pipeline is the proof for mobile. The 6-minute Jenkins path is the proof for services.\n\nI still want a MASVS-style gate as a script next to flutter test, not a wiki page. Until it fails the build, it is a wish.",
    },
  ],
};
