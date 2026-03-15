/** @file Handoff annotation divider between agent backends.
 *
 * A visually prominent horizontal divider inserted into the message
 * timeline at handoff positions, showing source and target backend names.
 */

import { IconArrowRight } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Handoff } from "../../../../data/conversations";

interface HandoffAnnotationProps {
  readonly handoff: Handoff;
}

export function HandoffAnnotation({ handoff }: HandoffAnnotationProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <li
      aria-label={t("handoff-annotation-label", {
        defaultValue: "Agent handoff",
      })}
      className="flex items-center gap-3 py-2"
    >
      <span className="h-px flex-1 bg-warning/40" aria-hidden="true" />
      <span className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-warning">
        {t("handoff-annotation-prefix", { defaultValue: "Handoff" })}
        <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
          {handoff.fromBackend}
        </span>
        <IconArrowRight size={14} stroke={2} aria-hidden="true" />
        <span className="font-[family-name:var(--font-mono)] normal-case tracking-normal">
          {handoff.toBackend}
        </span>
      </span>
      <span className="h-px flex-1 bg-warning/40" aria-hidden="true" />
    </li>
  );
}
