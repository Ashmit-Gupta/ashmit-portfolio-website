import type { Domain } from "./domain";

export interface ResumeEntry {
  domain: Domain | "general";
  label: string;
  file: string | null;
  updated?: string;
}
