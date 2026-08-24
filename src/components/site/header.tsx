"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks, routes } from "@/lib/constants/routes";
import { site } from "@/lib/constants/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/55 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href={routes.home} className="font-display text-lg tracking-tight">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`mailto:${site.email}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Contact
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex w-4 flex-col gap-1" aria-hidden="true">
            <span
              className={cn(
                "h-px w-full bg-foreground transition",
                open && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn("h-px w-full bg-foreground transition", open && "opacity-0")}
            />
            <span
              className={cn(
                "h-px w-full bg-foreground transition",
                open && "-translate-y-[5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`mailto:${site.email}`}
                className="py-2 text-accent"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
