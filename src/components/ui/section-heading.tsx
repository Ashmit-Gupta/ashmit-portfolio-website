import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  kicker,
  title,
  description,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {kicker ? (
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl leading-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-muted text-pretty">{description}</p>
      ) : null}
    </div>
  );
}
