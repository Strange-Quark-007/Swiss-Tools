export type RegexFlagKey = 'global' | 'caseInsensitive' | 'multiline' | 'dotAll' | 'unicode' | 'sticky';

export interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface MatchGroup {
  name?: string;
  index: number;
  value: string;
}

export interface MatchResult {
  match: string;
  index: number;
  end: number;
  groups: MatchGroup[];
}

export interface RegexExecutionResult {
  isValid: boolean;
  error?: string;
  matches: MatchResult[];
  isCapped?: boolean;
  replacedText?: string;
  replacementSegments?: ReplacementSegment[];
}

export interface ReplacementSegment {
  text: string;
  isReplacement: boolean;
  matchIndex?: number;
}

export interface TextSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export interface RegexPreset {
  id: string;
  label: string;
  group?: string;
  pattern: string;
  flags: RegexFlags;
  sampleText: string;
}

export const DEFAULT_FLAGS: RegexFlags = {
  global: true,
  caseInsensitive: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false,
};

export interface RegexFlagConfig {
  key: keyof RegexFlags;
  char: string;
  label: string;
}

export const REGEX_FLAGS: readonly RegexFlagConfig[] = [
  { key: 'global', char: 'g', label: 'Global' },
  { key: 'caseInsensitive', char: 'i', label: 'Case-insensitive' },
  { key: 'multiline', char: 'm', label: 'Multiline' },
  { key: 'dotAll', char: 's', label: 'Dot matches newline' },
  { key: 'unicode', char: 'u', label: 'Unicode' },
  { key: 'sticky', char: 'y', label: 'Sticky' },
] as const;

