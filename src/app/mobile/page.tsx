import type { Metadata } from "next";
import { DomainRoute, domainMetadata } from "@/components/sections/domain-route";

export const metadata: Metadata = domainMetadata("mobile");

export default function MobilePage() {
  return <DomainRoute domain="mobile" />;
}
