/** @file Tests for Playwright container preflight URL parsing. */

import { describe, expect, it } from "bun:test";

const scriptPath = new URL("../scripts/e2e-container.sh", import.meta.url).pathname;
const textDecoder = new TextDecoder();

function parseBaseUrl(baseUrl: string): { host: string; port: string } {
  const result = Bun.spawnSync({
    cmd: [
      "bash",
      "-lc",
      'set -euo pipefail; source "$SCRIPT_PATH"; parse_base_url_endpoint "$BASE_URL_UNDER_TEST"',
    ],
    env: {
      ...process.env,
      SCRIPT_PATH: scriptPath,
      BASE_URL_UNDER_TEST: baseUrl,
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = textDecoder.decode(result.stdout).trim();
  const stderr = textDecoder.decode(result.stderr).trim();

  expect(result.exitCode).toBe(0);
  expect(stderr).toBe("");

  const parsed = stdout.split("\t");
  expect(parsed).toHaveLength(2);

  const host = parsed[0];
  const port = parsed[1];

  if (!host || !port) {
    throw new Error(`Expected host and port output, received: ${stdout}`);
  }

  return { host, port };
}

describe("e2e container preflight URL parsing", () => {
  it("uses standard ports when PLAYWRIGHT_BASE_URL omits them", () => {
    expect(parseBaseUrl("https://example.com")).toEqual({
      host: "example.com",
      port: "443",
    });
    expect(parseBaseUrl("http://example.com")).toEqual({
      host: "example.com",
      port: "80",
    });
  });

  it("preserves explicit ports and ignores paths", () => {
    expect(parseBaseUrl("http://localhost:4173/dashboard")).toEqual({
      host: "localhost",
      port: "4173",
    });
    expect(parseBaseUrl("https://example.com:8443/app")).toEqual({
      host: "example.com",
      port: "8443",
    });
  });
});