export const REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'email',
    label: 'Email Address',
    group: 'Web & Network',
    pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b',
    flags: { global: true, caseInsensitive: true, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Customer Directory & Inquiries:
- Primary contact: alice.smith@example.com (verified)
- Sales representative: bob_jones99@company.co.uk
- Technical support: support-desk@tech-corp.io
- Billing department: billing.invoices@finance.org
- Career applications: hr-jobs@startup.dev
- Press & media: media_team@news-outlet.net
- Feedback inbox: feedback+user101@platform.com
- Executive office: contact.ceo@enterprise.global

Unmatched entries and invalid addresses (for verification):
- Missing domain: alice@
- Missing username: @company.com
- Missing @ symbol: plainaddress.com
- Missing TLD: user@localhost
- Multiple @ symbols: test@@example.com`,
  },
  {
    id: 'url',
    label: 'URL (HTTP/HTTPS)',
    group: 'Web & Network',
    pattern:
      'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: { global: true, caseInsensitive: true, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Curated Web Resources & Documentation:
1. Official Portal: https://example.com/overview
2. Documentation: https://docs.example.com/v2/getting-started?lang=en&theme=dark#quickstart
3. API Endpoint: https://api.service.io/v1/health
4. Repository: https://github.com/facebook/react/issues/12345
5. Blog Post: http://blog.techplatform.org/2026/modern-web-development
6. Demo App: https://staging.cloud-app.net:8080/dashboard
7. Search Engine: https://www.google.com/search?q=regular+expressions
8. CDN Asset: https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js

Non-matching protocols and links:
- Protocolless domains: google.com, localhost:3000, mysite.internal
- Unsupported schemes: ftp://files.archive.org/dump.zip, file:///C:/Users/Documents/notes.txt
- Incomplete scheme: https://
- Relative paths: /v2/getting-started, ../assets/logo.png`,
  },
  {
    id: 'ipv4',
    label: 'IPv4 Address',
    group: 'Web & Network',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Network Topology and Diagnostics Log:
- Localhost loopback: 127.0.0.1
- Router default gateway: 192.168.1.1
- Secondary subnet router: 192.168.0.254
- Primary corporate DNS: 8.8.8.8
- Secondary fallback DNS: 1.1.1.1
- Private intranet cluster 1: 10.0.0.15
- Private intranet cluster 2: 10.240.12.99
- Public web server node: 172.217.16.206

Invalid entries and excluded numbers:
- Out of range octets: 999.1.1.1, 256.100.0.1, 192.168.300.5
- Incomplete segments: 192.168.1, 10.0..1, 172.16.0.
- IPv6 addresses: 2001:0db8:85a3:0000:0000:8a2e:0370:7334, ::1`,
  },
  {
    id: 'number',
    label: 'Number',
    group: 'Numbers & Math',
    pattern: '(?<![\\w.])[+-]?\\d+(?:\\.\\d+)?(?![\\w.])',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Numbers & Metrics Snapshot:
- Integer count: 42
- Negative offset: -17
- Positive delta: +8
- Decimal average: 3.14159
- Temperature reading: -12.5
- Percentage change: 0.75

Non-matching text and identifiers:
- Version tag: v2.1.0 (chained dots excluded)
- Identifier: item42 (attached letters excluded)
- Measurement label: value99 (attached letters excluded)`,
  },
  {
    id: 'decimal-number',
    label: 'Decimal Number',
    group: 'Numbers & Math',
    pattern: '(?<!\\d\\.)\\b\\d+\\.\\d+(?!\\.\\d)\\b',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Scientific Measurements & Financial Telemetry:
- Math constants: pi = 3.14159, e = 2.71828, phi = 1.61803
- GPS Coordinates: latitude 37.7749, longitude -122.4194
- Sensor readings: temperature 23.6, humidity 45.8, pressure 1013.25
- Financial quotes: stock price $142.75, change +4.35, market cap 18.5

Non-matching numbers and structures:
- Whole integers: 42, 100, 2026, count = 0
- Version numbers (chained dots): v2.1.0, 18.12.1, 3.0.0-beta
- Trailing or leading dots: 10., .5`,
  },
  {
    id: 'phone',
    label: 'Phone Number',
    group: 'General & Text',
    pattern:
      '(?<!\\w)(?:(\\+\\d{1,3})[-. ]?\\(?(\\d{1,5})\\)?|\\(?(\\d{2,5})\\)?)[-. ](\\d{3,5})(?:[-. ]?(\\d{3,5}))?(?!\\w)',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Regional Offices Contact Directory:
- North America HQ: (555) 123-4567
- US Toll-Free Support: +1-800-555-0199
- San Francisco Office: 415-555-2671
- UK Operations Branch: +44 20 7946 0958
- India Technology Hub: +91 98765 43210
- Tokyo Regional Support: +81 3 5555 0143
- Australia Field Desk: +61 2 9876 5432
- Emergency Hotline: +1 (888) 456-7890

Non-matching extensions and numeric IDs:
- Office extensions & desk codes: Ext 1234, desk 99, postal code 94105
- Serial & badge numbers: Badge #8841928472910, serial 123456789012
- Plain text: General inquiries or internal directory assistance.

Note: international numbers with country codes support 1-5 digit area codes (e.g. Tokyo +81 3, Sydney +61 2); domestic numbers without a country code require 2-5 digit area codes to avoid matching plain digit ranges.`,
  },
  {
    id: 'hashtag',
    label: 'Hashtag',
    group: 'General & Text',
    pattern: '#[a-zA-Z_][\\w-]*',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Developer Conference Social Feed:
Trending topics: #technology #programming #webdev #frontend #opensource #cloud #devops
With numbers after letter start: #web3, #coding2026, #v2release

Non-matching content:
- Pure numeric IDs: Issue #42, PR #108, item #5 (digit-first, excluded)
- Isolated hash symbols: # alone, ## heading, ### subhead

Note: letter-starting hex colors like #c0ffee or #ff5722 will match as hashtags because they start with a letter — use the Hex Color preset to isolate color codes.`,
  },
  {
    id: 'date-iso',
    label: 'Date (YYYY-MM-DD)',
    group: 'Date & Time',
    pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Project Roadmap & Sprint Calendar:
- Phase 1 Kickoff: 2024-01-15 (completed)
- Architecture Review: 2024-06-30 (completed)
- Year-End Cutoff: 2024-12-31 (audited)
- Q1 Planning Session: 2025-01-01 (scheduled)
- Mid-Year Feature Freeze: 2025-07-15 (pending)
- Final Release Candidate: 2026-10-16 (live)
- Bug Bash Event: 2026-11-20 (upcoming)
- Annual Retrospective: 2026-12-25 (tentative)

Non-matching and invalid dates:
- Invalid months/days: 2025-13-01, 2024-00-15, 2024-02-32, 2026-05-35
- Other date formats: 10/16/2026, 16-10-2026, 2026.10.16, Oct 16, 2026
- Incomplete or malformed dates: 2024-05, 2024/05/12, 12024-05-12

Note: regex cannot validate calendar accuracy — 2024-02-31 and 2024-04-31 match despite being invalid dates.`,
  },
  {
    id: 'time-24h',
    label: 'Time (24H)',
    group: 'Date & Time',
    pattern: '\\b(?:[01]\\d|2[0-3]):[0-5]\\d\\b',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Global Train Schedule & Operations Log:
- First morning express: 05:45
- Rush hour commuter: 08:30
- Mid-morning intercity: 10:15
- Noon service: 12:00
- Afternoon connection: 14:20
- Evening commuter: 17:45
- Night owl regional: 21:10
- Final terminal arrival: 23:59
- Midnight turnaround: 00:00

Invalid times & non-matching text:
- Out of range hours: 24:00, 25:30, 99:15
- Out of range minutes: 12:60, 08:95, 14:77
- Single digit hour/minute: 8:30, 14:5, 9:5
- Aspect ratios and scores: ratio 16:9, final score 3:2, section 4:10

Note: 12-hour times like 08:30 AM and 11:45 PM will match the time portion (08:30, 11:45) — the regex sees valid 24h values and stops at the word boundary before the space.`,
  },
  {
    id: 'time-12h',
    label: 'Time (12H)',
    group: 'Date & Time',
    pattern: '\\b(?:0?[1-9]|1[0-2]):[0-5]\\d(?::[0-5]\\d)?\\s*[ap]m\\b',
    flags: { global: true, caseInsensitive: true, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Daily Schedule & Office Hours:
- Morning briefing: 08:30 AM
- Standup meeting: 9:15 am
- Lunch break: 12:00 PM
- Afternoon review: 02:45 pm
- Client check-in: 4:30 PM
- Evening wrap-up: 06:15 pm
- Shift handover: 11:59 PM
- Midnight start: 12:00 AM

Non-matching 24-hour times & invalid formats:
- 24-hour times without AM/PM: 14:30, 23:15, 08:00
- Invalid 12-hour numbers: 13:00 PM, 00:30 AM, 15:45 am
- Out of range minutes: 11:65 AM, 04:90 PM
- Numbers and scores: ratio 16:9, score 3:2`,
  },
  {
    id: 'datetime',
    label: 'Date & Time',
    group: 'Date & Time',
    pattern:
      '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])[T ](?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?(?:\\.\\d{1,3})?(?:Z|[+-](?:[01]\\d|2[0-3]):?[0-5]\\d)?\\b',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Server Event Logs & Audit Telemetry:
- Deployment timestamp: 2026-10-17T13:25:00Z
- Backup completed: 2026-10-17 04:30:15
- Auth token issued: 2026-05-12T08:15:30.500Z
- User signed in: 2026-08-20 09:45:00
- Incident alert: 2026-11-01T22:10:45+05:30
- Session expired: 2026-12-31T23:59:59-05:00

Non-matching dates without time or invalid formats:
- Date only: 2026-10-17, 2025-01-01
- Time only: 13:25:00, 08:30 AM
- Invalid months/hours: 2026-13-40T25:70:00Z
- Plain text: System uptime was 99.98% over past 30 days.`,
  },
  {
    id: 'html-tag',
    label: 'HTML Tag',
    group: 'Markup & Code',
    pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*\\/>|<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\2>',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: true, unicode: false, sticky: false },
    sampleText: `<!-- Paired tags -->
<h1 id="title">Sample Heading</h1>
<p class="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<span class="badge">v2.0</span>
<button type="button">Click Me</button>
<strong>Highlighted Text</strong>

<!-- Self-closing & void elements -->
<img src="/image.png" alt="Sample Preview" />
<input type="text" placeholder="Enter query..." />
<hr />

<!-- Non-matching text, unclosed tags, and mismatched pairs -->
<div>Mismatched tag</span>
<p>Unclosed paragraph element
Math comparison: count < 5 or threshold > 10`,
  },
  {
    id: 'hex-color',
    label: 'Hex Color Code',
    group: 'Markup & Code',
    pattern: '#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b',
    flags: { global: true, caseInsensitive: true, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Design Tokens & Theme Palette:
- Primary Brand: #3b82f6 (Bright Blue)
- Secondary Accent: #8b5cf6 (Purple)
- Success Indicator: #10b981 (Emerald Green)
- Warning State: #f59e0b (Amber)
- Danger Alert: #ef4444 (Crimson Red)
- Dark Surface: #0f172a (Slate 900)
- Card Background: #1e293b (Slate 800)
- Pure White: #fff
- Deep Black: #000
- Light Gray: #e2e8f0

Non-color hashes and invalid codes:
- Social hashtags: #reactjs, #design_system, #frontend
- Invalid hex lengths: #12, #1234, #12345, #1234567
- Invalid characters: #zzz, #gg00ff, #rgba
- CSS names & functions: blue, rgb(255, 0, 0), hsl(210, 50%, 50%)`,
  },
  {
    id: 'quoted-string',
    label: 'Quoted Strings',
    group: 'Markup & Code',
    pattern: '(["\'])(?:(?=(\\\\?))\\2.)*?\\1',
    flags: { global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Configuration File (TypeScript / JSON excerpt):
const appTitle = "Sample Application";
const appVersion = '2.5.0';
const environment = "production";
const authorName = 'Jane Doe';
const defaultLocale = "en-US";
const storageKey = 'user_preferences';
const greeting = "Hello, world! Welcome to the editor.";
const fallbackUrl = 'https://example.com';

Unquoted identifiers and numbers (non-matching):
const port = 3000;
const isEnabled = true;
const timeoutMs = 5000;
const emptyVal = null;
// Unquoted identifiers and keywords: return false, let total = 42;`,
  },
  {
    id: 'uuid',
    label: 'UUID / GUID',
    group: 'Markup & Code',
    pattern: '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b',
    flags: { global: true, caseInsensitive: true, multiline: false, dotAll: false, unicode: false, sticky: false },
    sampleText: `Distributed Tracing & Request Session Log:
- Session 1: c9bf9e57-1685-4c89-bafb-ff5af830be8a [active]
- Session 2: 7e2d4a10-8b3c-4e5f-9a0b-1c2d3e4f5a6b [authorized]
- Session 3: a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d [idle]
- Session 4: 550e8400-e29b-41d4-a716-446655440000 [system]
- Session 5: f47ac10b-58cc-4372-a567-0e02b2c3d479 [verified]
- Session 6: 6ba7b810-9dad-11d1-80b4-00c04fd430c8 [dns]
- Session 7: 6ba7b811-9dad-11d1-80b4-00c04fd430c8 [url]
- Session 8: 6ba7b812-9dad-11d1-80b4-00c04fd430c8 [oid]

Invalid UUIDs and other hash formats:
- Truncated UUIDs: c9bf9e57-1685-4c89-bafb, 1234-5678-9012
- Missing hyphens: c9bf9e5716854c89bafbff5af830be8a
- Git commit SHA: 9f7d3a2b1c4e6f8a0d2e4b6c8a0d2e4b6c8a0d2e
- Non-hex characters: g9bf9e57-1685-4c89-bafb-ff5af830be8a`,
  },
] as const;

export const DEFAULT_MAX_MATCHES = 5000;

/**
 * Builds a valid JavaScript RegExp flags string from flags object.
 */
export const buildFlagsString = (flags: RegexFlags): string => {
  let result = '';
  if (flags.global && !flags.sticky) result += 'g';
  if (flags.caseInsensitive) result += 'i';
  if (flags.multiline) result += 'm';
  if (flags.dotAll) result += 's';
  if (flags.unicode) result += 'u';
  if (flags.sticky) result += 'y';
  return result;
};

/**
 * Validates whether a pattern and flags string construct a valid RegExp.
 */
export const validateRegex = (pattern: string, flags: string): ValidationResult => {
  if (!pattern) {
    return { isValid: true };
  }
  try {
    new RegExp(pattern, flags);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid regular expression',
    };
  }
};

