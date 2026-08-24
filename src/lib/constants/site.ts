export const site = {
  name: "Ashmit Gupta",
  role: "Software Engineer",
  location: "Haryana, India",
  email: "ashmit.ann05@gmail.com",
  phone: "+91 95186 52242",
  phoneHref: "tel:+919518652242",
  linkedin: "https://www.linkedin.com/in/ashmitgupta05/",
  github: "https://github.com/Ashmit-Gupta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashmitgupta.dev",
  description:
    "Software engineer shipping production mobile, applied ML, and cloud systems. Flutter, on-device inference, and AWS-based delivery.",
  headline: "I ship production systems — mobile, applied ML, and the cloud they run on.",
  lede:
    "1.5+ years building industrial IoT, on-device machine learning, and the pipelines that take them to stores. Currently at IEnergy Digital.",
} as const;
