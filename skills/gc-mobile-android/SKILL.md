---
name: gc-mobile-android
description: >-
  Green coding audit for Android apps (Kotlin/Java/Jetpack Compose). Measures
  energy consumption, checks for battery-draining patterns, and applies Creedengo
  Android rules. Use when the user asks about Android app sustainability, energy
  efficiency, battery drain, or green mobile development for Android.
license: MIT
metadata:
  author: fullo
  version: "1.0"
---

# Green Coding — Android

Audit an Android app for energy efficiency, battery impact, and sustainability.

## When to use

- Auditing an Android app for energy consumption
- Investigating battery drain complaints
- Reviewing Kotlin/Java code for green patterns
- Measuring SCI for a mobile operation (API call, screen render, background task)

## MCP tools (optional)

If the `sustainable-code` MCP server is configured:

| Tool | Purpose |
|------|---------|
| `sci_calculate` | Compute SCI per mobile operation |
| `grid_carbon_intensity` | Get grid carbon intensity for user region |
| `sci_compare` | Compare SCI before/after optimization |
| `creedengo_check` | Check Kotlin/Java files for energy-wasteful patterns |

## Workflow

```
Android Green Audit Progress:
- [ ] Phase 1: Explore — understand architecture and energy profile
- [ ] Phase 2: Energy profiling — identify battery-draining operations
- [ ] Phase 3: Code patterns — check against Creedengo Android rules
- [ ] Phase 4: Network efficiency — minimize data transfer
- [ ] Phase 5: Asset optimization — reduce resource footprint
- [ ] Phase 6: SCI measurement — quantify carbon per operation
- [ ] Phase 7: Report and recommendations
```

## Phase 1 — Explore

Understand the app's architecture and energy profile:

- Language: Kotlin, Java, or mixed?
- UI framework: Jetpack Compose, XML Views, or hybrid?
- Architecture: MVVM, MVI, Clean Architecture?
- Dependencies: how many? Gradle module structure?
- Background work: WorkManager, AlarmManager, Services?
- Network layer: Retrofit, Ktor, OkHttp, Volley?
- Persistence: Room, SQLite, DataStore, SharedPreferences?
- Media: camera, video, audio processing?
- Sensors: GPS, accelerometer, Bluetooth, NFC?
- Target API level and `minSdk`?

## Phase 2 — Energy profiling

Identify the biggest energy consumers. On Android, the main energy drains are:

| Component | Energy impact | What to check |
|-----------|--------------|---------------|
| **Location Services** | Very high | GPS polling frequency, `PRIORITY_HIGH_ACCURACY` vs `PRIORITY_BALANCED_POWER_ACCURACY` |
| **Wake locks** | Very high | `PowerManager.WakeLock` held too long, missing release |
| **Networking** | High | Request frequency, payload size, radio wake-ups |
| **CPU processing** | High | Main thread blocking, inefficient algorithms, polling |
| **Graphics/GPU** | High | Overdraw, hardware layer misuse, complex Compose recompositions |
| **Alarms** | Medium-high | `AlarmManager.setRepeating` with short intervals |
| **Sensors** | Medium | Polling frequency, unnecessary sensor registrations |
| **Background services** | Medium | Foreground services running too long, `START_STICKY` misuse |

### Measurement tools

Recommend the user profile their app using:

1. **Android Studio Power Profiler** — per-rail power consumption on Pixel 6+ (API 29+):
   - Open Profiler → select Power track
   - Shows per-component energy: CPU, GPU, display, cellular, WiFi, GPS, audio
2. **Battery Historian** — post-hoc battery analysis from bug reports:
   ```bash
   adb bugreport > bugreport.zip
   # Upload to https://bathist.ef.lc/ or run Battery Historian locally
   ```
3. **Android Vitals (Play Console)** — production battery metrics:
   - Excessive wake-ups (>10 per hour)
   - Stuck wake locks (>1 hour in background)
   - Excessive Wi-Fi scans in background
   - Excessive mobile radio activity
4. **`dumpsys batterystats`** — raw battery stats from device:
   ```bash
   adb shell dumpsys batterystats --reset  # reset stats
   # ... use the app ...
   adb shell dumpsys batterystats > stats.txt
   ```
5. **Perfetto** — system-wide tracing for deep energy analysis:
   ```bash
   adb shell perfetto --config :test --out /data/misc/perfetto-traces/trace.pb
   # Open at https://ui.perfetto.dev/
   ```

## Phase 3 — Code patterns (Creedengo Android rules)

