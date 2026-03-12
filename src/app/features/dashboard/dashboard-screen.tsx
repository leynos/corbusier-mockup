/** @file Placeholder for the Dashboard screen with chamfer visual demo. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { ChamferCard } from "../../components/chamfer-card";
import { PlaceholderScreen } from "../placeholder-screen";

function ChamferDemo(): JSX.Element {
  const { t } = useTranslation();

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
          fillClassName="fill-base-100"
          strokeClassName="stroke-base-300"
        >
          <p className="text-[length:var(--font-size-sm)] font-semibold text-base-content">
            {t("dashboard-demo-card-title", { defaultValue: "Task card" })}
          </p>
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/60">
            {t("dashboard-demo-card-subtitle", {
              defaultValue: "Standard chamfer-md (top-right bevel)",
            })}
          </p>
        </ChamferCard>

        {/* Blocked task card */}
        <ChamferCard
          className="w-64 p-4"
          reversed
          fillClassName="fill-base-100"
          strokeClassName="stroke-error"
        >
          <p className="text-[length:var(--font-size-sm)] font-semibold text-error">
            {t("dashboard-demo-blocked-title", { defaultValue: "Blocked card" })}
          </p>
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/60">
            {t("dashboard-demo-blocked-subtitle", {
              defaultValue: "Reversed chamfer-md (top-left bevel)",
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
