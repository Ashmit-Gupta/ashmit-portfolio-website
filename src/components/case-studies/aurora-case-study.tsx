"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { domainLabels, domainRoutes, routes } from "@/lib/constants/routes";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import type { CaseStudyProject } from "@/types/project";
import "./aurora-case-study.css";

const STAGES = [
  { fps: 34, markers: 40 },
  { fps: 41, markers: 250 },
  { fps: 47, markers: 1800 },
  { fps: 52, markers: 3500 },
] as const;

const MAP_STEPS = [
  {
    num: "01 / RAW",
    title: "Everything arrives at once",
    body: "GPS, BLE beacons, and machine telemetry stream in continuously. Drawn naively, that means a full redraw of every overlay on every frame. Frame time sat around 34 FPS once live markers were in play.",
  },
  {
    num: "02 / SCOPE",
    title: "Only load what's on screen",
    body: "Tiles are cached locally after first load and only the tiles around the current viewport are kept in memory, so usage stays bounded as the map area grows instead of climbing with it.",
  },
  {
    num: "03 / PRE-RENDER",
    title: "Paint once, not every frame",
    body: "Map layers and markers are pre-rendered instead of rebuilding the full overlay tree on every frame. Combined with viewport scoping, pan, zoom, and live marker updates stop competing with redraw cost.",
  },
  {
    num: "04 / LIVE",
    title: "Hundreds of markers, still smooth",
    body: "The live map holds in the high 40s to roughly 52 FPS with hundreds of markers on screen, in production across 3,500+ live map markers and 250+ tracked machines.",
  },
] as const;

