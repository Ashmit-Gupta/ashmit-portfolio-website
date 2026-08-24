import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact";
import { DomainTeasers } from "@/components/sections/domain-teasers";
import { HeroSection } from "@/components/sections/hero";
import { MethodologySection } from "@/components/sections/methodology";
import { MetricsBand } from "@/components/sections/metrics-band";
import { ResumePaths } from "@/components/sections/resume-paths";
import { SelectedWork } from "@/components/sections/selected-work";
import { TechEcosystem } from "@/components/sections/tech-ecosystem";
import { featuredProjects } from "@/content/projects";
import { site } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.description,
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <MetricsBand />
      <DomainTeasers />
      <SelectedWork projects={featuredProjects} />
      <MethodologySection />
      <TechEcosystem />
      <ResumePaths />
      <ContactSection />
    </>
  );
}
