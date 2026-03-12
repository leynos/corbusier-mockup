/** @file Unit tests for pickLocalization fallback chain. */

import { describe, expect, it } from "bun:test";

import type { EntityLocalizations } from "../src/app/domain/entities/localization";
import { pickLocalization } from "../src/app/domain/entities/localization";

describe("pickLocalization", () => {
  const full: EntityLocalizations = {
    "en-GB": { name: "English name", description: "English desc" },
    de: { name: "Deutscher Name", description: "Deutsche Beschr." },
    ja: { name: "日本語名", description: "日本語の説明" },
  };

  it("returns the exact locale match", () => {
    const result = pickLocalization(full, "de");
    expect(result.name).toBe("Deutscher Name");
    expect(result.description).toBe("Deutsche Beschr.");
  });

  it("falls back to en-GB when exact match is missing", () => {
    const result = pickLocalization(full, "es");
    expect(result.name).toBe("English name");
  });

  it("falls back to first available key when en-GB is missing", () => {
    const noEnGb: EntityLocalizations = {
      ar: { name: "اسم عربي" },
      de: { name: "Deutscher Name" },
    };
    const result = pickLocalization(noEnGb, "ja");
    // First key in insertion order
    expect(result.name).toBe("اسم عربي");
  });

  it("returns empty name for undefined input", () => {
    const result = pickLocalization(undefined, "en-GB");
    expect(result.name).toBe("");
  });

  it("returns empty name for empty map", () => {
    const result = pickLocalization({}, "en-GB");
    expect(result.name).toBe("");
  });

  it("preserves optional fields when present", () => {
    const withShort: EntityLocalizations = {
      "en-GB": { name: "Name", shortLabel: "N" },
    };
    const result = pickLocalization(withShort, "en-GB");
    expect(result.shortLabel).toBe("N");
    expect(result.description).toBeUndefined();
  });
});
