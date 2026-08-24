import type { Metadata } from "next";
import { DomainRoute, domainMetadata } from "@/components/sections/domain-route";

export const metadata: Metadata = domainMetadata("cloud");

export default function CloudPage() {
  return <DomainRoute domain="cloud" />;
}
