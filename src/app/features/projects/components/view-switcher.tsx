/** @file Tabbed view selector for project sub-routes.
 *
 * Renders a navigation tab bar linking to TanStack Router sub-routes
 * (/backlog, /kanban, /calendar, /list, /timeline). The active tab
 * reflects the current URL. Uses role="tablist" / role="tab" for
 * keyboard accessibility without Radix Tabs (which generates
 * aria-controls referencing panel IDs that don't exist here).
 */

import { Link, useRouterState } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface ViewTab {
  readonly id: string;
  readonly label: string;
  readonly path: string;
}

interface ViewSwitcherProps {
  readonly slug: string;
}

export function ViewSwitcher({ slug }: ViewSwitcherProps): JSX.Element {
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });

  const tabs: readonly ViewTab[] = [
    {
      id: "backlog",
      label: t("project-view-backlog", { defaultValue: "Backlog" }),
      path: `/projects/${slug}/backlog`,
    },
    {
      id: "kanban",
      label: t("project-view-kanban", { defaultValue: "Kanban" }),
      path: `/projects/${slug}/kanban`,
    },
    {
      id: "calendar",
      label: t("project-view-calendar", { defaultValue: "Calendar" }),
      path: `/projects/${slug}/calendar`,
    },
    {
      id: "list",
      label: t("project-view-list", { defaultValue: "List" }),
      path: `/projects/${slug}/list`,
    },
    {
      id: "timeline",
      label: t("project-view-timeline", { defaultValue: "Timeline" }),
      path: `/projects/${slug}/timeline`,
    },
  ];

  const activeId = tabs.find((tab) => location.pathname === tab.path)?.id ?? "kanban";

  return (
    <div
      className="flex gap-1 border-b border-base-300"
      role="tablist"
      aria-label={t("project-view-tabs-label", { defaultValue: "Project views" })}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <Link
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            to={tab.path}
            className={`border-b-2 px-4 py-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:border-base-content/30 hover:text-base-content"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
