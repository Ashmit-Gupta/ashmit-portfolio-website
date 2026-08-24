import type { CaseStudyProject } from "@/types/project";

export const faceLivenessPipeline: CaseStudyProject = {
  slug: "face-liveness-pipeline",
  title: "Face liveness pipeline",
  subtitle: "On-device capture, anti-spoof, and liveness for One App",
  domains: ["ai", "mobile"],
  primaryDomain: "ai",
  role: "Mobile / ML engineer — pipeline owner",
  timeframe: "IEnergy Digital · One App",
  stack: [
    "Flutter",
    "Google ML Kit",
    "ONNX Runtime",
    "TensorFlow",
    "Dart isolates",
    "Kotlin",
    "Swift",
  ],
  metrics: [
    { label: "Capture latency", value: "2s" },
    { label: "Latency before", value: "6s" },
    { label: "Invalid captures", value: "−90%" },
  ],
  featured: true,
  lensOverrides: [
    {
      domain: "ai",
      headline: "A conversion and inference problem, not a camera widget",
      summary:
        "TensorFlow model to ONNX, on-device runtime, liveness signals, and isolate offload so the UI thread never runs the graph.",
      highlightSectionIds: [
        "problem",
        "engineering-decision",
        "implementation",
        "result",
      ],
    },
    {
      domain: "mobile",
      headline: "Auto-capture that field workers can finish without fighting the shutter",
      summary:
        "Detect a face, wait for liveness, take multiple profiles, and keep frame rate stable on mixed Android hardware.",
      highlightSectionIds: [
        "context",
        "implementation",
        "result",
        "reflection",
      ],
    },
  ],
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "One App is IEnergy’s unified enterprise client: attendance, tasks, approvals, internal workflows. Face capture is the gate for identity. It has to work in warehouses and yards, on uneven lighting and mid-range phones, and it cannot accept a printed photo.\n\nI owned the capture pipeline: detection, liveness, spoof resistance, and the UX that actually gets a usable set of images without a trained operator behind the camera.",
    },
    {
      id: "problem",
      heading: "Problem",
      body: "The first version was slow and noisy. Face detection sat around six seconds. Invalid and spoofed captures were common enough to poison downstream records. Heavy inference on the UI isolate dropped frames during the preview the user was trying to hold still.\n\nA cloud round-trip was the wrong default: connectivity is unreliable, latency is visible, and identity photos should not need to leave the device to decide “this is a live face.”",
    },
    {
      id: "investigation",
      heading: "Investigation",
      body: "ML Kit was already the right detector for faces and document edges. The spoof model was the bottleneck: the original tensor graph was heavier than the phones we ship to, and running it inline with camera frames made the preview stutter.\n\nWe needed a smaller runtime, a clearer split between “is there a face” and “is it live,” and a capture state machine that does not depend on a shutter tap from someone wearing gloves.",
    },
    {
      id: "options-considered",
      heading: "Options considered",
      body: "Keep TensorFlow on device and live with the latency. Move spoof checks to the server. Replace the custom model with a generic liveness SDK. Or convert the model we already trusted to ONNX and run it in ONNX Runtime for Flutter, with liveness checks we control (blink, video depth cues) and capture orchestration in Dart.\n\nA vendor SDK would hide the failure modes. A server check would fail offline and leak more imagery. Conversion plus a runtime we own was the path that kept the existing model’s behavior.",
    },
    {
      id: "engineering-decision",
      heading: "Engineering decision",
      body: "Convert TensorFlow → ONNX. Run inference with ONNX Runtime on device. Keep ML Kit for detection. Add liveness (blink, depth-from-video) before commit. Auto-capture: lock a face, wait for liveness, take multiple profile stills without a manual shutter.\n\nMove pre/post-process and inference onto Dart isolates so the preview remains a UI problem, not a graph problem. Document the pipeline in an architecture & requirements doc so the next person is not reverse-engineering a model file.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "The session is a state machine: no face → face present → liveness pending → capturing → complete. ML Kit proposes the box; the ONNX spoof head vetoes prints and screens; blink and depth checks raise the cost of a still attack.\n\nIsolates take the graph. The UI isolate only renders preview and session state. Model load and preprocessing were tuned for the hardware spread we actually have, not a flagship benchmark device. Failure paths (timeout, failed liveness, low light) retry in-session instead of dumping the user back to a form.",
      media: [{ type: "diagram", diagramId: "liveness-pipeline" }],
    },
    {
      id: "result",
      heading: "Result",
      body: "Detection-to-capture dropped from ~6s to ~2s. Invalid and unusable captures fell about 90%. Preview stayed usable because the heavy work left the UI thread.\n\nAttendance and onboarding stopped being a fight with the camera. The same pipeline is the reason I treat on-device ML as a product surface, not a demo notebook.",
    },
    {
      id: "reflection",
      heading: "Reflection",
      body: "The conversion mattered more than a new architecture diagram. We did not need a larger model. We needed the model we had, on a runtime the phone could finish in time, with liveness that matches the attack we actually see (photos), and UX that does not ask a field worker to be a photographer.\n\nIf I were doing it again I would add a recorded golden set of spoof/live clips in CI. Latency numbers drift unless you pin the device and the clip.",
    },
  ],
};
