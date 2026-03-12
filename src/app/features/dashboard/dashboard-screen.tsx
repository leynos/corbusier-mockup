/** @file Placeholder for the Dashboard screen with chamfer visual demo. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { ChamferCard } from "../../components/chamfer-card";
import { isRtlLocale } from "../../i18n/supported-locales";
import { PlaceholderScreen } from "../placeholder-screen";

type ChamferDemoCardConfig = {
  readonly reversed: boolean;
  readonly subtitleKey: string;
  readonly defaultSubtitle: string;
};

type ChamferDemoLayout = {
  readonly standard: ChamferDemoCardConfig;
  readonly blocked: ChamferDemoCardConfig;
};

export function getChamferDemoLayout(isRtl: boolean): ChamferDemoLayout {
  if (isRtl) {
    return {
      standard: {
        reversed: true,
        subtitleKey: "dashboard-demo-card-subtitle-rtl",
        defaultSubtitle: "Standard chamfer-md (top-left bevel)",
      },
      blocked: {
        reversed: false,
        subtitleKey: "dashboard-demo-blocked-subtitle-rtl",
        defaultSubtitle: "Reversed chamfer-md (top-right bevel)",
      },
    };
  }

  return {
    standard: {
      reversed: false,
      subtitleKey: "dashboard-demo-card-subtitle-ltr",
      defaultSubtitle: "Standard chamfer-md (top-right bevel)",
    },
    blocked: {
      reversed: true,
      subtitleKey: "dashboard-demo-blocked-subtitle-ltr",
      defaultSubtitle: "Reversed chamfer-md (top-left bevel)",
    },
  };
}

function ChamferDemo(): JSX.Element {
  const { i18n, t } = useTranslation();
  const isRtl = isRtlLocale(i18n.resolvedLanguage ?? i18n.language);
  const layout = getChamferDemoLayout(isRtl);

  return (
    <section
      aria-label={t("dashboard-demo-region-label", { defaultValue: "Chamfer demo" })}
      className="mt-8 space-y-6"
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
        {t("dashboard-demo-heading", { defaultValue: "Punch-card chamfer demo" })}
      </h2>

      <div className="flex flex-wrap gap-4">
        {/* Standard task card */}
        <ChamferCard
          className="w-64 p-4"
          reversed={layout.standard.reversed}
          fillClassName="fill-base-100"
          strokeClassName="stroke-base-300"
        >
          <p className="text-[length:var(--font-size-sm)] font-semibold text-base-content">
            {t("dashboard-demo-card-title", { defaultValue: "Task card" })}
          </p>
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/60">
            {t(layout.standard.subtitleKey, {
              defaultValue: layout.standard.defaultSubtitle,
            })}
          </p>
        </ChamferCard>

        {/* Blocked task card */}
        <ChamferCard
          className="w-64 p-4"
          reversed={layout.blocked.reversed}
          fillClassName="fill-base-100"
          strokeClassName="stroke-error"
        >
          <p className="text-[length:var(--font-size-sm)] font-semibold text-error">
            {t("dashboard-demo-blocked-title", { defaultValue: "Blocked card" })}
          </p>
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/60">
            {t(layout.blocked.subtitleKey, {
              defaultValue: layout.blocked.defaultSubtitle,
            })}
          </p>
        </ChamferCard>
      </div>

      {/* Code block demo */}
      <ChamferCard
        className="p-4"
        fillClassName="fill-base-300/30"
        strokeClassName="stroke-base-300"
      >
        <pre className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/80">
          <code>{"const directive = await agent.plan(task);\nawait directive.execute();"}</code>
        </pre>
      </ChamferCard>
    </section>
  );
}

export function DashboardScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <PlaceholderScreen
        title={t("page-dashboard", { defaultValue: "Dashboard" })}
        subtitle={t("page-dashboard-sub", {
          defaultValue: "Overview of your workspace.",
        })}
      />
      <ChamferDemo />
    </div>
  );
}