Check Kotlin/Java files against [Creedengo](https://github.com/green-code-initiative/creedengo-rules-specifications) Android energy rules:

| Rule | Pattern to avoid | Green alternative |
|------|-----------------|-------------------|
| **Location precision** | `PRIORITY_HIGH_ACCURACY` when not needed | Use `PRIORITY_BALANCED_POWER_ACCURACY` or `PRIORITY_LOW_POWER` |
| **Location continuous** | `requestLocationUpdates()` without stop | Set `maxWaitTime`, use `removeLocationUpdates()` when done |
| **Wake locks** | `PowerManager.WakeLock` without timeout | Always use `acquire(timeoutMs)`, release in `finally` block |
| **Sensor polling** | `SensorManager.registerListener` with `SENSOR_DELAY_FASTEST` | Use `SENSOR_DELAY_NORMAL` or `SENSOR_DELAY_UI`, unregister when not needed |
| **Keep screen on** | `FLAG_KEEP_SCREEN_ON` left on permanently | Only set when genuinely needed, clear when done |
| **Bluetooth scanning** | `startLeScan()` without timeout or stop | Use `ScanSettings.Builder().setScanMode(SCAN_MODE_LOW_POWER)`, stop after finding device |
| **AlarmManager** | `setRepeating()` with short interval | Use `WorkManager` with constraints, or `setInexactRepeating()` to allow batching |
| **Vibration** | Long or repeated vibration patterns | Keep vibrations short, use haptic feedback patterns |
| **Camera/flashlight** | Camera preview running when not visible | Release camera in `onPause()`, use `CameraX` lifecycle-aware API |
| **Fused Location** | Not using `FusedLocationProviderClient` | Always prefer Fused Location over raw `LocationManager` |

Use the `creedengo_check` MCP tool on Kotlin/Java files, or manually review against these patterns.

Additionally check for general Android energy patterns:

- **Avoid `StrictMode` violations** — disk/network I/O on main thread wastes energy waiting
- **Use `RecyclerView` over `ListView`** — view recycling reduces CPU and memory
- **Prefer `Lifecycle`-aware components** — auto-cleanup avoids background leaks
- **Use `StateFlow`/`SharedFlow`** over `LiveData` in new code — cleaner coroutine integration
- **Jetpack Compose**: minimize recompositions — use `remember`, `derivedStateOf`, stable types
- **Use `App Startup` library** to batch initialization instead of multiple `ContentProvider` inits

## Phase 4 — Network efficiency

Mobile network operations are energy-expensive (radio state machine: idle → low power → high power). Check:

| Check | Why it matters |
|-------|---------------|
| **Batch API calls** | Each request wakes the cellular radio for ~20-30 seconds. Batch to reduce wake-ups |
| **Compress payloads** | Use gzip/brotli (`OkHttp` handles this automatically with `Accept-Encoding: gzip`) |
| **Cache with OkHttp** | Configure `OkHttpClient.cache()` with appropriate `Cache-Control` headers |
| **Avoid polling** | Replace with FCM push notifications or WebSocket for real-time data |
| **Use WorkManager** | For non-urgent network work — system batches with other apps' work, respects Doze |
| **Prefetch wisely** | Use `Paging 3` library for paginated data — don't load entire datasets |
| **Image loading** | Use Coil or Glide with proper disk cache, request appropriate sizes |
| **Doze and App Standby** | Ensure app works correctly in Doze mode (API 23+). Test with `adb shell dumpsys deviceidle force-idle` |

### Network state machine awareness

```
HIGH_POWER (active transfer)
    ↓ (5-10s inactivity)
LOW_POWER (tail state — still draining)
    ↓ (12-20s inactivity)
IDLE (minimal drain)
```

Every small request incurs the full HIGH_POWER → tail cost. Batch requests to avoid repeated radio wake-ups.

## Phase 5 — Asset optimization

| Asset type | Check | Target |
|------------|-------|--------|
| **Images** | WebP preferred over PNG/JPEG. Use `srcset`-equivalent with density qualifiers (`drawable-mdpi/hdpi/xhdpi/xxhdpi`) | Smallest format for quality needed |
| **APK/AAB size** | Android App Bundle enabled? Unused resources removed (`shrinkResources true`)? ProGuard/R8 enabled? | Smaller download = less energy to transfer |
| **Native libraries** | ABI splits configured? Only necessary architectures included? | Don't ship x86 libs if targeting only ARM |
| **Fonts** | System fonts (Roboto, Noto) preferred over custom fonts. Use `downloadable fonts` for custom | Zero APK-size cost for system fonts |
| **Videos** | `ExoPlayer`/`Media3` with adaptive streaming? Appropriate resolution per device? | Don't stream 4K on a low-res device |
| **Room database** | Proper indices? `@Transaction` for batch operations? WAL journal mode? | Reduce disk I/O |
| **Startup time** | Minimize work in `Application.onCreate()`. Use `App Startup` for lazy init | Faster cold start = less energy |
| **Baseline profiles** | [Baseline Profiles](https://developer.android.com/topic/performance/baselineprofiles/overview) for AOT compilation of critical paths | Faster execution = less CPU energy |

## Phase 6 — SCI measurement

Measure the carbon intensity of key operations:

1. **Choose functional units**: "per API call", "per screen render", "per background sync"
2. **Measure wall-clock time** using `System.nanoTime()` or `measureTimeMillis`:
   ```kotlin
   val durationMs = measureTimeMillis {
       // operation to measure
   }
   ```
3. **Get grid carbon intensity** via `grid_carbon_intensity` MCP tool (use user's region)
4. **Calculate SCI** via `sci_calculate` MCP tool:
   - `wallTimeMs`: measured duration
   - `devicePowerW`: ~2.5W (average Android phone) or ~4W (tablet)
   - `carbonIntensity`: from step 3
   - `embodiedTotalG`: ~50000-80000 (varies by device, from manufacturer environmental reports)
   - `lifetimeHours`: ~26280 (3 years typical Android lifecycle)

For more precise measurement, use Android Studio Power Profiler data to derive actual per-operation energy.

## Phase 7 — Report

```
## Android Green Audit: [app name]

### Energy profile
| Component | Impact | Status | Notes |
|-----------|--------|--------|-------|
| Location | high/medium/low/none | ok/warn/fail | ... |
| Wake locks | ... | ... | ... |
| Networking | ... | ... | ... |
| CPU/processing | ... | ... | ... |
| Graphics/GPU | ... | ... | ... |
| Sensors | ... | ... | ... |
| Background work | ... | ... | ... |

### Code patterns (Creedengo Android)
| File | Rule violated | Severity | Fix |
|------|--------------|----------|-----|
| ... | ... | high/medium/low | ... |

### Android Vitals flags
| Metric | Status | Notes |
|--------|--------|-------|
| Excessive wake-ups | ok/warn | ... |
| Stuck wake locks | ok/warn | ... |
| Excessive Wi-Fi scans | ok/warn | ... |

### SCI measurements
| Operation | SCI (mgCO2eq) | Notes |
|-----------|---------------|-------|
| ... | ... | ... |

### Top 5 Recommendations
1. [highest impact action]
2. ...

### Methodology and sources
- Formula: SCI = ((E x I) + M) / R — [GSF SCI Specification v1.0](https://sci-guide.greensoftware.foundation/) (ISO 21031:2024)
- Code rules: [Creedengo](https://github.com/green-code-initiative/creedengo-rules-specifications) Android rules — green-code-initiative
- Energy profiling: Android Studio Power Profiler / Battery Historian / Perfetto
- Device power: [value] W — manufacturer environmental report [year]
- Embodied carbon: [value] gCO2eq — manufacturer environmental report [year]
- Grid carbon intensity: [value] gCO2eq/kWh — [Ember Global Electricity Review](https://ember-energy.org/) [year]
- Platform guide: [Android Battery Optimization](https://developer.android.com/develop/background-work/background-tasks/optimize-battery)
- Android Vitals: [Google Play Console](https://play.google.com/console/)
```

## Gotchas

- **Power Profiler requires Pixel 6+ or ODPM-capable device**: Most non-Pixel Android devices don't expose per-rail power data. Use Battery Historian as a fallback on other devices.
- **Doze mode is unpredictable in development**: When connected to USB (debugging), Doze may not engage. Use `adb shell dumpsys deviceidle force-idle` to test Doze behavior explicitly.
- **Android fragmentation affects energy**: The same code can have very different energy profiles on different devices (chipset, OS version, OEM skin). Test on representative low-end devices, not just flagships.
- **ProGuard/R8 can change behavior**: Code shrinking may inline or remove code that affects energy patterns. Profile the release build, not just debug.

## Related commands

- `/gc-mobile-ios` — green coding audit for iOS apps
- `/gc-setup` — full 9-phase sustainability audit (web-focused)
- `/gc-measure-sci` — measure SCI for any operation
- `/gc-dev` — daily development companion
