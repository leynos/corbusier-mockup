/** @file Lint script that detects hard-coded alphabetic strings in JSX
 * that should be wrapped in `t()` calls for localisation. Follows the
 * same pattern as `check-classlist-length.ts` — TypeScript AST parsing,
 * `Bun.Glob` for file discovery, config from semantic-lint.config.json,
 * and `file:line:col` error output.
 */

import { readFileSync } from "node:fs";
import { relative } from "node:path";

import ts from "typescript";

interface HardcodedStringsConfig {
  minWordLength: number;
  userFacingAttributes: string[];
}

interface SemanticConfig {
  hardcodedStrings?: Partial<HardcodedStringsConfig>;
}

interface Violation {
  file: string;
  line: number;
  column: number;
  text: string;
  kind: "jsx-text" | "attribute";
}

const CONFIG_PATH = "tools/semantic-lint.config.json";
const PROJECT_ROOT = process.cwd();

const DEFAULTS: HardcodedStringsConfig = {
  minWordLength: 2,
  userFacingAttributes: [
    "aria-label",
    "aria-description",
    "aria-placeholder",
    "placeholder",
    "title",
    "alt",
  ],
};

function loadConfig(): HardcodedStringsConfig {
  const raw = readFileSync(CONFIG_PATH, "utf8");
  const config = JSON.parse(raw) as SemanticConfig;
  const section = config.hardcodedStrings;
  return {
    minWordLength:
      typeof section?.minWordLength === "number" && section.minWordLength > 0
        ? Math.floor(section.minWordLength)
        : DEFAULTS.minWordLength,
    userFacingAttributes:
      Array.isArray(section?.userFacingAttributes) && section.userFacingAttributes.length > 0
        ? section.userFacingAttributes
        : DEFAULTS.userFacingAttributes,
  };
}

function getTsxFiles(): string[] {
  const glob = new Bun.Glob("src/app/**/*.tsx");
  return Array.from(glob.scanSync(PROJECT_ROOT));
}

function buildWordRegex(minLength: number): RegExp {
  return new RegExp(`[a-zA-Z]{${minLength},}`, "u");
}

/** Return true when the node sits inside a `t(…)` call expression. */
function isInsideTCall(node: ts.Node): boolean {
  let cursor = node.parent;
  while (cursor) {
    if (
      ts.isCallExpression(cursor) &&
      ts.isIdentifier(cursor.expression) &&
      cursor.expression.text === "t"
    ) {
      return true;
    }
    cursor = cursor.parent;
  }
  return false;
}

function analyseFile(
  filePath: string,
  wordRegex: RegExp,
  attrSet: Set<string>,
  results: Violation[],
): void {
  const sourceText = readFileSync(filePath, "utf8");
  const source = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const visit = (node: ts.Node) => {
    // 1. JsxText — raw text between JSX tags
    if (ts.isJsxText(node) && wordRegex.test(node.text)) {
      if (!isInsideTCall(node)) {
        const { line, character } = source.getLineAndCharacterOfPosition(node.getStart());
        results.push({
          file: filePath,
          line: line + 1,
          column: character + 1,
          text: node.text.trim().slice(0, 40),
          kind: "jsx-text",
        });
      }
    }

    // 2. JsxAttribute with a string literal in a user-facing attribute
    if (ts.isJsxAttribute(node) && node.initializer) {
      const attrName = ts.isIdentifier(node.name) ? node.name.text : node.name.getText();
      if (attrSet.has(attrName) && ts.isStringLiteral(node.initializer)) {
        const text = node.initializer.text;
        if (wordRegex.test(text) && !isInsideTCall(node)) {
          const { line, character } = source.getLineAndCharacterOfPosition(node.getStart());
          results.push({
            file: filePath,
            line: line + 1,
            column: character + 1,
            text: text.slice(0, 40),
            kind: "attribute",
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
}

function main(): void {
  const config = loadConfig();
  const wordRegex = buildWordRegex(config.minWordLength);
  const attrSet = new Set(config.userFacingAttributes);
  const violations: Violation[] = [];

  for (const file of getTsxFiles()) {
    analyseFile(file, wordRegex, attrSet, violations);
  }

  for (const v of violations) {
    const displayPath = relative(PROJECT_ROOT, v.file);
    const label =
      v.kind === "jsx-text"
        ? "hard-coded JSX text"
        : `hard-coded "${v.text}" in user-facing attribute`;
    console.error(`${displayPath}:${v.line}:${v.column} ${label}`);
  }

  if (violations.length > 0) {
    console.error(
      `\n${violations.length} hard-coded string${violations.length > 1 ? "s" : ""} found. Wrap in t() for localisation.`,
    );
    process.exitCode = 1;
  }
}

main();
