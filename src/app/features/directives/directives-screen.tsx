/** @file Directives registry screen.
 *
 * Shows a list of registered slash command definitions, each
 * rendered as a chamfered card (machine-readable surface) with
 * command name, description, parameters, and expandable example
 * expansion previews.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { DIRECTIVES } from "../../../data/directives";
import { DirectiveCard } from "./components/directive-card";

export function DirectivesScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-directives", { defaultValue: "Directives" })}
      </h1>
      <p className="mt-1 text-base-content/70">
        {t("page-directives-sub", {
          defaultValue: "Standing instructions and policies for this project.",
        })}
      </p>

      <ol
        className="mt-6 space-y-4"
        aria-label={t("directive-list-region", {
          defaultValue: "Directive list",
        })}
      >
        {DIRECTIVES.map((d) => (
          <DirectiveCard key={d.id} directive={d} locale={locale} />
        ))}
      </ol>
    </div>
  );
}
