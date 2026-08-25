import Link from "next/link";
import { site } from "@/lib/constants/site";
import { navLinks, routes } from "@/lib/constants/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Link href={routes.home} className="font-display text-xl">
            {site.name}
          </Link>
          <p className="mt-2 text-sm text-muted">
            {site.role}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            Email
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
