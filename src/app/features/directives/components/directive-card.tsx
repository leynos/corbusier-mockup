/** @file Single directive card with chamfered container.
 *
 * Shows command name (monospace), description, parameter list, and
 * an expandable "Example expansion" section with sample input and
 * resulting expansion in a code block.
 *
 * The chamfer marks this as a machine-readable surface per the
 * design language.
 */

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { JSX } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Directive } from "../../../../data/directives";
import { ChamferCard } from "../../../components/chamfer-card";
import { pickLocalization } from "../../../domain/entities/localization";

interface DirectiveCardProps {
  readonly directive: Directive;
  readonly locale: string;
}

export function DirectiveCard({ directive, locale }: DirectiveCardProps): JSX.Element {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const loc = pickLocalization(directive.localizations, locale);

  return (
    <li>
      <ChamferCard size="md" fillClassName="fill-base-100" strokeClassName="stroke-base-300">
        <div className="p-4">
          {/* Command name */}
          <h2 className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-lg)] font-bold text-primary">
            {loc.name}
          </h2>

          {/* Description */}
          {loc.description ? (
            <p className="mt-1 text-[length:var(--font-size-sm)] text-base-content/70">
              {loc.description}
            </p>
          ) : null}

          {/* Parameters */}
          {directive.parameters.length > 0 ? (
            <div className="mt-3">
              <h3 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
                {t("directive-parameters", { defaultValue: "Parameters" })}
              </h3>
              <dl className="mt-1 space-y-1">
                {directive.parameters.map((param) => (
                  <div key={param.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <dt className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
                      --{param.name}
                    </dt>
                    <dd className="text-[length:var(--font-size-xs)] text-base-content/60">
                      <span className="font-[family-name:var(--font-mono)]">{param.type}</span>
                      {param.required ? (
                        <span className="ms-1 font-semibold text-warning">
                          {t("directive-required", { defaultValue: "required" })}
                        </span>
                      ) : null}
                      {" — "}
                      {param.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {/* Template */}
          <div className="mt-3">
            <h3 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
              {t("directive-template", { defaultValue: "Template" })}
            </h3>
            <pre className="mt-1 whitespace-pre-wrap break-words rounded bg-base-300/40 p-2 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content">
              <code>{directive.template}</code>
            </pre>
          </div>

          {/* Expand toggle for examples */}
          {directive.exampleExpansions.length > 0 ? (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold text-primary hover:text-primary/80"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-controls={`examples-${directive.id}`}
            >
              {expanded ? (
                <IconChevronUp size={14} aria-hidden="true" />
              ) : (
                <IconChevronDown size={14} aria-hidden="true" />
              )}
              {expanded
                ? t("directive-hide-examples", { defaultValue: "Hide examples" })
                : t("directive-show-examples", { defaultValue: "Show examples" })}
            </button>
          ) : null}
        </div>

        {/* Expandable example expansions */}
        {expanded && directive.exampleExpansions.length > 0 ? (
          <div
            id={`examples-${directive.id}`}
            className="border-t border-base-300 bg-base-300/30 p-4"
          >
            <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
              {t("directive-example-heading", {
                defaultValue: "Example expansions",
              })}
            </h3>
            <div className="space-y-2">
              {directive.exampleExpansions.map((example, i) => (
                <pre
                  key={`${directive.id}-ex-${String(i)}`}
                  className="whitespace-pre-wrap break-words rounded bg-base-300/40 p-2 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content"
                >
                  <code>{example}</code>
                </pre>
              ))}
            </div>
          </div>
        ) : null}
      </ChamferCard>
    </li>
  );
}
