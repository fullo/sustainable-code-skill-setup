import { readFile } from "node:fs/promises";
import type { CreedengoIssue, CreedengoResult } from "../lib/types.js";

/**
 * Rule definition used internally for pattern matching.
 */
interface RuleDefinition {
  rule: string;
  pattern: RegExp;
  severity: "warning" | "info";
  message: string;
  suggestion: string;
}

const EXTENSION_MAP: Record<string, string> = {
  ".js": "javascript",
  ".ts": "javascript",
  ".jsx": "javascript",
  ".tsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".php": "php",
  ".py": "python",
  ".java": "java",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".swift": "swift",
};

const JAVASCRIPT_RULES: RuleDefinition[] = [
  {
    rule: "GCI69",
    pattern: /\bsetInterval\s*\(/,
    severity: "warning",
    message: "Usage of setInterval detected.",
    suggestion:
      "Prefer event-driven alternatives (e.g., requestAnimationFrame, IntersectionObserver, or setTimeout chains) to reduce unnecessary CPU wake-ups.",
  },
  {
    rule: "GCI70",
    pattern: /enableHighAccuracy\s*:\s*true/,
    severity: "warning",
    message: "High-accuracy geolocation enabled.",
    suggestion:
      "Use enableHighAccuracy only when precise location is required. GPS drains significantly more battery than network-based location.",
  },
  {
    rule: "GCI72",
    pattern: /\.style\.animation\s*=/,
    severity: "info",
    message: "CSS animation set via JavaScript.",
    suggestion:
      "Prefer CSS classes with animations defined in stylesheets. CSS animations are more efficiently optimized by the browser.",
  },
  {
    rule: "GCI75",
    pattern: /\bdocument\.write\s*\(/,
    severity: "warning",
    message: "Usage of document.write detected.",
    suggestion:
      "Avoid document.write as it blocks parsing and forces synchronous reflows. Use DOM APIs like appendChild or insertAdjacentHTML instead.",
  },
  {
    rule: "GCI-LOG",
    pattern: /\bconsole\.log\s*\(/,
    severity: "info",
    message: "console.log found in source code.",
    suggestion:
      "Remove console.log statements from production code. Logging generates unnecessary string processing and I/O.",
  },
  {
    rule: "GCI-LODASH",
    pattern: /import\s+_\s+from\s+['"]lodash['"]/,
    severity: "warning",
    message: "Importing entire lodash library.",
    suggestion:
      "Import specific lodash functions (e.g., import debounce from 'lodash/debounce') to enable tree-shaking and reduce bundle size.",
  },
];

const PHP_RULES: RuleDefinition[] = [
  {
    rule: "GCI2",
    pattern: /SELECT\s+\*/i,
    severity: "warning",
    message: "SELECT * detected in SQL query.",
    suggestion:
      "Select only the columns you need. SELECT * transfers unnecessary data and prevents query optimization.",
  },
  {
    rule: "GCI3",
    pattern: /"[^"$\\]*"/,
    severity: "info",
    message: "Double-quoted string without variable interpolation.",
    suggestion:
      "Use single quotes for strings that do not contain variables. PHP parses double-quoted strings for interpolation, wasting cycles.",
  },
  {
    rule: "GCI4",
    pattern: /(?:for|while|foreach)\s*\(.*\)\s*\{[^}]*\bnew\s+/,
    severity: "warning",
    message: "Object instantiation detected inside a loop.",
    suggestion:
      "Move object creation outside the loop when possible. Repeated instantiation increases memory allocation and GC pressure.",
  },
  {
    rule: "GCI-DEBUG",
    pattern: /\b(?:var_dump|print_r)\s*\(/,
    severity: "warning",
    message: "Debug output function detected.",
    suggestion:
      "Remove var_dump/print_r from production code. Debug output wastes processing and may leak sensitive data.",
  },
];

const PYTHON_RULES: RuleDefinition[] = [
  {
    rule: "GCI-WILDCARD",
    pattern: /from\s+\S+\s+import\s+\*/,
    severity: "warning",
    message: "Wildcard import detected.",
    suggestion:
      "Import only what you need. Wildcard imports load all module symbols into memory and obscure dependencies.",
  },
  {
    rule: "GCI-GLOBAL-LOOP",
    pattern: /(?:for|while)\s+.*:\s*\n?\s*.*\bglobal\b/,
    severity: "info",
    message: "Global variable access may be occurring inside a loop.",
    suggestion:
      "Assign global variables to local references before the loop. Local variable lookups are faster in Python.",
  },
  {
    rule: "GCI-LIST-ITER",
    pattern: /for\s+\w+\s+in\s+\[.*for\s+/,
    severity: "info",
    message: "List comprehension used where a generator expression may suffice.",
    suggestion:
      "If you only iterate over the result, use a generator expression (parentheses instead of brackets) to avoid allocating the full list in memory.",
  },
];

const SWIFT_RULES: RuleDefinition[] = [
  {
    rule: "GCI524",
    pattern: /kCLLocationAccuracyBest/,
    severity: "warning",
    message: "Sobriety: Thrifty Geolocation — high-accuracy GPS location requested.",
    suggestion:
      "Use kCLLocationAccuracyReduced or kCLLocationAccuracyHundredMeters when precise location is not required. GPS drains significantly more battery.",
  },
  {
    rule: "GCI513",
    pattern: /\bstartUpdatingLocation\b/,
    severity: "warning",
    message: "Leakage: Location Leak — continuous location updates enabled.",
    suggestion:
      "Use requestLocation() for one-shot location or startMonitoringSignificantLocationChanges(). Stop updates when no longer needed to prevent location leaks.",
  },
  {
    rule: "GCI534",
    pattern: /startAccelerometerUpdates|startGyroUpdates|startDeviceMotionUpdates/,
    severity: "warning",
    message: "Sobriety: Motion Sensor Update Rate — continuous sensor updates enabled.",
    suggestion:
      "Stop sensor updates when not needed and use the lowest acceptable update frequency to save energy.",
  },
  {
    rule: "GCI603",
    pattern: /UIView\.animate|UIViewPropertyAnimator/,
    severity: "info",
    message: "Sobriety: Animation Free — UI animation detected.",
    suggestion:
      "Respect UIAccessibility.isReduceMotionEnabled and minimize animations. Animations consume GPU energy, especially when repeated or long-running.",
  },
  {
    rule: "GCI522",
    pattern: /screenBrightness\s*=|UIScreen\.main\.brightness/,
    severity: "warning",
    message: "Sobriety: Brightness Override — manual screen brightness change detected.",
    suggestion:
      "Avoid overriding screen brightness. Let the system manage brightness via auto-brightness to save energy.",
  },
];

const KOTLIN_RULES: RuleDefinition[] = [
  {
    rule: "GCI508",
    pattern: /newWakeLock|PARTIAL_WAKE_LOCK|FULL_WAKE_LOCK/,
    severity: "warning",
    message: "Idleness: Durable Wake Lock — WakeLock usage detected.",
    suggestion:
      "Ensure release() is called in a finally block and use timeout variants. WakeLocks prevent CPU sleep and drain battery rapidly.",
  },
  {
    rule: "GCI517",
    pattern: /PRIORITY_HIGH_ACCURACY/,
    severity: "warning",
    message: "Optimized API: Fused Location — high-accuracy location priority requested.",
    suggestion:
      "Use PRIORITY_BALANCED_POWER_ACCURACY or PRIORITY_LOW_POWER when precise GPS is not required. Consider FusedLocationProviderClient.",
  },
  {
    rule: "GCI509",
    pattern: /\bsetRepeating\s*\(/,
    severity: "warning",
    message: "Idleness: Rigid Alarm — exact repeating alarm detected.",
    suggestion:
      "Use setInexactRepeating() or WorkManager for periodic work. Exact alarms prevent Doze mode and drain battery.",
  },
  {
    rule: "GCI521",
    pattern: /SENSOR_DELAY_FASTEST|SENSOR_DELAY_GAME/,
    severity: "info",
    message: "Sobriety: Thrifty Motion Sensor — high-frequency sensor polling detected.",
    suggestion:
      "Use SENSOR_DELAY_NORMAL or SENSOR_DELAY_UI unless high frequency is required. Faster polling consumes more energy.",
  },
  {
    rule: "GCI505",
    pattern: /FLAG_KEEP_SCREEN_ON|addFlags.*KEEP_SCREEN_ON|setKeepScreenOn/,
    severity: "warning",
    message: "Idleness: Keep Screen On — screen kept awake programmatically.",
    suggestion:
      "Remove FLAG_KEEP_SCREEN_ON when no longer needed. Keeping the screen on is one of the highest battery drains.",
  },
];

const JAVA_RULES: RuleDefinition[] = KOTLIN_RULES;

const RULES_BY_LANGUAGE: Record<string, RuleDefinition[]> = {
  javascript: JAVASCRIPT_RULES,
  php: PHP_RULES,
  python: PYTHON_RULES,
  swift: SWIFT_RULES,
  kotlin: KOTLIN_RULES,
  java: JAVA_RULES,
};

/**
 * Detect the language of a file from its extension.
 */
function detectLanguage(filePath: string): string | null {
  const dotIndex = filePath.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const ext = filePath.slice(dotIndex).toLowerCase();
  return EXTENSION_MAP[ext] ?? null;
}

/**
 * Check a source file against Creedengo-style green coding rules.
 *
 * Reads the file, detects (or uses the provided) language, and applies
 * regex-based rule checks line by line.
 */
export async function checkCreedengo(
  filePath: string,
  language?: string
): Promise<CreedengoResult> {
  if (!filePath || typeof filePath !== "string") {
    throw new Error("A valid file path is required.");
  }

  const detectedLanguage = language ?? detectLanguage(filePath);
  if (!detectedLanguage) {
    throw new Error(
      `Could not detect language for "${filePath}". Provide a language override.`
    );
  }

  const lang = detectedLanguage.toLowerCase();
  const rules = RULES_BY_LANGUAGE[lang];
  if (!rules) {
    return {
      filePath,
      language: lang,
      issuesFound: 0,
      issues: [],
    };
  }

  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(
      `Could not read file at "${filePath}": ${message}`
    );
  }

  const lines = content.split("\n");
  const issues: CreedengoIssue[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        issues.push({
          line: i + 1,
          rule: rule.rule,
          severity: rule.severity,
          message: rule.message,
          suggestion: rule.suggestion,
        });
      }
    }
  }

  return {
    filePath,
    language: lang,
    issuesFound: issues.length,
    issues,
  };
}