export interface RegExpIndicesData {
  indices?: {
    [key: number]: [number, number];
    groups?: Record<string, [number, number] | undefined>;
  };
}

export const extractMatchGroups = (match: RegExpExecArray): MatchGroup[] => {
  const namedGroups = Object.entries(match.groups ?? {});
  const usedKeys = new Set<string>();

  const indicesData = (match as RegExpIndicesData).indices;

  return Array.from(match, (value, index) => ({ value, index }))
    .slice(1)
    .filter((group) => group.value !== undefined)
    .map((group) => {
      let groupName: string | undefined;

      if (indicesData?.groups) {
        const [startIndex, endIndex] = indicesData[group.index];
        const matchEntry = Object.entries(indicesData.groups).find(
          ([key, range]) => range?.[0] === startIndex && range?.[1] === endIndex && !usedKeys.has(key)
        );
        if (matchEntry) {
          groupName = matchEntry[0];
          usedKeys.add(groupName);
        }
      } else {
        // Fallback for environments without RegExp indices (d flag); resolved by value equality and tracked via usedKeys
        const entry = namedGroups.find(([key, val]) => val === group.value && !usedKeys.has(key));
        if (entry) {
          groupName = entry[0];
          usedKeys.add(groupName);
        }
      }

      return {
        ...group,
        name: groupName,
      };
    });
};

