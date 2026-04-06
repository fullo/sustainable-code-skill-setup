---
name: gc-mobile-ios
description: >-
  Green coding audit for iOS apps (Swift/SwiftUI/UIKit). Measures energy
  consumption, checks for battery-draining patterns, and applies Creedengo iOS
  rules. Use when the user asks about iOS app sustainability, energy efficiency,
  battery drain, or green mobile development for Apple platforms.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Green Coding — iOS

Audit an iOS app for energy efficiency, battery impact, and sustainability.

## When to use

- Auditing an iOS/iPadOS/watchOS app for energy consumption
- Investigating battery drain complaints
- Reviewing Swift/SwiftUI/UIKit code for green patterns
- Measuring SCI for a mobile operation (API call, screen render, background task)

## MCP tools (optional)

If the `sustainable-code` MCP server is configured:

| Tool | Purpose |
|------|---------|
| `sci_calculate` | Compute SCI per mobile operation |
| `grid_carbon_intensity` | Get grid carbon intensity for user region |
| `sci_compare` | Compare SCI before/after optimization |
| `creedengo_check` | Check Swift files for energy-wasteful patterns |

## Workflow

```
iOS Green Audit Progress:
- [ ] Phase 1: Explore — understand architecture and energy profile
- [ ] Phase 2: Energy profiling — identify battery-draining operations
- [ ] Phase 3: Code patterns — check against Creedengo iOS rules
- [ ] Phase 4: Network efficiency — minimize data transfer
- [ ] Phase 5: Asset optimization — reduce resource footprint
- [ ] Phase 6: SCI measurement — quantify carbon per operation
- [ ] Phase 7: Report and recommendations
```

## Phase 1 — Explore

Understand the app's architecture and energy profile:

- Language: Swift, Objective-C, or mixed?
- UI framework: SwiftUI, UIKit, or hybrid?
- Architecture: MVC, MVVM, TCA, VIPER?
- Dependencies: CocoaPods, SPM, Carthage? How many?
- Background tasks: push notifications, background fetch, location tracking?
- Network layer: URLSession, Alamofire, custom?
- Persistence: Core Data, SwiftData, Realm, SQLite, UserDefaults?
- Media: camera, video, audio processing?
- Sensors: GPS, accelerometer, Bluetooth, NFC?

## Phase 2 — Energy profiling

Identify the biggest energy consumers. On iOS, the main energy drains are:

| Component | Energy impact | What to check |
|-----------|--------------|---------------|
| **Location Services** | Very high | Continuous GPS vs significant-change vs visit monitoring |
| **Networking** | High | Request frequency, payload size, background transfers |
| **CPU processing** | High | Main thread blocking, inefficient algorithms, polling loops |
| **Graphics/GPU** | High | Overdraw, off-screen rendering, animation complexity |
| **Bluetooth/sensors** | Medium-high | Polling frequency, unnecessary scans |
| **Display** | Medium | Brightness APIs, always-on content, dark mode support |
| **Background tasks** | Medium | BGTaskScheduler usage, background refresh frequency |

### Measurement tools

Recommend the user profile their app using:

1. **Xcode Energy Gauge** (Product → Profile → Energy Impact) — real-time energy score (0-20 scale) during development
2. **Xcode Instruments — Energy Log** — detailed per-subsystem breakdown (CPU, GPU, network, location, Bluetooth)
3. **MetricKit** — production energy metrics from real users (iOS 13+):
   ```swift
   // Add MXMetricManagerSubscriber to receive daily energy reports
   class MetricsSubscriber: NSObject, MXMetricManagerSubscriber {
       func didReceive(_ payloads: [MXMetricPayload]) {
           // payloads contain cumulativeCellularConditionTime,
           // cumulativeWiFiConditionTime, cpuMetrics, gpuMetrics
       }
   }
   ```
4. **Xcode Organizer → Energy** — aggregated energy data from App Store users

