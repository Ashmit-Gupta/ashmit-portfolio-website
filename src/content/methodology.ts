export const methodologySteps = [
  {
    id: "measure",
    title: "Measure the real bottleneck",
    body: "DevTools before opinions. Frame time, handshake, pipeline minutes — pick the number that is actually failing, then change one thing.",
  },
  {
    id: "separate",
    title: "Keep domain logic off the widget tree",
    body: "Screens choose layouts. Widgets render. Domain does not know about breakpoints. That is how tablet and web stay additive.",
  },
  {
    id: "delivery",
    title: "Treat delivery as part of the product",
    body: "A feature that cannot survive CI, signing, and a store review is a prototype. Tags, OIDC, and gates are product work.",
  },
  {
    id: "layer",
    title: "Debug to the actual layer",
    body: "Client, certificate chain, dart-define, Play Console — the bug is often one layer over from the stack trace you were handed.",
  },
] as const;
