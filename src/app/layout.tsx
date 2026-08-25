import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { SiteBackdrop } from "@/components/motion/gsap/site-backdrop";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { TerminalOutro } from "@/components/site/terminal-outro";
import { site } from "@/lib/constants/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Ashmit Gupta",
    "Software Engineer",
    "Flutter Developer",
    "Mobile Developer",
    "AI/ML Engineer",
    "Cloud Engineer",
    "DevOps",
    "AWS",
    "Terraform",
    "Kubernetes",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/images/ashmit-portrait.webp",
        width: 1100,
        height: 961,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.description,
    images: ["/images/ashmit-portrait.webp"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  description: site.description,
  image: `${site.url}/images/ashmit-portrait.webp`,
  email: `mailto:${site.email}`,
  sameAs: [site.linkedin, site.github],
  worksFor: {
    "@type": "Organization",
    name: "IEnergy Digital",
  },
  knowsAbout: [
    "Flutter",
    "Mobile Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Infrastructure",
    "AWS",
    "Terraform",
    "Kubernetes",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <div id="site-shell" className="site-crt-shell flex min-h-full flex-1 flex-col">
            <SiteBackdrop />
            <div id="site-crt-shift" className="site-crt-shift relative z-10 flex min-h-full flex-1 flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <TerminalOutro />
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
