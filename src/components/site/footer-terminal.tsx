"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/constants/site";
import { useReducedMotion } from "@/lib/animations/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

const SITE_SHELL_ID = "site-shell";
const SITE_SHIFT_ID = "site-crt-shift";

function getSiteShell() {
  return document.getElementById(SITE_SHELL_ID);
}

function getSiteShift() {
  return document.getElementById(SITE_SHIFT_ID);
}

function clearSiteCrtClasses(shell: HTMLElement) {
  shell.classList.remove(
    "footer-crt-power-off",
    "footer-crt-collapsed",
    "footer-crt-power-on",
    "footer-crt-online-glow",
  );
}

/** Pin the site to the viewport and offset content so CRT clips the visible frame. */
function pinSiteToViewport(scrollY: number) {
  const shell = getSiteShell();
  const shift = getSiteShift();
  if (!shell || !shift) return;

  shell.classList.add("site-crt-active");
  shell.style.setProperty("--crt-scroll", `-${scrollY}px`);
  shift.style.transform = `translate3d(0, -${scrollY}px, 0)`;
}

function unpinSiteFromViewport() {
  const shell = getSiteShell();
  const shift = getSiteShift();
  if (!shell || !shift) return;

  clearSiteCrtClasses(shell);
  shell.classList.remove("site-crt-active");
  shell.style.removeProperty("--crt-scroll");
  shift.style.transform = "";
}

const COMMIT_CMD = 'git commit -m "still building"';
const YEAR = new Date().getFullYear();
const CRT_POWER_MS = 780;
const CRT_SPARK_MS = 450;
const CRT_GLOW_MS = 900;
const RESTORE_BANNER_MS = 1600;

type CrtState = "idle" | "power-off" | "collapsed" | "power-on" | "online-glow";

type CrashEntry = { text: string; tone: "echo" | "err" | "ok" | "hint" | "muted" };

const SIMPLE_RECOVERY = new Set([
  "rollback",
  "restore",
  "fix",
  "undo",
  "recover",
  "revert",
]);

function normalizeCommand(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function isRecoveryCommand(raw: string) {
  const cmd = normalizeCommand(raw);
  if (!cmd) return false;
  if (SIMPLE_RECOVERY.has(cmd)) return true;
  if (/^git revert (-)?head$/.test(cmd)) return true;
  if (cmd === "git revert --hard" || cmd === "git rollback") return true;
  if (cmd === "git reset --hard" || cmd === "git reset --hard head~1") return true;
  return false;
}

const HELP_LINES: Array<{ text: string; tone: CrashEntry["tone"] }> = [
  { text: "Production is down — undo the last change to restore the site.", tone: "hint" },
  { text: "Git folks:", tone: "muted" },
  { text: "  git revert HEAD", tone: "muted" },
  { text: "Everyone else:", tone: "muted" },
  { text: "  restore", tone: "muted" },
  { text: "  rollback", tone: "muted" },
];

type StageKey = "build" | "test" | "deploy";
type StageState = "idle" | "active" | "done";
type OutputLine = { text: string; tone?: "muted" | "success" };

const STAGES: StageKey[] = ["build", "test", "deploy"];

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Human-ish keystroke delay — faster bursts, longer pauses at word breaks. */
function keystrokeDelay(char: string, prev = "") {
  let ms = 52 + Math.random() * 38;

  if (char === " ") ms += 90 + Math.random() * 70;
  if (char === "-") ms += 55;
  if (char === '"') ms += 110 + Math.random() * 90;
  if (prev === " " && /[a-z]/.test(char)) ms += 25;
  if (char === "m" && prev === "-") ms += 140;

  return ms;
}

async function typeCommand(
  text: string,
  onChar: (value: string) => void,
  signal: AbortSignal,
) {
  for (let i = 0; i < text.length; i++) {
    onChar(text.slice(0, i + 1));
    await sleep(keystrokeDelay(text[i], text[i - 1] ?? ""), signal);
  }
}

async function appendOutput(
  line: OutputLine,
  setOutput: Dispatch<SetStateAction<OutputLine[]>>,
  signal: AbortSignal,
  pauseMs: number,
) {
  setOutput((prev) => [...prev, line]);
  await sleep(pauseMs, signal);
}

function StagePill({
  label,
  state,
}: {
  label: string;
  state: StageState;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-all duration-300",
        state === "idle" && "border-line bg-surface text-muted",
        state === "active" &&
          "border-[rgba(224,185,89,0.55)] text-[#e0b959] shadow-[0_0_0_1px_rgba(224,185,89,0.12),0_0_14px_rgba(224,185,89,0.12)]",
        state === "done" && "border-[rgba(111,207,127,0.45)] text-[#6fcf7f]",
      )}
    >
      <span
        className={cn(
          "inline-block w-3 text-center",
          state === "active" && "footer-stage-spin",
        )}
        aria-hidden="true"
      >
        {state === "done" ? "✓" : state === "active" ? "◐" : "○"}
      </span>
      {label}
    </div>
  );
}

