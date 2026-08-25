"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { routes } from "@/lib/constants/routes";
import { site } from "@/lib/constants/site";
import { gsap } from "@/lib/animations/gsap-config";
import { easeOut } from "@/lib/animations/motion-variants";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { cn } from "@/lib/utils/cn";
import { Logomark } from "@/components/site/logomark";

const SCROLL_ON_PX = 100;
const SCROLL_OFF_PX = 56;

const headerNav = [
  { href: routes.mobile, label: "Mobile" },
  { href: routes.ai, label: "AI / RAG" },
  { href: routes.cloud, label: "Cloud" },
  { href: routes.resume, label: "Resume" },
] as const;

const ctaClass =
  "group inline-flex items-center gap-2 rounded-[2px] border border-accent/35 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase transition-[color,border-color,background-color] duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function isActivePath(pathname: string, href: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return path === href;
}

function ContactCta({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href={`mailto:${site.email}`} className={cn(ctaClass, className)} onClick={onClick}>
      Get in touch
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled((prev) => {
        if (!prev && y > SCROLL_ON_PX) return true;
        if (prev && y < SCROLL_OFF_PX) return false;
        return prev;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    gsap.ticker.add(update);
    return () => {
      window.removeEventListener("scroll", update);
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "header-enter sticky top-0 z-50 w-full border-b",
          reduced
            ? undefined
            : "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          scrolled
            ? "border-white/10 bg-background/80 shadow-[0_12px_32px_-28px_rgba(0,0,0,0.9)] backdrop-blur-[8px]"
            : "border-white/[0.06] bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href={routes.home}
            className="group flex min-w-0 items-center gap-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={`${site.name}, ${site.role}`}
          >
            <Logomark className="h-9 w-9" animated={!reduced} />
            <span className="flex min-w-0 flex-col justify-center leading-none">
              <span className="font-display text-[15px] tracking-tight text-foreground sm:text-base">
                {site.name}
              </span>
              <span className="mt-1 hidden font-mono text-[9px] tracking-[0.22em] text-muted uppercase sm:block">
                {site.role}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 whitespace-nowrap lg:flex" aria-label="Primary">
            {headerNav.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-1 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active ? "text-foreground" : "text-muted hover:text-accent",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-3 bg-accent transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-50",
                    )}
                  />
                </Link>
              );
            })}
            <ContactCta className="ml-1" />
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-white/10 transition-colors duration-300 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            aria-expanded={open}
            aria-controls="site-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex w-3.5 flex-col gap-1" aria-hidden="true">
              <span
                className={cn(
                  "h-px w-full bg-foreground",
                  reduced ? undefined : "transition duration-300",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-full bg-foreground",
                  reduced ? undefined : "transition duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "h-px w-full bg-foreground",
                  reduced ? undefined : "transition duration-300",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.nav
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22, ease: easeOut }}
              id="site-mobile-nav"
              className="border-t border-white/[0.08] bg-background lg:hidden"
              aria-label="Mobile"
            >
              <div className="mx-auto flex max-h-[calc(100dvh-3.5rem)] w-full max-w-6xl flex-col overflow-y-auto px-5 py-2 sm:px-8">
                {headerNav.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        active ? "text-foreground" : "text-muted hover:text-accent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                      {active ? (
                        <span aria-hidden="true" className="h-px w-3 bg-accent" />
                      ) : null}
                    </Link>
                  );
                })}
                <div className="mt-3 mb-4">
                  <ContactCta onClick={() => setOpen(false)} />
                </div>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
