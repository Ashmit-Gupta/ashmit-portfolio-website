import { cn } from "@/lib/utils/cn";

export function MetricStat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="font-mono text-2xl tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
