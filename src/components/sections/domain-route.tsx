import type { Metadata } from "next";
import { DomainHero } from "@/components/sections/domain-hero";
import { DomainProjectGrid } from "@/components/sections/domain-project-grid";
import { domains } from "@/content/domains";
import { getProjectsByDomain } from "@/content/projects";
import { domainRoutes } from "@/lib/constants/routes";
import type { Domain } from "@/types/domain";

export function DomainRoute({ domain }: { domain: Domain }) {
  return (
    <>
      <DomainHero content={domains[domain]} />
      <DomainProjectGrid projects={getProjectsByDomain(domain)} />
    </>
  );
}

export function domainMetadata(domain: Domain): Metadata {
  const content = domains[domain];
  return {
    title: content.kicker,
    description: content.lede,
    alternates: {
      canonical: domainRoutes[domain],
    },
  };
}
