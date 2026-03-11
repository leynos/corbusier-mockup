import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import {
  DEFAULT_LOCALE,
  getLocaleDirection,
  getLocaleMetadata,
  isRtlLocale,
  SUPPORTED_LOCALES,
} from "../src/app/i18n/supported-locales";

describe("supported locale metadata", () => {
  it("matches the shipped Fluent bundle directories", async () => {
    const localesDir = resolve(process.cwd(), "public/locales");
    const entries = await readdir(localesDir, { withFileTypes: true });
    const shippedCodes = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const configuredCodes = [...SUPPORTED_LOCALES].map((locale) => locale.code).sort();

    expect(configuredCodes).toEqual(shippedCodes);
  });

  it("exposes a default locale present in the supported list", () => {
    expect(DEFAULT_LOCALE).toBe(SUPPORTED_LOCALES[0].code);
  });

  it("returns the default locale metadata when no code is provided", () => {
    const metadata = getLocaleMetadata(undefined);

    expect(metadata.code).toBe(DEFAULT_LOCALE);
    expect(metadata.label).toBe(SUPPORTED_LOCALES[0].label);
  });

  it("matches locales in a case-insensitive manner", () => {
    expect(getLocaleMetadata("EN-gb").code).toBe("en-GB");
  });

  it("falls back to language-only matches when the region is unsupported", () => {
    expect(getLocaleMetadata("en-AU").code).toBe("en-GB");
  });

  it("returns the default locale when no match can be made", () => {
    expect(getLocaleMetadata("xx").code).toBe(DEFAULT_LOCALE);
  });

  it("does not expose duplicate locale codes", () => {
    const codes = SUPPORTED_LOCALES.map((locale) => locale.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("locale direction helpers", () => {
  it("keeps the shipped locale in left-to-right mode", () => {
    expect(getLocaleDirection("en-GB")).toBe("ltr");
    expect(isRtlLocale("en-GB")).toBe(false);
  });

  it("defaults to ltr when a locale is undefined or unsupported", () => {
    expect(getLocaleDirection(undefined)).toBe("ltr");
    expect(isRtlLocale("xx")).toBe(false);
  });
});
