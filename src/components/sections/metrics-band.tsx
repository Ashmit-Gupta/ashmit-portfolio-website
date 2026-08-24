import { MetricCounter } from "@/components/motion/gsap/counter";
import { Container } from "@/components/ui/container";
import { homeMetrics } from "@/content/metrics/home-metrics";

export function MetricsBand() {
  return (
    <section className="border-y border-line py-12">
      <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {homeMetrics.map((metric) => (
          <MetricCounter
            key={metric.label}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </Container>
    </section>
  );
}
