/** @file Guards the stylesheet pipeline used by Vite during development. */

import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import postcss, { type AcceptedPlugin } from "postcss";

const require = createRequire(import.meta.url);
const postcssConfig = require("../postcss.config.cjs") as {
  plugins: AcceptedPlugin[];
};

describe("src/index.css PostCSS compilation", () => {
  it("compiles Tailwind directives into browser-ready CSS", async () => {
    const source = await readFile(new URL("../src/index.css", import.meta.url), "utf8");
    const result = await postcss(postcssConfig.plugins).process(source, {
      from: new URL("../src/index.css", import.meta.url).pathname,
    });

    expect(result.css.includes("@tailwind utilities")).toBeFalse();
    expect(result.css.includes("@apply ")).toBeFalse();
    expect(result.css.includes(".text-4xl")).toBeTrue();
    expect(result.css.includes(".w-60")).toBeTrue();
  });
});
