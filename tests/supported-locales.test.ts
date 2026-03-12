import { describe, expect, it } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  DEFAULT_LOCALE,
  DETECTION_ORDER,
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
    expect(getLocaleMetadata("ZH-cn").code).toBe("zh-CN");
  });

  it("falls back to language-only matches when the region is unsupported", () => {
    expect(getLocaleMetadata("en-AU").code).toBe("en-GB");
    expect(getLocaleMetadata("ar-SA").code).toBe("ar");
  });

  it("returns the default locale when no match can be made", () => {
    expect(getLocaleMetadata("xx").code).toBe(DEFAULT_LOCALE);
  });

  it("does not expose duplicate locale codes", () => {
    const codes = SUPPORTED_LOCALES.map((locale) => locale.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("prefers explicit locale picks before falling back to the browser locale", () => {
    expect([...DETECTION_ORDER]).toEqual(["querystring", "localStorage", "navigator"]);
  });

  it("ships the same translation keys in every common Fluent bundle", async () => {
    const localesDir = resolve(process.cwd(), "public/locales");
    const readKeys = async (code: string): Promise<string[]> => {
      const contents = await readFile(resolve(localesDir, code, "common.ftl"), "utf8");
      return contents
        .split("\n")
        .map((line) => line.match(/^([a-z0-9-]+)\s*=/u)?.[1] ?? null)
        .filter((key): key is string => key !== null)
        .sort();
    };

    const expectedKeys = await readKeys(DEFAULT_LOCALE);

    for (const locale of SUPPORTED_LOCALES) {
      expect(await readKeys(locale.code)).toEqual(expectedKeys);
    }
  });
});

describe("locale direction helpers", () => {
  it("keeps the shipped locale in left-to-right mode", () => {
    expect(getLocaleDirection("en-GB")).toBe("ltr");
    expect(isRtlLocale("en-GB")).toBe(false);
  });

  it("marks Arabic locales as right-to-left", () => {
    expect(getLocaleDirection("ar")).toBe("rtl");
    expect(getLocaleDirection("ar-SA")).toBe("rtl");
    expect(isRtlLocale("ar")).toBe(true);
  });

  it("defaults to ltr when a locale is undefined or unsupported", () => {
    expect(getLocaleDirection(undefined)).toBe("ltr");
    expect(isRtlLocale("xx")).toBe(false);
  });
});
