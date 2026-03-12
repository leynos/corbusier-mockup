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

interface LintDirectives {
  readonly disabledLines: Set<number>;
  readonly fileLevelDisabled: boolean;
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

function hasI18nIgnoreAttribute(element: ts.JsxOpeningLikeElement): boolean {
  return element.attributes.properties.some((attribute) => {
    if (!ts.isJsxAttribute(attribute)) {
      return false;
    }

    return attribute.name.getText() === "data-i18n-ignore";
  });
}

function isIgnoredJsxElement(node: ts.Node): boolean {
  if (ts.isJsxElement(node)) {
    const tagName = node.openingElement.tagName.getText();
    return tagName === "code" || tagName === "pre" || hasI18nIgnoreAttribute(node.openingElement);
  }

  if (ts.isJsxSelfClosingElement(node)) {
    const tagName = node.tagName.getText();
    return tagName === "code" || tagName === "pre" || hasI18nIgnoreAttribute(node);
  }

  return false;
}

function collectLintDirectives(sourceText: string, source: ts.SourceFile): LintDirectives {
  const disabledLines = new Set<number>();
  let fileLevelDisabled = false;
  const seenRanges = new Set<string>();
  const disablePattern = /semantic-lint:disable\s+hardcoded-strings(?:\s+(\w+))?/u;

  const markRange = (range: ts.CommentRange): void => {
    const key = `${range.pos}:${range.end}`;
    if (seenRanges.has(key)) {
      return;
    }
    seenRanges.add(key);

    const raw = sourceText.slice(range.pos, range.end);
    const match = disablePattern.exec(raw);
    if (!match) {
      return;
    }

    const line = source.getLineAndCharacterOfPosition(range.pos).line + 1;
    const scope = match[1];

    if (scope === "file") {
      fileLevelDisabled = true;
      return;
    }

    disabledLines.add(line + 1);
  };

  const scanRanges = (ranges: readonly ts.CommentRange[] | undefined): void => {
    if (!ranges) {
      return;
    }

    for (const range of ranges) {
      markRange(range);
    }
  };

  const visit = (node: ts.Node): void => {
    scanRanges(ts.getLeadingCommentRanges(sourceText, node.pos));
    scanRanges(ts.getTrailingCommentRanges(sourceText, node.end));
    ts.forEachChild(node, visit);
  };

  scanRanges(ts.getLeadingCommentRanges(sourceText, 0));
  visit(source);

  return { disabledLines, fileLevelDisabled };
}

function shouldSkipNode(node: ts.Node, source: ts.SourceFile, directives: LintDirectives): boolean {
  if (directives.fileLevelDisabled) {
    return true;
  }

  const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  return directives.disabledLines.has(line);
}

export function analyseFile(
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
  const directives = collectLintDirectives(sourceText, source);

  const visit = (node: ts.Node) => {
    if (isIgnoredJsxElement(node)) {
      return;
    }

    // 1. JsxText — raw text between JSX tags
    if (ts.isJsxText(node) && wordRegex.test(node.text)) {
      if (!isInsideTCall(node) && !shouldSkipNode(node, source, directives)) {
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
        if (
          wordRegex.test(text) &&
          !isInsideTCall(node) &&
          !shouldSkipNode(node, source, directives)
        ) {
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

if (import.meta.main) {
  main();
}
