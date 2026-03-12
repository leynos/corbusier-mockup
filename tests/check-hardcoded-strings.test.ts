/** @file Tests for hard-coded string lint escape hatches and ignored regions. */

import { afterEach, describe, expect, it } from "bun:test";

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { analyseFile } from "../scripts/check-hardcoded-strings";

const attrSet = new Set(["aria-label", "title"]);
const wordRegex = /[a-zA-Z]{2,}/u;
const tempDirs: string[] = [];

function analyseFixture(sourceText: string) {
  const dir = mkdtempSync(join(tmpdir(), "hardcoded-strings-"));
  tempDirs.push(dir);

  const filePath = join(dir, "fixture.tsx");
  writeFileSync(filePath, sourceText, "utf8");

  const results: {
    file: string;
    line: number;
    column: number;
    text: string;
    kind: "jsx-text" | "attribute";
  }[] = [];
  analyseFile(filePath, wordRegex, attrSet, results);
  return results;
}

describe("check-hardcoded-strings", () => {
  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        rmSync(dir, { force: true, recursive: true });
      }
    }
  });

  it("ignores code and pre blocks", () => {
    const results = analyseFixture(`
      export function Demo() {
        return (
          <div>
            <code>git commit -m "hello world"</code>
            <pre>curl https://example.test</pre>
          </div>
        );
      }
    `);

    expect(results).toHaveLength(0);
  });

  it("ignores regions marked with data-i18n-ignore", () => {
    const results = analyseFixture(`
      export function Demo() {
        return (
          <section data-i18n-ignore>
            <p>Hello world</p>
            <button aria-label="Toggle feature">x</button>
          </section>
        );
      }
    `);

    expect(results).toHaveLength(0);
  });

  it("supports next-line disable comments", () => {
    const results = analyseFixture(`
      export function Demo() {
        // semantic-lint:disable hardcoded-strings
        const ignored = <p>Hello world</p>;
        const flagged = <p>Review me</p>;

        return (
          <div>
            {ignored}
            {flagged}
          </div>
        );
      }
    `);

    expect(results).toHaveLength(1);
    expect(results[0]?.text).toContain("Review me");
  });

  it("supports file-level disable comments", () => {
    const results = analyseFixture(`
      // semantic-lint:disable hardcoded-strings file
      export function Demo() {
        return <p>Hello world</p>;
      }
    `);

    expect(results).toHaveLength(0);
  });
});
