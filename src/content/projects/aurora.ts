import type { CaseStudyProject } from "@/types/project";

export const aurora: CaseStudyProject = {
  slug: "aurora",
  title: "Aurora",
  subtitle: "Industrial IoT platform for live machines, people, and maps",
  domains: ["mobile"],
  primaryDomain: "mobile",
  role: "Flutter developer — architecture through production",
  timeframe: "IEnergy Digital · July 2025 – Present",
  stack: [
    "Flutter",
    "Riverpod",
    "Firebase Cloud Messaging",
    "SSE",
    "Hive",
    "GitHub Actions",
    "Fastlane",
    "Shorebird",
  ],
  metrics: [
    { label: "Workers on platform", value: "3,500+" },
    { label: "Machines monitored", value: "250+" },
    { label: "Map frame rate", value: "52 FPS" },
    { label: "Release pipeline", value: "12 min" },
  ],
  featured: true,
  sections: [
    {
      id: "context",
      heading: "Context",
      body: "Aurora is the operational picture for industrial sites: 250+ machines and 3,500+ workers, tracked with GPS, BLE beacons, and live telemetry. Supervisors need a map that tells them where people and equipment are, whether a machine is healthy, and when a safety alert fires — on Android and iOS, often in the field.\n\nI designed and built the Flutter client from scratch and owned the path from architecture to store release. The product is not a dashboard demo. If the map stutters, if login fails on one OEM, if a release is blocked by Play Console, the site loses visibility.",
    },
    {
      id: "problem",
      heading: "Problem",
      body: "The live map is the product. Hundreds of device and machine markers update continuously. A naive implementation — fetch the whole tile set, redraw every overlay every frame, treat connectivity as “Wi-Fi is on” — produces jank, memory spikes, and false offline screens.\n\nThe other class of failure is not on the map at all. Production incidents clustered around TLS, missing iOS build config, Play Store versioning, and widget-lifecycle bugs that only showed up after tab switches. The app had to be as careful about delivery and diagnosis as about pixels.",
    },
    {
      id: "investigation",
      heading: "Investigation",
      body: "Flutter DevTools, the Inspector, and the timeline profiler made the map cost obvious: overdraw on markers, full-layer redraws, and tiles loaded far outside the viewport. Frame time sat around 34 FPS on representative devices once live markers were in play.\n\nIncidents were a different investigation. A login failure on Pixel 9 Pro and Galaxy S24 looked like an app bug until the TLS handshake was traced to an incomplete certificate chain on *.ienergydigital.com. A separate “offline” screen fired while internet worked because a third-party connectivity plugin only inspected the radio, not reachability. Play uploads failed after green CI because of duplicate versionCode and an AD_ID permission mismatch.",
    },
    {
      id: "options-considered",
      heading: "Options considered",
      body: "For the map: load the full dataset and hope clustering saves us; swap to a heavier maps SDK; or keep a custom stack and make loading, caching, and paint explicit. Full-dataset loading would not survive site growth. A new SDK would not fix our overlay model.\n\nFor connectivity: keep the plugin and paper over false positives, or replace it with a native check that actually reaches the API. For releases: keep local flavor selection, or encode dev/prod in Gradle flavors, Xcode schemes, and dart-define so CI cannot ship the wrong world.",
    },
    {
      id: "engineering-decision",
      heading: "Engineering decision",
      body: "Treat the map as a viewport problem, not a “draw everything” problem. Cache tiles after first load. Pre-render layers and markers instead of rebuilding the full overlay tree every frame. Keep only tiles around the current viewport in memory.\n\nTreat connectivity as reachability: a Kotlin/Swift platform channel that pings the server, not OS interface state. Treat releases as a product: Git tags as the version source of truth, GitHub Actions + Docker + Fastlane, OIDC to S3, Shorebird for patches, and a protected production environment so an unreviewed build cannot reach the stores.",
    },
    {
      id: "implementation",
      heading: "Implementation",
      body: "The client follows Clean Architecture with MVVM: presentation stays in widgets, view models own screen state, domain stays independent of Flutter, data owns repositories and persistence. Hive covers offline-first paths for low-connectivity sites. FCM and SSE carry machine status and manpower updates without polling.\n\nThe Android/iOS CI pipeline went from roughly 50 minutes to about 12 by caching Gradle, Flutter, and Pub artifacts, parallelizing Gradle, and containerizing the toolchain. Fastlane handles signing and store upload. Shorebird covers OTA Dart patches; native in-app updates cover Play Store binaries. Adaptive layouts (LayoutBuilder, not MediaQuery inside widgets) give tablet and web the same screens with different compositions.",
      media: [{ type: "diagram", diagramId: "aurora-map" }],
    },
    {
      id: "result",
      heading: "Result",
      body: "The live map holds in the high 40s to ~52 FPS with hundreds of markers. The platform is in production for 3,500+ workers and 250+ machines. Release time dropped ~76%. False offline screens stopped after the native reachability channel replaced the plugin.\n\nThe TLS incident was fixed on the server after we isolated the handshake; certificate pinning stayed as hardening. iOS login was restored by injecting the missing dart-define in CI. Play failures now fail in CI via version validation instead of at the store.",
    },
    {
      id: "reflection",
      heading: "Reflection",
      body: "The map work was expected. The production work was the job. Most of the serious bugs were not “Flutter is slow”; they were lifecycle (a carousel timer animating a disposed widget), contracts (pagination shapes drifting per API), and delivery (config that existed on one platform’s pipeline and not the other).\n\nThe pattern I keep: measure the frame, then measure the handshake, then measure the pipeline. A smooth map on a build that cannot log in is not a ship.",
    },
  ],
};
