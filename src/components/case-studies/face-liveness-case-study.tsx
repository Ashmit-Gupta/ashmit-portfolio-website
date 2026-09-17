"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { domainLabels, domainRoutes, routes } from "@/lib/constants/routes";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import type { CaseStudyProject } from "@/types/project";
import "./face-liveness-case-study.css";

const SCAN_STAGES = [
  { elapsed: 0.0, conf: 0 },
  { elapsed: 0.6, conf: 35 },
  { elapsed: 1.3, conf: 75 },
  { elapsed: 2.0, conf: 100 },
] as const;

const SCAN_STEPS = [
  {
    num: "01 / DETECT",
    title: "Exactly one face, or none of this runs",
    body: "ML Kit proposes a bounding box on the primary face and checks pose, distance, and occlusion. A second face in frame gets flagged and excluded, group shots don't get past this step.",
  },
  {
    num: "02 / LANDMARK",
    title: "Euler angles and a missing nose",
    body: "Head angle via Euler X/Y/Z, distance from the bounding-box-to-frame ratio, and occlusion caught by a missing nose landmark.",
  },
  {
    num: "03 / LIVENESS",
    title: "Prove it's not a photo",
    body: "The ONNX spoof head vetoes prints and screens. A two-blink challenge raises the cost of a replayed video specifically.",
  },
  {
    num: "04 / CAPTURE",
    title: "Committed, no shutter tap",
    body: "Multiple profile stills captured automatically once every check clears. The person never touches a button.",
  },
] as const;

const OPTIONS = [
  {
    tag: "Rejected",
    title: "Keep TensorFlow on device",
    reason:
      "Same graph, same phones. Latency stays at six seconds and the preview keeps stuttering.",
    chosen: false,
  },
  {
    tag: "Rejected",
    title: "Move spoof checks to a server",
    reason:
      "Fails offline, adds visible round-trip latency, and leaks more identity imagery than necessary.",
    chosen: false,
  },
  {
    tag: "Rejected",
    title: "Swap in a vendor liveness SDK",
    reason:
      "Faster to integrate, but it hides the failure modes behind someone else's black box.",
    chosen: false,
  },
  {
    tag: "Chosen",
    title: "Convert to ONNX, own the runtime",
    reason:
      "Keeps the model already trusted, runs it on a runtime built for mobile, and liveness logic stays in our control.",
    chosen: true,
  },
] as const;

