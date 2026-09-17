import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { MethodologySection } from "@/components/sections/methodology";
import { MetricsBand } from "@/components/sections/metrics-band";
import { SelectedWork } from "@/components/sections/selected-work";
import { TerminalOutro } from "@/components/site/terminal-outro";
import { featuredProjects } from "@/content/projects";
import { site } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: site.description,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <MetricsBand />
      <ExperienceSection />
      <SelectedWork projects={featuredProjects} />
      <MethodologySection />
      <ContactSection />
      <TerminalOutro />
    </>
  );
}
