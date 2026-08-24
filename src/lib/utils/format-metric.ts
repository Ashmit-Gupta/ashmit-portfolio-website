export function parseMetricValue(value: string): {
  prefix: string;
  number: number;
  suffix: string;
} | null {
  const match = value.match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numeric, suffix] = match;
  return {
    prefix,
    number: Number(numeric.replaceAll(",", "")),
    suffix,
  };
}