const FT_BEFORE: { kind: "on" | "drop"; h: string }[] = [
  { kind: "on", h: "62%" },
  { kind: "on", h: "58%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "66%" },
  { kind: "on", h: "60%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "64%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "59%" },
  { kind: "on", h: "63%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "57%" },
  { kind: "on", h: "65%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "61%" },
  { kind: "on", h: "60%" },
  { kind: "drop", h: "6%" },
  { kind: "on", h: "64%" },
  { kind: "on", h: "58%" },
  { kind: "on", h: "62%" },
];

const FT_AFTER = [
  "64%",
  "66%",
  "62%",
  "65%",
  "63%",
  "67%",
  "64%",
  "65%",
  "62%",
  "66%",
  "64%",
  "63%",
  "65%",
  "67%",
  "64%",
  "62%",
  "65%",
  "66%",
  "63%",
  "64%",
];

function tweenNumber(
  setter: (value: number) => void,
  from: number,
  to: number,
  duration: number,
) {
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    setter(from + (to - from) * p);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function scanActive(elStage: number, idx: number) {
  return elStage === idx || (elStage < idx && elStage !== 2);
}

function CheckIcon() {
  return (
    <svg className="fl-check-icon" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" />
      <path className="fl-check-path" d="M6 10l3 3l5-6" />
    </svg>
  );
}

export function FaceLivenessCaseStudy({
  prev,
  next,
}: {
  prev?: CaseStudyProject;
  next?: CaseStudyProject;
}) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [conf, setConf] = useState(0);
  const [flash, setFlash] = useState(false);
  const stageRef = useRef(-1);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;

    if (reduced) {
      rootEl
        .querySelectorAll(
          ".fl-stat, .fl-beat, .fl-option-card, .fl-node, .fl-connector, .fl-layer, .fl-check-item, .fl-state-cell, .fl-fbar",
        )
        .forEach((el) => el.classList.add("is-visible"));
      setStage(3);
      setElapsed(2);
      setConf(100);
      return;
    }

    const fadeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    rootEl.querySelectorAll(".fl-stat, .fl-beat").forEach((el) =>
      fadeIo.observe(el),
    );

    const stagger = (selector: string, delay: number) => {
      const container = rootEl.querySelector(selector);
      if (!container) return;
      const items = Array.from(container.children);
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            items.forEach((item, i) => {
              window.setTimeout(() => item.classList.add("is-visible"), i * delay);
            });
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.3 },
      );
      io.observe(container);
      return io;
    };

    const observers = [
      stagger("[data-fl-options]", 150),
      stagger("[data-fl-diagram]", 200),
      stagger("[data-fl-states]", 180),
      stagger("[data-fl-layers]", 160),
      stagger("[data-fl-rejects]", 90),
      stagger("[data-fl-before]", 25),
      stagger("[data-fl-after]", 25),
    ];

    const steps = rootEl.querySelectorAll<HTMLElement>("[data-fl-step]");
    const stepIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nextStage = Number(entry.target.getAttribute("data-stage"));
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            const prevStage = stageRef.current;
            if (nextStage === prevStage) return;
            const from =
              prevStage >= 0 ? SCAN_STAGES[prevStage] : { elapsed: 0, conf: 0 };
            const to = SCAN_STAGES[nextStage] ?? SCAN_STAGES[0];
            stageRef.current = nextStage;
            setStage(nextStage);
            tweenNumber(setElapsed, from.elapsed, to.elapsed, 500);
            tweenNumber(setConf, from.conf, to.conf, 500);
            if (nextStage === 3) {
              setFlash(false);
              window.requestAnimationFrame(() => setFlash(true));
            }
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" },
    );
    steps.forEach((step) => stepIo.observe(step));

    return () => {
      fadeIo.disconnect();
      observers.forEach((io) => io?.disconnect());
      stepIo.disconnect();
    };
  }, [reduced]);

  return (
    <article ref={root} className="fl-cs pb-16">
      <div className="fl-wrap">
        <header className="fl-hero">
          <p className="fl-eyebrow">
            Case study <span className="fl-tag">AI / ML</span>
            <span className="fl-tag">Mobile</span>
          </p>
          <h1 className="fl-title">
            A conversion and inference problem, not a camera widget
          </h1>
          <p className="fl-subtitle">
            TensorFlow model to ONNX, on-device runtime, liveness signals, and
            isolate offload so the UI thread never runs the graph.
          </p>
          <div className="fl-meta-row">
            <div className="fl-meta-item">
              <div className="fl-label">Role</div>
              <div className="fl-value">Mobile / ML engineer, pipeline owner</div>
            </div>
            <div className="fl-meta-item">
              <div className="fl-label">Stack</div>
              <div className="fl-value">
                Flutter, Google ML Kit, ONNX Runtime, TensorFlow, Dart isolates,
                Kotlin, Swift
              </div>
            </div>
            <div className="fl-meta-item">
              <div className="fl-label">Surface</div>
              <div className="fl-value">
                Identity capture for an internal enterprise app
              </div>
            </div>
          </div>
        </header>

        <div className="fl-stats">
          <div className="fl-stat">
            <div className="fl-num">2s</div>
            <div className="fl-lbl">capture latency</div>
          </div>
          <div className="fl-stat">
            <div className="fl-num">6s</div>
            <div className="fl-lbl">latency before</div>
          </div>
          <div className="fl-stat">
            <div className="fl-num">−90%</div>
            <div className="fl-lbl">invalid captures</div>
          </div>
        </div>

        <section className="fl-beat">
          <p className="fl-beat-label">Context</p>
          <h2 className="fl-beat-title">Face capture is the gate for identity</h2>
          <p className="fl-beat-body">
            The app is a unified enterprise client covering attendance, tasks,
            approvals, and internal workflows. Face capture has to work in
            warehouses and yards, under uneven lighting, on mid-range phones, and
            it cannot accept a printed photo.
          </p>
          <p className="fl-beat-body">
            I owned the capture pipeline end to end, detection, liveness, spoof
            resistance, and the UX that actually gets a usable set of images
            without a trained operator behind the camera.
          </p>
        </section>

        <section className="fl-beat">
          <p className="fl-beat-label">Problem</p>
          <h2 className="fl-beat-title">
            Slow, noisy, and blocking the thread that needed to stay free
          </h2>
          <p className="fl-beat-body">
            The first version was slow and noisy. Face detection sat around six
            seconds. Invalid and spoofed captures were common enough to poison
            downstream records. Heavy inference on the UI isolate dropped frames
            during the exact preview the user was trying to hold still for.
          </p>
          <p className="fl-beat-body">
            A cloud round-trip was the wrong default. Connectivity is unreliable,
            latency is visible, and identity photos should not need to leave the
            device to decide &quot;this is a live face.&quot;
          </p>
        </section>

        <section className="fl-beat">
          <p className="fl-beat-label">Investigation</p>
          <h2 className="fl-beat-title">
            The detector was fine. The spoof model was the bottleneck
          </h2>
          <p className="fl-beat-body">
            Google ML Kit was already the right detector for faces and document
            edges. The spoof model was heavier than the phones being shipped to,
            and running it inline with camera frames made the preview stutter.
          </p>
          <p className="fl-beat-body">
            What was needed: a smaller runtime, a clear split between &quot;is
            there a face&quot; and &quot;is it live,&quot; and a capture state
            machine that does not depend on a shutter tap from someone wearing
            gloves.
          </p>
        </section>

        <section className="fl-beat" style={{ borderBottom: "none", paddingBottom: 0 }}>
          <p className="fl-beat-label">Options considered</p>
          <h2 className="fl-beat-title" style={{ marginBottom: 0 }}>
            Four paths, one that kept the model&apos;s behavior
          </h2>
        </section>
      </div>

      <div className="fl-wrap fl-wide">
        <div className="fl-option-row" data-fl-options>
          {OPTIONS.map((option) => (
            <div
              key={option.title}
              className={`fl-option-card${option.chosen ? " is-chosen" : ""}`}
            >
              <div className="fl-option-tag">{option.tag}</div>
              <div className="fl-option-title">{option.title}</div>
              <div className="fl-option-reason">{option.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fl-wrap">
        <section className="fl-beat">
          <p className="fl-beat-label">Engineering decision</p>
          <h2 className="fl-beat-title">
            Convert the graph, keep the model, split the work
          </h2>
          <p className="fl-beat-body">
            TensorFlow converted to ONNX, running through ONNX Runtime on device.
            ML Kit stays for detection. Liveness (blink, depth-from-video) runs
            before anything commits. Auto-capture locks a face, waits for
            liveness, and takes multiple profile stills without a manual shutter.
          </p>
          <p className="fl-beat-body">
            Pre-process, post-process, and inference all moved onto Dart
            isolates, so the preview stays a UI problem, not a graph problem. The
            pipeline got its own architecture and requirements doc, so the next
            person isn&apos;t reverse-engineering a model file.
          </p>
        </section>
      </div>

      <div className="fl-wrap fl-wide">
        <section className="fl-pinned-section">
          <p className="fl-beat-label" style={{ opacity: 1, transform: "none" }}>
            Walkthrough
          </p>
          <h2
            className="fl-beat-title"
            style={{ opacity: 1, transform: "none", marginBottom: 0 }}
          >
            Scroll through what the camera sees
          </h2>

          <div className="fl-pinned-grid">
            <div className="fl-pinned-visual-slot">
              <div className="fl-pinned-visual">
                <div
                  className={`fl-scan-frame${stage >= 2 ? " is-no-second" : ""}`}
                >
                  <svg viewBox="0 0 180 280" xmlns="http://www.w3.org/2000/svg">
                    <g className="fl-second-face">
                      <ellipse
                        cx="158"
                        cy="58"
                        rx="26"
                        ry="32"
                        fill="none"
                        stroke="var(--fl-border)"
                        strokeWidth="1.3"
                      />
                      <circle
                        cx="149"
                        cy="52"
                        r="2.2"
                        fill="var(--fl-text-muted)"
                        opacity="0.6"
                      />
                      <circle
                        cx="165"
                        cy="52"
                        r="2.2"
                        fill="var(--fl-text-muted)"
                        opacity="0.6"
                      />
                    </g>

                    <ellipse
                      cx="90"
                      cy="120"
                      rx="46"
                      ry="58"
                      fill="none"
                      stroke="var(--fl-border-strong)"
                      strokeWidth="1.5"
                    />
                    <circle cx="72" cy="108" r="4" fill="var(--fl-text-muted)" />
                    <circle cx="108" cy="108" r="4" fill="var(--fl-text-muted)" />
                    <path
                      d="M84 138 Q90 143 96 138"
                      fill="none"
                      stroke="var(--fl-text-muted)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    <rect
                      className={`fl-scan-el${scanActive(0, stage) ? " is-active" : ""}`}
                      x="34"
                      y="52"
                      width="112"
                      height="136"
                      rx="10"
                      fill="none"
                      stroke="var(--fl-accent)"
                      strokeWidth="1.5"
                      strokeDasharray="5 4"
                    />

                    <g
                      className={`fl-scan-el fl-second-face${scanActive(0, stage) ? " is-active" : ""}`}
                    >
                      <rect
                        x="130"
                        y="28"
                        width="56"
                        height="60"
                        rx="8"
                        fill="none"
                        stroke="var(--fl-text-muted)"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity="0.7"
                      />
                      <line
                        x1="140"
                        y1="38"
                        x2="176"
                        y2="78"
                        stroke="var(--fl-text-muted)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="176"
                        y1="38"
                        x2="140"
                        y2="78"
                        stroke="var(--fl-text-muted)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </g>

                    <g
                      className={`fl-scan-el${scanActive(1, stage) ? " is-active" : ""}`}
                    >
                      <circle cx="72" cy="108" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="108" cy="108" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="90" cy="122" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="84" cy="138" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="96" cy="138" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="65" cy="90" r="2.5" fill="var(--fl-accent)" />
                      <circle cx="115" cy="90" r="2.5" fill="var(--fl-accent)" />
                    </g>

                    <circle
                      className={`fl-scan-el fl-scan-ring${scanActive(2, stage) ? " is-active" : ""}`}
                      cx="90"
                      cy="120"
                      r="60"
                      fill="none"
                      stroke="var(--fl-accent)"
                      strokeWidth="1.5"
                    />

                    <g
                      className={`fl-scan-el${scanActive(3, stage) ? " is-active" : ""}`}
                    >
                      <path
                        d="M66 118 L82 134 L116 96"
                        fill="none"
                        stroke="var(--fl-green)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  <div
                    className={`fl-capture-flash${flash ? " is-flashing" : ""}`}
                  />
                </div>
                <div className="fl-scan-metrics">
                  <div>
                    <div className="fl-sm-num">{elapsed.toFixed(1)}s</div>
                    <div className="fl-sm-lbl">elapsed</div>
                  </div>
                  <div>
                    <div className="fl-sm-num">{Math.round(conf)}%</div>
                    <div className="fl-sm-lbl">confidence</div>
                  </div>
                </div>
                <div className="fl-confidence-bar">
                  <div
                    className="fl-confidence-fill"
                    style={{ width: `${Math.round(conf)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              {SCAN_STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className="fl-pstep"
                  data-fl-step
                  data-stage={index}
                >
                  <p className="fl-pstep-num">{step.num}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fl-wrap">
        <section className="fl-beat">
          <p className="fl-beat-label">Implementation</p>
          <h2 className="fl-beat-title">
            A session is a state machine, not a shutter button
          </h2>
          <p className="fl-beat-body">
            ML Kit proposes the box, the ONNX spoof head vetoes prints and
            screens, and blink plus depth checks raise the cost of a still-image
            attack. The UI isolate only renders preview and session state,
            nothing heavier. Model load and preprocessing were tuned for the
            hardware actually in the field, not a flagship benchmark device.
            Failure paths, timeout, failed liveness, low light, retry in-session
            instead of dumping the user back to a form.
          </p>

          <div className="fl-frame-timeline">
            <div>
              <div className="fl-ft-label">
                <span>
                  <b>Before</b> · inference runs on the UI isolate
                </span>
                <span>frame drops</span>
              </div>
              <div className="fl-ft-bars" data-fl-before>
                {FT_BEFORE.map((bar, i) => (
                  <div
                    key={`before-${i}`}
                    className={`fl-fbar is-${bar.kind}`}
                    style={{ ["--h" as string]: bar.h }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="fl-ft-label">
                <span>
                  <b>After</b> · inference runs on a Dart isolate
                </span>
                <span>no drops</span>
              </div>
              <div className="fl-ft-bars" data-fl-after>
                {FT_AFTER.map((h, i) => (
                  <div
                    key={`after-${i}`}
                    className="fl-fbar is-smooth"
                    style={{ ["--h" as string]: h }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="fl-state-strip" data-fl-states>
            <div className="fl-state-cell">
              <div className="fl-sc-title">No face</div>
              <div className="fl-sc-sub">idle</div>
            </div>
            <div className="fl-state-cell">
              <div className="fl-sc-title">Face present</div>
              <div className="fl-sc-sub">ML Kit</div>
            </div>
            <div className="fl-state-cell">
              <div className="fl-sc-title">Liveness pending</div>
              <div className="fl-sc-sub">blink + depth</div>
            </div>
            <div className="fl-state-cell">
              <div className="fl-sc-title">Capturing</div>
              <div className="fl-sc-sub">multi-still</div>
            </div>
            <div className="fl-state-cell is-final">
              <div className="fl-sc-title">Complete</div>
              <div className="fl-sc-sub">committed</div>
            </div>
          </div>

          <p
            className="fl-beat-body"
            style={{ marginTop: 32, opacity: 1, transform: "none" }}
          >
            Registration captures three poses, left, front, and right, to build a
            fuller reference. Attendance only ever needs one, front, since
            it&apos;s verifying against a reference that already exists.
          </p>
        </section>

        <section className="fl-beat">
          <p className="fl-beat-label">Defense in depth</p>
          <h2 className="fl-beat-title">
            Three layers, not one model doing everything
          </h2>
          <p className="fl-beat-body">
            No single check carries the whole decision. Each layer either gates
            capture quality, vetoes an obvious spoof, or re-checks identity where
            accuracy matters more than speed.
          </p>
          <div className="fl-layers" data-fl-layers>
            <div className="fl-layer">
              <div className="fl-layer-title">
                ML Kit face detection
                <span className="fl-layer-loc">on-device</span>
              </div>
              <div className="fl-layer-sub">
                Capture quality gate: pose, distance, occlusion, single face
              </div>
            </div>
            <div className="fl-layer">
              <div className="fl-layer-title">
                ONNX anti-spoof classifier
                <span className="fl-layer-loc">on-device</span>
              </div>
              <div className="fl-layer-sub">
                Custom model, converted from TensorFlow, vetoes prints and
                screens before commit
              </div>
            </div>
            <div className="fl-layer">
              <div className="fl-layer-title">
                TensorFlow re-validation
                <span className="fl-layer-loc">backend</span>
              </div>
              <div className="fl-layer-sub">
                Secondary pass where accuracy matters more than latency, actual
                identity matching
              </div>
            </div>
          </div>
        </section>

        <section className="fl-beat">
          <p className="fl-beat-label">What gets rejected</p>
          <h2 className="fl-beat-title">The −90%, itemized</h2>
          <p className="fl-beat-body">
            Passive checks catch a static photo. The active challenge is what
            defeats a replayed video, which is why it leads.
          </p>
          <div className="fl-checklist" data-fl-rejects>
            <div className="fl-check-item is-lead">
              <CheckIcon />
              <div className="fl-check-label">
                <b>Two-blink liveness challenge not completed</b> — the active
                check, defeats replayed video
              </div>
            </div>
            <div className="fl-check-item">
              <CheckIcon />
              <div className="fl-check-label">Photo or video spoof detected</div>
            </div>
            <div className="fl-check-item">
              <CheckIcon />
              <div className="fl-check-label">Two or more people in frame</div>
            </div>
            <div className="fl-check-item">
              <CheckIcon />
              <div className="fl-check-label">
                Face not visible, or outside the bounding box
              </div>
            </div>
            <div className="fl-check-item">
              <CheckIcon />
              <div className="fl-check-label">Eyes closed at capture</div>
            </div>
            <div className="fl-check-item">
              <CheckIcon />
              <div className="fl-check-label">
                Insufficient lighting, or face otherwise unclear
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fl-wrap fl-wide">
        <section className="fl-diagram-section">
          <p className="fl-beat-label" style={{ opacity: 1, transform: "none" }}>
            Capture pipeline
          </p>
          <h2
            className="fl-beat-title"
            style={{ opacity: 1, transform: "none", marginBottom: 0 }}
          >
            Frames in, a verified still out
          </h2>
          <div className="fl-diagram-wrap" data-fl-diagram>
            <div className="fl-node">
              <div className="fl-node-title">Camera preview</div>
              <div className="fl-node-sub">frames</div>
            </div>
            <div className="fl-connector" />
            <div className="fl-node">
              <div className="fl-node-title">ML Kit detect</div>
              <div className="fl-node-sub">isolate</div>
            </div>
            <div className="fl-connector" />
            <div className="fl-node">
              <div className="fl-node-title">ONNX spoof + liveness</div>
              <div className="fl-node-sub">commit</div>
            </div>
            <div className="fl-connector" />
            <div className="fl-node fl-node-accent">
              <div className="fl-node-title">Auto-capture</div>
              <div className="fl-node-sub">no shutter tap</div>
            </div>
          </div>
        </section>
      </div>

      <div className="fl-wrap">
        <section className="fl-beat">
          <p className="fl-beat-label">Result</p>
          <h2 className="fl-beat-title">The camera stopped being the obstacle</h2>
          <p className="fl-beat-body">
            Detection-to-capture dropped from around six seconds to around two.
            Invalid and unusable captures fell roughly 90%. Preview stayed usable
            through the whole session because the heavy work left the UI thread
            entirely.
          </p>
          <p className="fl-beat-body">
            Attendance and onboarding stopped being a fight with the camera. The
            same pipeline is the reason on-device ML gets treated here as a
            product surface, not a demo notebook.
          </p>
        </section>

        <div className="fl-foot flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={domainRoutes.ai} className="hover:text-foreground">
            ← Back to {domainLabels.ai}
          </Link>
          <div className="flex gap-6">
            {prev ? (
              <Link href={routes.project(prev.slug)} className="hover:text-accent">
                Previous: {prev.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={routes.project(next.slug)} className="hover:text-accent">
                Next: {next.title}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