/**
 * Executes regular expression against test text and returns matches and formatted text output.
 * A defined replacement enables replacement; an empty string removes matches.
 */
export const executeRegex = (
  pattern: string,
  flags: string,
  testText: string,
  maxMatches = DEFAULT_MAX_MATCHES,
  replacement?: string
): RegexExecutionResult => {
  if (!pattern || !testText) {
    const validation = validateRegex(pattern, flags);
    return {
      isValid: validation.isValid,
      error: validation.error,
      matches: [],
      replacedText: testText,
      replacementSegments: [],
    };
  }

  let regex: RegExp;
  try {
    const flagsWithIndices = flags.includes('d') ? flags : `${flags}d`;
    regex = new RegExp(pattern, flagsWithIndices);
  } catch {
    try {
      regex = new RegExp(pattern, flags);
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid regular expression',
        matches: [],
        replacedText: testText,
        replacementSegments: [],
      };
    }
  }

  const matches: MatchResult[] = [];
  const isGlobal = flags.includes('g');
  const isSticky = flags.includes('y');
  let isCapped = false;

  try {
    if (isGlobal || isSticky) {
      let match: RegExpExecArray | null;

      while ((match = regex.exec(testText)) !== null) {
        const matchText = match[0];

        if (matchText.length > 0) {
          const groups = extractMatchGroups(match);
          const startIndex = match.index;
          const endIndex = startIndex + matchText.length;

          matches.push({
            match: matchText,
            index: startIndex,
            end: endIndex,
            groups,
          });

          if (matches.length >= maxMatches) {
            isCapped = true;
            break;
          }
        }

        // Avoid infinite loop on zero-length match by advancing to the next code point
        if (matchText.length === 0) {
          const isUnicode = flags.includes('u');
          const codePoint = testText.codePointAt(match.index);
          const step = isUnicode && codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
          regex.lastIndex = match.index + step;
        }
      }
    } else {
      const match = regex.exec(testText);
      if (match && match[0].length > 0) {
        const groups = extractMatchGroups(match);

        matches.push({
          match: match[0],
          index: match.index,
          end: match.index + match[0].length,
          groups,
        });
      }
    }

    const hasReplacement = replacement !== undefined;
    const safeReplacement = replacement ?? '';
    const replaceRegex = hasReplacement ? new RegExp(pattern, flags) : undefined;
    const replacedText = replaceRegex ? testText.replace(replaceRegex, safeReplacement) : testText;
    const replacementSegments = hasReplacement
      ? (buildReplacementSegments(pattern, flags, testText, safeReplacement) ?? [])
      : [];

    return {
      isValid: true,
      matches,
      isCapped,
      replacedText,
      replacementSegments,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Execution error',
      matches: [],
      replacedText: testText,
      replacementSegments: [],
    };
  }
};

