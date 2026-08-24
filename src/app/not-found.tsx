import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  return (
    <section className="py-28">
      <Container>
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl">This route is not a build.</h1>
        <p className="mt-4 max-w-md text-muted">
          The page is missing. The rest of the site is still here.
        </p>
        <Link href={routes.home} className={cn(buttonVariants(), "mt-8")}>
          Back home
        </Link>
      </Container>
    </section>
  );
}