function animateNumber(
  setter: (value: number) => void,
  from: number,
  to: number,
  duration: number,
) {
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    setter(Math.round(from + (to - from) * p));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function formatCount(value: number) {
  return value >= 1000 ? value.toLocaleString() : String(value);
}

function Pin({
  x,
  y,
  stage,
  visible,
  small,
}: {
  x: number;
  y: number;
  stage: number;
  visible: boolean;
  small?: boolean;
}) {
  return (
    <g
      className={`ac-pin${visible ? " is-visible" : ""}`}
      data-stage={stage}
      transform={`translate(${x},${y})`}
    >
      <g className="ac-pin-inner">
        <circle
          className="ac-pin-ring"
          r={small ? 6 : 7}
          fill="none"
          stroke="var(--ac-accent)"
          strokeWidth="1.5"
        />
        <circle r={small ? 4.5 : 5.5} fill="var(--ac-accent)" />
        {small ? null : <circle r="2" fill="var(--ac-bg)" />}
      </g>
    </g>
  );
}

function Vehicle({
  x,
  y,
  stage,
  visible,
}: {
  x: number;
  y: number;
  stage: number;
  visible: boolean;
}) {
  return (
    <g
      className={`ac-vehicle${visible ? " is-visible" : ""}`}
      data-stage={stage}
      transform={`translate(${x},${y})`}
    >
      <g className="ac-vehicle-inner">
        <rect x="-9" y="-5" width="18" height="10" rx="2" fill="var(--ac-green)" />
        <circle cx="-5" cy="6" r="2.5" fill="var(--ac-text)" />
        <circle cx="5" cy="6" r="2.5" fill="var(--ac-text)" />
      </g>
    </g>
  );
}

export function AuroraCaseStudy({
  prev,
  next,
}: {
  prev?: CaseStudyProject;
  next?: CaseStudyProject;
}) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(-1);
  const [fps, setFps] = useState(34);
  const [markers, setMarkers] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const stageRef = useRef(-1);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;

    if (reduced) {
      rootEl
        .querySelectorAll(
          ".ac-stat, .ac-beat, .ac-node, .ac-connector, .ac-conn-card, .ac-conn-arrow",
        )
        .forEach((el) => el.classList.add("is-visible"));
      setAssembled(true);
      setStage(3);
      setFps(52);
      setMarkers(3500);
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
    rootEl
      .querySelectorAll(".ac-stat, .ac-beat")
      .forEach((el) => fadeIo.observe(el));

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
        { threshold: 0.35 },
      );
      io.observe(container);
      return io;
    };

    const diagramIo = stagger("[data-aurora-diagram]", 200);
    const connIo = stagger("[data-aurora-conn]", 250);

    const steps = rootEl.querySelectorAll<HTMLElement>("[data-aurora-step]");
    const stepIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nextStage = Number(entry.target.getAttribute("data-stage"));
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            const prevStage = stageRef.current;
            if (nextStage === prevStage) return;
            const fromFps = prevStage >= 0 ? STAGES[prevStage].fps : STAGES[0].fps;
            const fromMarkers = prevStage >= 0 ? STAGES[prevStage].markers : 0;
            const to = STAGES[nextStage] ?? STAGES[0];
            stageRef.current = nextStage;
            setStage(nextStage);
            animateNumber(setFps, fromFps, to.fps, 600);
            animateNumber(setMarkers, fromMarkers, to.markers, 700);
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" },
    );
    steps.forEach((step) => stepIo.observe(step));

    const devices = rootEl.querySelector("[data-aurora-devices]");
    const deviceIo = devices
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setAssembled(true);
                deviceIo.disconnect();
              }
            });
          },
          { threshold: 0.3 },
        )
      : null;
    if (devices && deviceIo) deviceIo.observe(devices);

    return () => {
      fadeIo.disconnect();
      diagramIo?.disconnect();
      connIo?.disconnect();
      stepIo.disconnect();
      deviceIo?.disconnect();
    };
  }, [reduced]);

  return (
    <article ref={root} className="aurora-cs pb-16">
      <div className="ac-wrap">
        <header className="ac-hero">
          <p className="ac-eyebrow">Case study — mobile</p>
          <h1 className="ac-title">Real-time industrial IoT platform</h1>
          <p className="ac-subtitle">
            Live telemetry, GPS, and BLE tracking for machines and field teams,
            rendered on a real-time map.
          </p>
          <div className="ac-meta-row">
            <div className="ac-meta-item">
              <div className="ac-label">Role</div>
              <div className="ac-value">
                Flutter developer, architecture through production
              </div>
            </div>
            <div className="ac-meta-item">
              <div className="ac-label">Stack</div>
              <div className="ac-value">
                Flutter, GetX, Firebase, native platform channels
              </div>
            </div>
            <div className="ac-meta-item">
              <div className="ac-label">Delivery</div>
              <div className="ac-value">GitHub Actions, Fastlane, Shorebird</div>
            </div>
          </div>
        </header>

        <div className="ac-stats">
          <div className="ac-stat">
            <div className="ac-num">3,500+</div>
            <div className="ac-lbl">live map markers</div>
          </div>
          <div className="ac-stat">
            <div className="ac-num">250+</div>
            <div className="ac-lbl">machines monitored</div>
          </div>
          <div className="ac-stat">
            <div className="ac-num">52 FPS</div>
            <div className="ac-lbl">map frame rate</div>
          </div>
          <div className="ac-stat">
            <div className="ac-num">12 min</div>
            <div className="ac-lbl">release pipeline</div>
          </div>
        </div>

        <section className="ac-beat">
          <p className="ac-beat-label">Context</p>
          <h2 className="ac-beat-title">The operational picture for industrial sites</h2>
          <p className="ac-beat-body">
            The platform tracks 250+ machines and 3,500+ workers with GPS, BLE
            beacons, and live telemetry. Supervisors need a map that tells them
            where people and equipment are, whether a machine is healthy, and
            when a safety alert fires, often in the field on Android and iOS. I
            designed and built the Flutter client from scratch and owned the path
            from architecture to store release.
          </p>
        </section>

        <section className="ac-beat">
          <p className="ac-beat-label">Problem</p>
          <h2 className="ac-beat-title">The map is the product</h2>
          <p className="ac-beat-body">
            Hundreds of markers update continuously. A naive implementation,
            fetching the whole tile set, redrawing every overlay every frame,
            treating connectivity as &quot;wifi is on&quot;, produces jank, memory
            spikes, and false offline screens.
          </p>
        </section>
      </div>

      <div className="ac-wrap ac-wide">
        <section className="ac-pinned-section">
          <p className="ac-beat-label" style={{ opacity: 1, transform: "none" }}>
            Engineering decision
          </p>
          <h2
            className="ac-beat-title"
            style={{ opacity: 1, transform: "none", marginBottom: 0 }}
          >
            Scroll through how the map gets fast
          </h2>

          <div className="ac-pinned-grid">
            <div className="ac-pinned-visual-slot">
            <div className="ac-pinned-visual">
              <div className="ac-map-box">
                <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="8"
                    y="8"
                    width="304"
                    height="224"
                    rx="6"
                    fill="none"
                    stroke="var(--ac-border-strong)"
                    strokeWidth="1.5"
                  />
                  <line x1="8" y1="70" x2="312" y2="70" stroke="var(--ac-border)" strokeWidth="2" />
                  <line x1="8" y1="170" x2="312" y2="170" stroke="var(--ac-border)" strokeWidth="2" />
                  <line x1="90" y1="8" x2="90" y2="232" stroke="var(--ac-border)" strokeWidth="2" />
                  <line x1="230" y1="8" x2="230" y2="232" stroke="var(--ac-border)" strokeWidth="2" />
                  <rect x="18" y="18" width="58" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="108" y="18" width="104" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="242" y="18" width="52" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="18" y="82" width="58" height="76" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="242" y="82" width="52" height="76" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="18" y="182" width="58" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="108" y="182" width="104" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect x="242" y="182" width="52" height="40" rx="3" fill="var(--ac-bg)" stroke="var(--ac-border)" />
                  <rect
                    x="108"
                    y="80"
                    width="104"
                    height="80"
                    rx="3"
                    fill="var(--ac-bg)"
                    opacity="0.4"
                    stroke="var(--ac-border)"
                    strokeDasharray="3 3"
                  />
                  <Pin x={47} y={38} stage={0} visible={stage >= 0} />
                  <Pin x={160} y={38} stage={0} visible={stage >= 0} />
                  <Pin x={268} y={38} stage={1} visible={stage >= 1} />
                  <Pin x={47} y={120} stage={1} visible={stage >= 1} />
                  <Pin x={268} y={120} stage={1} visible={stage >= 1} />
                  <Vehicle x={135} y={110} stage={2} visible={stage >= 2} />
                  <Vehicle x={185} y={140} stage={2} visible={stage >= 2} />
                  <Pin x={47} y={202} stage={2} visible={stage >= 2} />
                  <Pin x={268} y={202} stage={2} visible={stage >= 2} />
                  <Vehicle x={155} y={90} stage={3} visible={stage >= 3} />
                  <Vehicle x={160} y={155} stage={3} visible={stage >= 3} />
                  <Pin x={160} y={120} stage={3} visible={stage >= 3} />
                  <Pin x={108} y={202} stage={3} small visible={stage >= 3} />
                  <Pin x={212} y={202} stage={3} small visible={stage >= 3} />
                  <Pin x={90} y={18} stage={3} small visible={stage >= 3} />
                </svg>
              </div>
              <div className="ac-pv-metrics">
                <div>
                  <div className="ac-pv-mnum">{fps}</div>
                  <div className="ac-pv-mlbl">frames per second</div>
                </div>
                <div>
                  <div className="ac-pv-mnum">{formatCount(markers)}</div>
                  <div className="ac-pv-mlbl">markers rendered</div>
                </div>
              </div>
            </div>
            </div>

            <div>
              {MAP_STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className="ac-pstep"
                  data-aurora-step
                  data-stage={index}
                >
                  <p className="ac-pstep-num">{step.num}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="ac-wrap">
        <section className="ac-beat">
          <p className="ac-beat-label">Also decided</p>
          <h2 className="ac-beat-title">Releases, treated as a product</h2>
          <p className="ac-beat-body">
            Git tags as the version source of truth, an automated pipeline, and
            OTA patching for fast fixes, cutting the release pipeline from about
            50 minutes to about 12.
          </p>
        </section>
      </div>

      <div className="ac-wrap">
        <section className="ac-diagram-section">
          <p className="ac-beat-label" style={{ opacity: 1, transform: "none" }}>
            Diagnosis
          </p>
          <h2 className="ac-beat-title" style={{ opacity: 1, transform: "none" }}>
            Two signals disagreed. Neither one meant online.
          </h2>
          <p
            className="ac-beat-body"
            style={{ opacity: 1, transform: "none", marginBottom: 8 }}
          >
            Users on working internet were seeing a false &quot;no connection&quot;
            screen, sporadic and carrier-dependent. Two connectivity libraries
            were stacked together, and they were answering different questions.
          </p>
          <div className="ac-conn-compare" data-aurora-conn>
            <div className="ac-conn-card">
              <div className="ac-conn-tag">Before</div>
              <div className="ac-conn-signal">
                <span className="ac-conn-dot ac-warn" />
                <span>
                  Radio check: <b>wifi is active</b>
                </span>
              </div>
              <div className="ac-conn-signal">
                <span className="ac-conn-dot ac-warn" />
                <span>
                  Reachability check: <b>ping timed out</b>
                </span>
              </div>
              <div className="ac-conn-verdict ac-bad">
                Two answers to two different questions, and the UI defaulted
                pessimistic
              </div>
            </div>
            <div className="ac-conn-arrow">→</div>
            <div className="ac-conn-card">
              <div className="ac-conn-tag">After</div>
              <div className="ac-conn-signal">
                <span className="ac-conn-dot ac-ok" />
                <span>
                  Native platform channel: <b>server actually reachable</b>
                </span>
              </div>
              <div className="ac-conn-verdict ac-good">
                One OS-validated signal, no polling, false offline screens
                eliminated
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="ac-wrap">
        <section className="ac-diagram-section">
          <p className="ac-beat-label" style={{ opacity: 1, transform: "none" }}>
            Offline, by design
          </p>
          <h2 className="ac-beat-title" style={{ opacity: 1, transform: "none" }}>
            A write never waits for signal
          </h2>
          <p
            className="ac-beat-body"
            style={{ opacity: 1, transform: "none", marginBottom: 8 }}
          >
            Local storage is the source of truth. UI reads and writes local first,
            sync is a background concern the screen never blocks on.
          </p>
          <div className="ac-diagram-wrap" data-aurora-diagram>
            <div className="ac-node">
              <div className="ac-node-title">Local write</div>
              <div className="ac-node-sub">optimistic</div>
            </div>
            <div className="ac-connector" />
            <div className="ac-node">
              <div className="ac-node-title">Outbox</div>
              <div className="ac-node-sub">client UUID v4</div>
            </div>
            <div className="ac-connector" />
            <div className="ac-node">
              <div className="ac-node-title">Background sync</div>
              <div className="ac-node-sub">jittered, backoff</div>
            </div>
            <div className="ac-connector" />
            <div className="ac-node ac-node-accent">
              <div className="ac-node-title">Server ack</div>
              <div className="ac-node-sub">tombstone resolved</div>
            </div>
          </div>
        </section>
      </div>

      <div className="ac-wrap ac-wide">
        <section className="ac-assemble-section">
          <p className="ac-beat-label" style={{ opacity: 1, transform: "none" }}>
            Implementation
          </p>
          <h2 className="ac-beat-title" style={{ opacity: 1, transform: "none" }}>
            One codebase, three form factors
          </h2>
          <p className="ac-beat-body" style={{ opacity: 1, transform: "none" }}>
            Domain logic never touches presentation. A screen owns state and picks
            a layout, a layout arranges, a widget only renders. A widget never
            decides where it is placed, so phone, tablet, and desktop reuse the
            same widgets instead of duplicating screens.
          </p>

          <div
            className={`ac-device-row${assembled ? " is-assembled" : ""}`}
            data-aurora-devices
          >
            <div className="ac-device-wrap">
              <div className="ac-device ac-phone">
                <div className="ac-dscreen">
                  <div className="ac-dbar ac-w60" />
                  <div className="ac-dbar ac-w40" />
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 36, background: "var(--ac-bg-2)", borderRadius: 6 }} />
                    <div style={{ height: 36, background: "var(--ac-bg-2)", borderRadius: 6 }} />
                    <div style={{ height: 36, background: "var(--ac-bg-2)", borderRadius: 6 }} />
                  </div>
                </div>
                <div className="ac-dnav-bottom">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="ac-device-caption">Phone · stacked, bottom nav</div>
            </div>

            <div className="ac-device-wrap">
              <div className="ac-device ac-tablet">
                <div className="ac-dscreen">
                  <div className="ac-drail" />
                  <div>
                    <div className="ac-dbar ac-w60" style={{ marginBottom: 12 }} />
                    <div className="ac-dgrid">
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ac-device-caption">Tablet · rail nav, grid</div>
            </div>

            <div className="ac-device-wrap">
              <div className="ac-device ac-desktop">
                <div className="ac-dscreen">
                  <div className="ac-drail" />
                  <div>
                    <div className="ac-dbar ac-w40" style={{ marginBottom: 12 }} />
                    <div className="ac-dgrid">
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                      <div className="ac-dcard" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ac-device-caption">Desktop · rail nav, dense grid</div>
            </div>
          </div>
          <p className={`ac-assemble-note${assembled ? " is-visible" : ""}`}>
            Same screen, same widgets, three layout compositions. Breakpoints
            resolve on <span className="ac-code">LayoutBuilder</span>, never{" "}
            <span className="ac-code">MediaQuery</span> inside a widget, so
            split-views and resizable windows react to real constraints.
          </p>
        </section>
      </div>

      <div className="ac-wrap">
        <section className="ac-beat">
          <p className="ac-beat-label">Result</p>
          <h2 className="ac-beat-title">Smooth at scale, shipped reliably</h2>
          <p className="ac-beat-body">
            The live map holds high 40s to ~52 FPS with hundreds of markers, in
            production for 3,500+ live map markers and 250+ machines. Release time
            dropped roughly 76%, from about 50 minutes to about 12. False offline
            screens stopped after the native reachability channel replaced the
            plugin.
          </p>
        </section>

        <div className="ac-foot flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={domainRoutes.mobile}
            className="hover:text-foreground"
          >
            ← Back to {domainLabels.mobile}
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