/**
 * Expands JavaScript replacement tokens for a single match.
 */
export const expandReplacement = (replacement: string, match: RegExpExecArray, testText: string): string => {
  const groupCount = match.length - 1;

  return replacement.replace(/\$(\$|&|`|'|\d{1,2}|<[^>]*>)/g, (token, pattern: string) => {
    if (pattern === '$') {
      return '$';
    }

    if (pattern === '&') {
      return match[0];
    }

    if (pattern === '`') {
      return testText.slice(0, match.index);
    }

    if (pattern === "'") {
      return testText.slice(match.index + match[0].length);
    }

    if (pattern.startsWith('<')) {
      if (!match.groups) {
        return token;
      }

      return match.groups[pattern.slice(1, -1)] ?? '';
    }

    const groupIndex = Number(pattern);
    if (groupIndex > 0 && groupIndex <= groupCount) {
      return match[groupIndex] ?? '';
    }

    if (pattern.length === 2) {
      const singleDigitIndex = Number(pattern[0]);
      if (singleDigitIndex > 0 && singleDigitIndex <= groupCount) {
        return `${match[singleDigitIndex] ?? ''}${pattern[1]}`;
      }
    }

    return token;
  });
};

const MAX_REPLACEMENT_SEGMENTS = 5000;

/**
 * Splits replaced output into plain and replacement segments so the UI can box changed text.
 * Returns undefined when the match count exceeds the preview limit.
 */
