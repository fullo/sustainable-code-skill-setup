import { describe, it, expect, afterEach } from "vitest";
import { checkCreedengo } from "../creedengo-check.js";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TMP_DIR = join(tmpdir(), "creedengo-check-tests");
const tempFiles: string[] = [];

async function writeTempFile(
  name: string,
  content: string
): Promise<string> {
  await mkdir(TMP_DIR, { recursive: true });
  const filePath = join(TMP_DIR, name);
  await writeFile(filePath, content, "utf-8");
  tempFiles.push(filePath);
  return filePath;
}

afterEach(async () => {
  for (const f of tempFiles) {
    try {
      await unlink(f);
    } catch {
      // ignore
    }
  }
  tempFiles.length = 0;
});

describe("checkCreedengo", () => {
  // --- JavaScript / TypeScript rules ---

  it("detects setInterval usage in JS", async () => {
    const filePath = await writeTempFile(
      "test.js",
      'setInterval(() => { refresh(); }, 1000);\n'
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("javascript");
    expect(result.issuesFound).toBeGreaterThanOrEqual(1);
    const rule = result.issues.find((i) => i.rule === "GCI69");
    expect(rule).toBeDefined();
    expect(rule!.line).toBe(1);
  });

  it("detects document.write in JS", async () => {
    const filePath = await writeTempFile(
      "test2.js",
      'document.write("<h1>Hello</h1>");\n'
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI75");
    expect(rule).toBeDefined();
  });

  it("detects full lodash import", async () => {
    const filePath = await writeTempFile(
      "test3.ts",
      "import _ from 'lodash';\n_.debounce(fn, 300);\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("javascript");
    const rule = result.issues.find((i) => i.rule === "GCI-LODASH");
    expect(rule).toBeDefined();
  });

  it("detects console.log in JS", async () => {
    const filePath = await writeTempFile(
      "test4.js",
      'console.log("debug value:", x);\n'
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI-LOG");
    expect(rule).toBeDefined();
  });

  it("detects enableHighAccuracy in JS", async () => {
    const filePath = await writeTempFile(
      "test5.js",
      "navigator.geolocation.getCurrentPosition(cb, err, { enableHighAccuracy: true });\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI70");
    expect(rule).toBeDefined();
  });

  // --- PHP rules ---

  it("detects SELECT * in PHP", async () => {
    const filePath = await writeTempFile(
      "test.php",
      '<?php\n$q = "SELECT * FROM users";\n'
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("php");
    const rule = result.issues.find((i) => i.rule === "GCI2");
    expect(rule).toBeDefined();
  });

  it("detects double-quoted strings without interpolation in PHP", async () => {
    const filePath = await writeTempFile(
      "test2.php",
      '<?php\n$name = "hello world";\n'
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI3");
    expect(rule).toBeDefined();
  });

  it("detects var_dump in PHP", async () => {
    const filePath = await writeTempFile(
      "test3.php",
      "<?php\nvar_dump($data);\nprint_r($arr);\n"
    );
    const result = await checkCreedengo(filePath);

    const debugIssues = result.issues.filter((i) => i.rule === "GCI-DEBUG");
    expect(debugIssues.length).toBe(2);
  });

  // --- Python rules ---

  it("detects wildcard import in Python", async () => {
    const filePath = await writeTempFile(
      "test.py",
      "from os import *\nimport sys\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("python");
    const rule = result.issues.find((i) => i.rule === "GCI-WILDCARD");
    expect(rule).toBeDefined();
    expect(result.issuesFound).toBe(1);
  });

  // --- Clean file ---

  it("returns zero issues for a clean file", async () => {
    const filePath = await writeTempFile(
      "clean.js",
      "const x = 1;\nconst y = x + 2;\nexport { y };\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.issuesFound).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  // --- Auto-detection ---

  it("auto-detects language from .js extension", async () => {
    const filePath = await writeTempFile("detect.js", "const x = 1;\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("javascript");
  });

  it("auto-detects language from .php extension", async () => {
    const filePath = await writeTempFile("detect.php", "<?php echo 1;\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("php");
  });

  it("auto-detects language from .py extension", async () => {
    const filePath = await writeTempFile("detect.py", "x = 1\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("python");
  });

  // --- Swift rules (official Creedengo IDs) ---

  it("detects high-accuracy GPS in Swift (GCI524)", async () => {
    const filePath = await writeTempFile(
      "test.swift",
      "locationManager.desiredAccuracy = kCLLocationAccuracyBest\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("swift");
    const rule = result.issues.find((i) => i.rule === "GCI524");
    expect(rule).toBeDefined();
    expect(rule!.line).toBe(1);
  });

  it("detects continuous location updates in Swift (GCI513)", async () => {
    const filePath = await writeTempFile(
      "test2.swift",
      "locationManager.startUpdatingLocation()\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI513");
    expect(rule).toBeDefined();
  });

  it("detects brightness override in Swift (GCI522)", async () => {
    const filePath = await writeTempFile(
      "test3.swift",
      "UIScreen.main.brightness = 1.0\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI522");
    expect(rule).toBeDefined();
  });

  it("auto-detects language from .swift extension", async () => {
    const filePath = await writeTempFile("detect.swift", "let x = 1\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("swift");
  });

  // --- Kotlin rules (official Creedengo IDs) ---

  it("detects WakeLock in Kotlin (GCI508)", async () => {
    const filePath = await writeTempFile(
      "test.kt",
      "val wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, tag)\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("kotlin");
    const rule = result.issues.find((i) => i.rule === "GCI508");
    expect(rule).toBeDefined();
  });

  it("detects high-accuracy location in Kotlin (GCI517)", async () => {
    const filePath = await writeTempFile(
      "test2.kt",
      "val request = LocationRequest.create().setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI517");
    expect(rule).toBeDefined();
  });

  it("detects exact repeating alarm in Kotlin (GCI509)", async () => {
    const filePath = await writeTempFile(
      "test3.kt",
      "alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, start, interval, pending)\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI509");
    expect(rule).toBeDefined();
  });

  it("detects keep screen on in Kotlin (GCI505)", async () => {
    const filePath = await writeTempFile(
      "test4.kt",
      "window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)\n"
    );
    const result = await checkCreedengo(filePath);

    const rule = result.issues.find((i) => i.rule === "GCI505");
    expect(rule).toBeDefined();
  });

  it("auto-detects language from .kt extension", async () => {
    const filePath = await writeTempFile("detect.kt", "val x = 1\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("kotlin");
  });

  // --- Java rules (shares Android rules) ---

  it("detects WakeLock in Java (GCI508)", async () => {
    const filePath = await writeTempFile(
      "Test.java",
      "WakeLock wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, tag);\n"
    );
    const result = await checkCreedengo(filePath);

    expect(result.language).toBe("java");
    const rule = result.issues.find((i) => i.rule === "GCI508");
    expect(rule).toBeDefined();
  });

  it("auto-detects language from .java extension", async () => {
    const filePath = await writeTempFile("Detect.java", "int x = 1;\n");
    const result = await checkCreedengo(filePath);
    expect(result.language).toBe("java");
  });

  // --- Error handling ---

  it("throws for file not found", async () => {
    await expect(
      checkCreedengo("/nonexistent/path/file.js")
    ).rejects.toThrow("Could not read file");
  });

  it("throws for empty file path", async () => {
    await expect(checkCreedengo("")).rejects.toThrow(
      "A valid file path is required"
    );
  });

  it("throws when language cannot be detected", async () => {
    const filePath = await writeTempFile("noext", "some content\n");
    await expect(checkCreedengo(filePath)).rejects.toThrow(
      "Could not detect language"
    );
  });
});