## Phase 3 — Code patterns (Creedengo iOS rules)

Check Swift files against [Creedengo iOS](https://github.com/green-code-initiative/creedengo-ios) energy rules:

| Rule | Pattern to avoid | Green alternative |
|------|-----------------|-------------------|
| **Location precision** | `kCLLocationAccuracyBest` when not needed | Use `kCLLocationAccuracyHundredMeters` or `CLLocationManager.significantLocationChangeMonitoringAvailable()` |
| **Location continuous** | `startUpdatingLocation()` running permanently | Use `startMonitoringSignificantLocationChanges()` or `requestLocation()` for one-shot |
| **Sensor polling** | Timer-based accelerometer/gyroscope reads | Use `CMMotionManager` with appropriate `updateInterval`, stop when not needed |
| **Idle timer** | `UIApplication.shared.isIdleTimerDisabled = true` | Only disable when genuinely needed (navigation, video playback), re-enable promptly |
| **Brightness override** | Setting `UIScreen.main.brightness` to max | Let the system manage brightness, respect auto-brightness |
| **Torch/flashlight** | `AVCaptureDevice.torchMode = .on` left on | Turn off torch as soon as task completes |
| **Animation overuse** | Complex `UIView.animate` chains, always-running CADisplayLink | Use `UIView.animate` with `prefers-reduced-motion` check, avoid continuous animations |
| **Bluetooth scanning** | `centralManager.scanForPeripherals` without timeout | Set a scan timeout, stop scanning once device found |
| **Background fetch** | Aggressive `setMinimumBackgroundFetchInterval` | Use `BGAppRefreshTaskRequest` with reasonable earliest begin date |
| **Large image loading** | Loading full-resolution images into memory | Use `UIImage(contentsOfFile:)` with downsampling, or `ImageIO` for thumbnails |

Use the `creedengo_check` MCP tool on Swift files, or manually review against these patterns.

Additionally check for general Swift energy patterns:

- **Prefer `struct` over `class`** — value types avoid heap allocation and ARC overhead
- **Avoid `DispatchQueue.main.async` flooding** — batch UI updates
- **Use `lazy var`** for expensive computed properties
- **Prefer `async/await`** over completion handler chains — cleaner, avoids retain cycles
- **Use `URLSession` background transfers** for large downloads instead of foreground requests

## Phase 4 — Network efficiency

Mobile network operations are energy-expensive. Check:

| Check | Why it matters |
|-------|---------------|
| **Batch API calls** | Each network transaction wakes the radio. Batch multiple requests into one |
| **Compress payloads** | Use gzip/brotli. Consider Protocol Buffers or MessagePack over JSON for high-frequency APIs |
| **Cache aggressively** | Use `URLCache` with appropriate policies. Cache images with `NSCache` or third-party (Kingfisher, SDWebImage) |
| **Avoid polling** | Replace polling with push notifications (APNs) or WebSocket for real-time updates |
| **Background transfers** | Use `URLSessionConfiguration.background` for non-urgent uploads/downloads — iOS batches these efficiently |
| **Prefetch intelligently** | Use `UITableViewDataSourcePrefetching` / `UICollectionViewDataSourcePrefetching` — don't prefetch everything |
| **Reduce image sizes** | Request appropriate resolution from server (`?w=375` for phone, `?w=768` for tablet) |
| **HTTP caching headers** | Ensure `ETag`, `Last-Modified`, `Cache-Control` are set server-side |

## Phase 5 — Asset optimization

| Asset type | Check | Target |
|------------|-------|--------|
| **Images** | HEIC preferred over PNG/JPEG. Use Asset Catalog with device-specific variants | Smallest format for quality needed |
| **App size** | App Thinning enabled? Bitcode? On-demand resources for large assets? | Smaller download = less energy to transfer |
| **Fonts** | System fonts (SF Pro, SF Mono) preferred over custom fonts | Zero download cost for system fonts |
| **Videos** | HLS adaptive streaming? Appropriate resolution per device? | Don't stream 4K to an iPhone SE |
| **Core Data** | Batch inserts (`NSBatchInsertRequest`)? Proper indexing? Fetch limits? | Reduce disk I/O and CPU |
| **Launch time** | Minimize work in `application(_:didFinishLaunchingWithOptions:)` | Faster launch = less energy |

## Phase 6 — SCI measurement

Measure the carbon intensity of key operations:

1. **Choose functional units**: "per API call", "per screen render", "per background sync"
2. **Measure wall-clock time** using `CFAbsoluteTimeGetCurrent()` or `ContinuousClock`:
   ```swift
   let clock = ContinuousClock()
   let duration = try await clock.measure {
       // operation to measure
   }
   let wallTimeMs = duration.components.seconds * 1000
       + duration.components.attoseconds / 1_000_000_000_000_000
   ```
3. **Get grid carbon intensity** via `grid_carbon_intensity` MCP tool (use user's region)
4. **Calculate SCI** via `sci_calculate` MCP tool:
   - `wallTimeMs`: measured duration
   - `devicePowerW`: ~3W (iPhone average) or ~5W (iPad)
   - `carbonIntensity`: from step 3
   - `embodiedTotalG`: ~70000 (iPhone, from Apple Environmental Report)
   - `lifetimeHours`: ~26280 (3 years typical iPhone lifecycle)

## Phase 7 — Report

```
## iOS Green Audit: [app name]

### Energy profile
| Component | Impact | Status | Notes |
|-----------|--------|--------|-------|
| Location | high/medium/low/none | ok/warn/fail | ... |
| Networking | ... | ... | ... |
| CPU/processing | ... | ... | ... |
| Graphics/GPU | ... | ... | ... |
| Sensors | ... | ... | ... |
| Background tasks | ... | ... | ... |

### Code patterns (Creedengo iOS)
| File | Rule violated | Severity | Fix |
|------|--------------|----------|-----|
| ... | ... | high/medium/low | ... |

### SCI measurements
| Operation | SCI (mgCO2eq) | Notes |
|-----------|---------------|-------|
| ... | ... | ... |

### Top 5 Recommendations
1. [highest impact action]
2. ...

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — [GSF SCI Specification v1.0](https://sci-guide.greensoftware.foundation/) (ISO 21031:2024)
- Code rules: [Creedengo iOS](https://github.com/green-code-initiative/creedengo-ios) — green-code-initiative
- Energy profiling: Xcode Instruments Energy Log / MetricKit
- Device power: [value] W — Apple Product Environmental Report [year]
- Embodied carbon: [value] gCO2eq — [Apple Product Environmental Report](https://www.apple.com/environment/) [year]
- Grid carbon intensity: [value] gCO2eq/kWh — [Ember Global Electricity Review](https://ember-energy.org/) [year]
- Platform guide: [Apple Energy Efficiency Guide for iOS Apps](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/)
```

## Gotchas

- **Xcode Energy Gauge is not available in simulators**: Energy profiling requires a physical device. Always test energy on real hardware, not the iOS Simulator.
- **MetricKit reports are daily aggregates**: You cannot get real-time energy data from MetricKit. For granular measurement during development, use Xcode Instruments instead.
- **Battery percentage is not a valid energy metric**: Battery drain depends on total capacity, charge cycles, ambient temperature, and other apps. Use Xcode's energy score (0-20) or MetricKit cumulative metrics instead.
- **Background app refresh varies by user settings**: Users can disable background refresh per-app. Don't assume your background tasks always run — and don't over-schedule as backup.

## Related commands

- `/gc-mobile-android` — green coding audit for Android apps
- `/gc-setup` — full 9-phase sustainability audit (web-focused)
- `/gc-measure-sci` — measure SCI for any operation
- `/gc-dev` — daily development companion
