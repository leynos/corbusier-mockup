/** @file Regression tests for locale-aware date formatting helpers. */

import { describe, expect, it } from "bun:test";

const textDecoder = new TextDecoder();
const formatterModulePath = new URL("../src/app/utils/date-formatting.ts", import.meta.url)
  .pathname;

function runFormatShortDateInTimezone(timeZone: string, iso: string): string {
  const result = Bun.spawnSync({
    cmd: [
      "bun",
      "--eval",
      `
        const modulePath = process.env.FORMATTER_MODULE_PATH;
        if (!modulePath) {
          throw new Error("FORMATTER_MODULE_PATH is required");
        }

        const { formatShortDate } = await import(modulePath);
        console.log(formatShortDate(process.env.ISO_UNDER_TEST, "en-GB"));
      `,
    ],
    env: {
      ...process.env,
      FORMATTER_MODULE_PATH: formatterModulePath,
      ISO_UNDER_TEST: iso,
      TZ: timeZone,
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = textDecoder.decode(result.stdout).trim();
  const stderr = textDecoder.decode(result.stderr).trim();

  expect(result.exitCode).toBe(0);
  expect(stderr).toBe("");

  return stdout;
}

describe("formatShortDate", () => {
  it("treats YYYY-MM-DD inputs as local calendar dates", () => {
    expect(runFormatShortDateInTimezone("America/Los_Angeles", "2026-03-15")).toBe("15 Mar 2026");
  });

  it("preserves timestamp inputs that already carry a time component", () => {
    expect(runFormatShortDateInTimezone("America/Los_Angeles", "2026-03-15T09:14:00Z")).toBe(
      "15 Mar 2026",
    );
  });
});
