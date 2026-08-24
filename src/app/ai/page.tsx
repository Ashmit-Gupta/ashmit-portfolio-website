import type { Metadata } from "next";
import { DomainRoute, domainMetadata } from "@/components/sections/domain-route";

export const metadata: Metadata = domainMetadata("ai");

export default function AiPage() {
  return <DomainRoute domain="ai" />;
}
