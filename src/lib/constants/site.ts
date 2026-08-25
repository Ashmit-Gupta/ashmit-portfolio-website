export const site = {
  name: "Ashmit Gupta",
  role: "Software Engineer",
  location: "Haryana, India",
  email: "ashmit.ann05@gmail.com",
  phone: "+91 95186 52242",
  phoneHref: "tel:+919518652242",
  linkedin: "https://www.linkedin.com/in/ashmitgupta05/",
  github: "https://github.com/Ashmit-Gupta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashmit.xyz",
  description:
    "Software engineer building production mobile apps in Flutter, on-device AI/ML, and AWS cloud infrastructure with Terraform and Kubernetes.",
  headline: "If it's not in production, it's a blog post.",
  lede:
    "1.5+ years shipping Flutter apps to production, on-device ML inference, and AWS infrastructure with Terraform and Kubernetes. Currently building industrial IoT platforms at IEnergy Digital.",
} as const;