export function FooterTerminal() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [cursorHidden, setCursorHidden] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [pipelineVisible, setPipelineVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusLabel, setStatusLabel] = useState("idle");
  const [stageState, setStageState] = useState<Record<StageKey, StageState>>({
    build: "idle",
    test: "idle",
    deploy: "idle",
  });
  const [crtState, setCrtState] = useState<CrtState>("idle");
  const [showSpark, setShowSpark] = useState(false);
  const [crashOpen, setCrashOpen] = useState(false);
  const [crashLog, setCrashLog] = useState<CrashEntry[]>([]);
  const [crashInput, setCrashInput] = useState("");
  const [restored, setRestored] = useState(false);
  const [crashDisabled, setCrashDisabled] = useState(false);
  const attemptsRef = useRef(0);
  const crashInputRef = useRef<HTMLInputElement>(null);
  const crashLogRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const restoringRef = useRef(false);
  const restoreTimerRef = useRef<number | null>(null);
  const crtTimerRef = useRef<number | null>(null);
  const freezeScrollYRef = useRef(0);
  const [loopEpoch, setLoopEpoch] = useState(0);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const freezePageScroll = useCallback(() => {
    if (document.body.style.position === "fixed") return;
    freezeScrollYRef.current = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${freezeScrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }, []);

  const unfreezePageScroll = useCallback(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, freezeScrollYRef.current);
  }, []);

  const resetSequence = useCallback(() => {
    setTyped("");
    setCursorHidden(false);
    setIsExecuting(false);
    setOutput([]);
    setPipelineVisible(false);
    setStatusVisible(false);
    setStatusLabel("idle");
    setStageState({ build: "idle", test: "idle", deploy: "idle" });
  }, []);

  const playSequence = useCallback(
    async (signal: AbortSignal) => {
      resetSequence();
      await sleep(700, signal);

      await typeCommand(COMMIT_CMD, setTyped, signal);

      // Brief review pause before Enter
      await sleep(420 + Math.random() * 180, signal);
      setCursorHidden(true);
      setIsExecuting(true);

      // Git hook / commit latency
      await sleep(680 + Math.random() * 220, signal);
      setIsExecuting(false);

      await appendOutput(
        { text: "[main a3f21c9] still building", tone: "muted" },
        setOutput,
        signal,
        520,
      );
      await appendOutput(
        { text: " 1 file changed, 2 insertions(+)", tone: "muted" },
        setOutput,
        signal,
        640,
      );
      await appendOutput(
        { text: "✓ committed successfully", tone: "success" },
        setOutput,
        signal,
        720,
      );

      await sleep(560, signal);
      setPipelineVisible(true);

      const stageDurations: Record<StageKey, number> = {
        build: 920,
        test: 760,
        deploy: 880,
      };

      for (const key of STAGES) {
        setStageState((prev) => ({ ...prev, [key]: "active" }));
        await sleep(stageDurations[key], signal);
        setStageState((prev) => ({ ...prev, [key]: "done" }));
        await sleep(220, signal);
      }

      await sleep(480, signal);
      setStatusVisible(true);
      setStatusLabel("deploying");
      await sleep(1200, signal);
      setStatusLabel("online");
    },
    [resetSequence],
  );

  useEffect(() => {
    if (reduced) {
      setTyped(COMMIT_CMD);
      setCursorHidden(true);
      setOutput([
        { text: "[main a3f21c9] still building", tone: "muted" },
        { text: " 1 file changed, 2 insertions(+)", tone: "muted" },
        { text: "✓ committed successfully", tone: "success" },
      ]);
      setPipelineVisible(true);
      setStageState({ build: "done", test: "done", deploy: "done" });
      setStatusVisible(true);
      setStatusLabel("online");
      return;
    }

    if (crashOpen || crtState !== "idle") return;

    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        const controller = new AbortController();
        abortRef.current = controller;
        try {
          await playSequence(controller.signal);
          await sleep(5200, controller.signal);
        } catch {
          break;
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [playSequence, reduced, crashOpen, crtState, loopEpoch]);

  const clearCrtTimers = useCallback(() => {
    if (crtTimerRef.current) {
      window.clearTimeout(crtTimerRef.current);
      crtTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const shell = getSiteShell();
    if (!shell) return;

    clearSiteCrtClasses(shell);

    if (crtState === "idle") {
      unpinSiteFromViewport();
      return;
    }

    pinSiteToViewport(freezeScrollYRef.current);
    shell.classList.add("site-crt-active");

    if (crtState === "power-off") {
      shell.classList.add("footer-crt-power-off");
      return;
    }

    if (crtState === "collapsed") {
      shell.classList.add("footer-crt-collapsed");
      return;
    }

    if (crtState === "power-on") {
      shell.classList.add("footer-crt-power-on");
      return;
    }

    if (crtState === "online-glow") {
      shell.classList.add("footer-crt-online-glow");
    }
  }, [crtState]);

  useEffect(() => {
    return () => {
      unpinSiteFromViewport();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (restoreTimerRef.current) window.clearTimeout(restoreTimerRef.current);
      clearCrtTimers();
    };
  }, [clearCrtTimers]);

  useEffect(() => {
    const locked = crashOpen || crtState !== "idle";
    if (!locked) return;

    freezePageScroll();

    const onWheel = (event: WheelEvent) => {
      const log = crashLogRef.current;
      if (log && log.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        log.scrollTop += event.deltaY;
        return;
      }
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      const log = crashLogRef.current;
      if (log && log.contains(event.target as Node)) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    const t = crashOpen
      ? window.setTimeout(() => crashInputRef.current?.focus(), 350)
      : undefined;

    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [crashOpen, crtState, freezePageScroll]);

  useEffect(() => {
    if (crashOpen || crtState !== "idle") return;
    unfreezePageScroll();
  }, [crashOpen, crtState, unfreezePageScroll]);

  useEffect(() => {
    const log = crashLogRef.current;
    if (!log) return;
    requestAnimationFrame(() => {
      log.scrollTop = log.scrollHeight;
    });
  }, [crashLog]);

  const pushCrash = useCallback((text: string, tone: CrashEntry["tone"]) => {
    setCrashLog((prev) => [...prev, { text, tone }]);
  }, []);

  const openCrashOverlay = useCallback(() => {
    abortRef.current?.abort();
    setCrashOpen(true);
    setCrashLog([
      { text: "SITE CRASHED.", tone: "err" },
      { text: "Something you did broke production. Please revert.", tone: "muted" },
      { text: "Uncaught Error: user clicked the thing they were told not to.", tone: "err" },
      { text: "Type help for options — or restore if git isn't your thing.", tone: "muted" },
    ]);
    setRestored(false);
    setCrashDisabled(false);
    setCrashInput("");
    attemptsRef.current = 0;
  }, []);

  const triggerCrash = () => {
    if (crashOpen || crtState === "power-off" || crtState === "power-on") return;
    if (restoreTimerRef.current) {
      window.clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }
    clearCrtTimers();
    restoringRef.current = false;
    freezePageScroll();

    if (reduced) {
      setCrtState("collapsed");
      openCrashOverlay();
      return;
    }

    setCrtState("power-off");
    crtTimerRef.current = window.setTimeout(() => {
      setCrtState("collapsed");
      setShowSpark(true);
      openCrashOverlay();
      crtTimerRef.current = window.setTimeout(() => {
        setShowSpark(false);
        crtTimerRef.current = null;
      }, CRT_SPARK_MS);
    }, CRT_POWER_MS);
  };

  const restoreSite = () => {
    if (restoringRef.current) return;
    restoringRef.current = true;
    setRestored(true);
    setCrashDisabled(true);
    if (restoreTimerRef.current) window.clearTimeout(restoreTimerRef.current);
    clearCrtTimers();

    restoreTimerRef.current = window.setTimeout(() => {
      setCrashOpen(false);
      setRestored(false);
      setCrashDisabled(false);

      if (reduced) {
        setCrtState("idle");
        restoringRef.current = false;
        restoreTimerRef.current = null;
        setLoopEpoch((n) => n + 1);
        return;
      }

      setCrtState("power-on");
      crtTimerRef.current = window.setTimeout(() => {
        setCrtState("online-glow");
        crtTimerRef.current = window.setTimeout(() => {
          setCrtState("idle");
          restoringRef.current = false;
          restoreTimerRef.current = null;
          crtTimerRef.current = null;
          setLoopEpoch((n) => n + 1);
        }, CRT_GLOW_MS);
      }, CRT_POWER_MS);
    }, RESTORE_BANNER_MS);
  };

  const showHelp = () => {
    for (const line of HELP_LINES) {
      pushCrash(line.text, line.tone);
    }
  };

  const handleCrashSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    const raw = crashInput;
    const cmd = normalizeCommand(raw);
    if (!cmd || crashDisabled || restoringRef.current) return;

    pushCrash(`$ ${raw}`, "echo");
    setCrashInput("");

    if (cmd === "help" || cmd === "?") {
      showHelp();
      return;
    }

    if (isRecoveryCommand(raw)) {
      pushCrash("Reverting last deployment...", "ok");
      window.setTimeout(() => {
        pushCrash("✓ HEAD restored to last known good state.", "ok");
        restoreSite();
      }, 700);
      return;
    }

    attemptsRef.current += 1;
    pushCrash(`bash: ${raw}: command not found`, "err");

    if (attemptsRef.current === 1) {
      pushCrash("hint: type help to see recovery options.", "hint");
    } else if (attemptsRef.current === 2) {
      pushCrash("hint: not a git person? try restore or rollback.", "hint");
    } else if (attemptsRef.current >= 3) {
      pushCrash("hint: still stuck? type restore", "hint");
    }
  };

  const onCrashKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      // Keep overlay open — user must restore via command
      return;
    }
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div className="overflow-hidden rounded-[10px] border border-[rgba(201,163,106,0.18)] bg-surface shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 border-b border-[rgba(201,163,106,0.18)] bg-[linear-gradient(180deg,#1c1c1e,#141416)] px-3.5 py-2.5">
            <span className="size-2.5 rounded-full bg-[#e2574c]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#e0b959]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#6fcf7f]" aria-hidden="true" />
            <span className="ml-2.5 font-mono text-[11px] tracking-wide text-muted">
              ashmit@portfolio ~ main
            </span>
          </div>
          <div className="min-h-[7.5rem] px-5 py-4 font-mono text-[13px] leading-[1.75] sm:text-sm">
            <div>
              <span className="mr-1.5 text-accent">$</span>
              <span className="text-foreground">{typed}</span>
              {!cursorHidden ? (
                <span className="footer-cursor ml-0.5 text-accent" aria-hidden="true">
                  ▌
                </span>
              ) : null}
            </div>
            {isExecuting ? (
              <div className="mt-1 text-muted footer-output-line" aria-hidden="true">
                <span className="footer-wait-dots">running git hooks</span>
              </div>
            ) : null}
            <div className="mt-1 space-y-0.5" aria-live="polite">
              {output.map((line, index) => (
                <div
                  key={`${index}-${line.text}`}
                  className={cn(
                    "footer-output-line",
                    line.tone === "success" ? "text-[#6fcf7f]" : "text-muted",
                  )}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-2.5 px-1 font-mono text-[11px] tracking-[0.08em] transition-all duration-300",
            pipelineVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-1.5 opacity-0",
          )}
          aria-hidden={!pipelineVisible}
        >
          <StagePill label="Build" state={stageState.build} />
          <span className="text-[rgba(201,163,106,0.4)]" aria-hidden="true">
            →
          </span>
          <StagePill label="Test" state={stageState.test} />
          <span className="text-[rgba(201,163,106,0.4)]" aria-hidden="true">
            →
          </span>
          <StagePill label="Deploy" state={stageState.deploy} />
        </div>

        <div
          className={cn(
            "mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(201,163,106,0.18)] px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-muted transition-all duration-300",
            statusVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-1.5 opacity-0",
          )}
          aria-hidden={!statusVisible}
        >
          <span className="footer-pulse-dot" aria-hidden="true" />
          <span>
            SYSTEM: <span className="text-foreground">online</span>
            <span className="mx-1.5 opacity-50">·</span>
            UPTIME: <span className="text-foreground">2yrs</span>
            <span className="mx-1.5 opacity-50">·</span>
            STATUS: <span className="text-foreground">{statusLabel}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={triggerCrash}
          className="footer-copyright group mx-auto cursor-pointer border-0 bg-transparent px-2 py-1.5 font-mono text-[11px] tracking-[0.04em] text-muted transition-[color,letter-spacing] duration-200 hover:tracking-[0.12em] hover:text-accent"
        >
          © {YEAR} {site.name}
          <span className="mt-1 block text-[9px] tracking-[0.04em] text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            // click at your own risk
          </span>
        </button>
      </div>

      {portalReady
        ? createPortal(
            <>
              {showSpark ? (
                <div
                  className="footer-crt-spark pointer-events-none fixed inset-0 z-[99]"
                  aria-hidden
                />
              ) : null}

              {crashOpen ? (
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-[rgba(4,3,2,0.92)] p-5 backdrop-blur-[2px]"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Portfolio crash recovery"
                >
                  <div className="footer-crash-in flex max-h-[min(90dvh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-[10px] border border-[rgba(226,87,76,0.4)] bg-[#0d0d0e] shadow-[0_0_0_1px_rgba(226,87,76,0.08),0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                    <div className="flex shrink-0 items-center gap-2 border-b border-[rgba(226,87,76,0.3)] bg-[linear-gradient(180deg,#201816,#151210)] px-4 py-2.5 font-mono text-[12px] tracking-[0.05em] text-[#e2574c]">
                      ⚠ &nbsp;PORTFOLIO.EXE HAS STOPPED RESPONDING
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col px-5 py-5">
                      <div
                        ref={crashLogRef}
                        tabIndex={0}
                        className="crash-log-scroll mb-2 min-h-0 flex-1 overflow-y-auto overscroll-contain font-mono text-[12.5px] leading-[1.8] focus:outline-none"
                        style={{ maxHeight: "min(16rem, 48dvh)" }}
                      >
                        {crashLog.map((entry, index) => (
                          <div
                            key={`${entry.text}-${index}`}
                            className={cn(
                              entry.tone === "echo" && "text-foreground",
                              entry.tone === "err" && "text-[#e2574c]",
                              entry.tone === "ok" && "text-[#6fcf7f]",
                              entry.tone === "hint" && "text-accent",
                              entry.tone === "muted" && "text-muted",
                            )}
                          >
                            {entry.text}
                          </div>
                        ))}
                      </div>
                      <form
                        onSubmit={handleCrashSubmit}
                        className="flex shrink-0 items-center gap-2 border-t border-line pt-2.5"
                      >
                        <span className="font-mono text-[#e2574c]" aria-hidden="true">
                          $
                        </span>
                        <input
                          ref={crashInputRef}
                          value={crashInput}
                          onChange={(e) => setCrashInput(e.target.value)}
                          onKeyDown={onCrashKeyDown}
                          disabled={crashDisabled}
                          placeholder="try help or restore"
                          autoComplete="off"
                          spellCheck={false}
                          className="flex-1 bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-[#4a463d] disabled:opacity-50"
                          aria-label="Recovery command"
                        />
                      </form>
                      {restored ? (
                        <p className="footer-restored-banner mt-2.5 flex items-center gap-2 font-mono text-[12.5px] text-[#6fcf7f]">
                          ✓ Site restored. Reloading in style, not in page.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