export const buildReplacementSegments = (
  pattern: string,
  flags: string,
  testText: string,
  replacement?: string
): ReplacementSegment[] | undefined => {
  if (!pattern || !testText || replacement === undefined) {
    return testText ? [{ text: testText, isReplacement: false }] : [];
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    return [{ text: testText, isReplacement: false }];
  }

  const segments: ReplacementSegment[] = [];
  let cursor = 0;
  let matchIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(testText)) !== null) {
    if (match.index > cursor) {
      segments.push({ text: testText.slice(cursor, match.index), isReplacement: false });
    }

    matchIndex += 1;
    segments.push({ text: expandReplacement(replacement, match, testText), isReplacement: true, matchIndex });

    if (segments.length > MAX_REPLACEMENT_SEGMENTS) {
      return undefined;
    }

    cursor = match.index + match[0].length;

    if (match[0].length === 0) {
      const isUnicode = flags.includes('u');
      const codePoint = testText.codePointAt(match.index);
      const step = isUnicode && codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
      regex.lastIndex = match.index + step;
    }

    // Native String.replace stops after the first match without the global flag, sticky included
    if (!flags.includes('g')) {
      break;
    }
  }

  if (cursor < testText.length) {
    segments.push({ text: testText.slice(cursor), isReplacement: false });
  }

  return segments;
};

/**
 * Returns true when a match consists exclusively of whitespace characters.
 */
export const isWhitespaceOnlyMatch = (match: string): boolean => match.length > 0 && /^\s+$/.test(match);

const WHITESPACE_LABELS: Record<string, string> = {
  ' ': '[space]',
  '\t': '[tab]',
  '\n': '[newline]',
  '\r': '[return]',
  '\f': '[form feed]',
  '\v': '[vertical tab]',
  '\u00a0': '[non-breaking space]',
};

/**
 * Renders whitespace and control characters as readable labels so blank-looking matches remain understandable.
 */
export const formatMatchForDisplay = (match: string): string =>
  Array.from(match, (char) => {
    if (WHITESPACE_LABELS[char]) {
      return WHITESPACE_LABELS[char];
    }

    const codePoint = char.codePointAt(0)!;
    if (/\s/.test(char)) {
      return '[whitespace]';
    }

    if (codePoint < 0x20 || codePoint === 0x7f) {
      return '[control]';
    }

    return char;
  }).join('');

/**
 * Splits test text into non-matching and matching segments for visual highlighting.
 */
export const highlightSegments = (testText: string, matches: MatchResult[]): TextSegment[] => {
  if (!testText) {
    return [];
  }

  if (!matches.length) {
    return [{ text: testText, isMatch: false }];
  }

  const segments: TextSegment[] = [];
  let currentIndex = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    if (match.index < currentIndex) {
      continue;
    }

    if (match.index > currentIndex) {
      segments.push({
        text: testText.slice(currentIndex, match.index),
        isMatch: false,
      });
    }

    if (match.match.length > 0) {
      segments.push({
        text: match.match,
        isMatch: true,
        matchIndex: i + 1,
      });
      currentIndex = match.end;
    } else {
      currentIndex = Math.max(currentIndex, match.end);
    }
  }

  if (currentIndex < testText.length) {
    segments.push({
      text: testText.slice(currentIndex),
      isMatch: false,
    });
  }

  return segments;
};
