/** @file Sidebar navigation with MAINFRAME, PROJECTS, and SYSTEM zones. */

import {
  IconActivity,
  IconBuilding,
  IconBulb,
  IconChartBar,
  IconChecklist,
  IconLayoutDashboard,
  IconMessageCircle,
  IconPlus,
  IconRobot,
  IconSettings,
  IconTool,
  IconUsers,
  IconWebhook,
} from "@tabler/icons-react";
import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PROJECT_FIXTURES } from "../../data/projects";
import { pickLocalization } from "../domain/entities/localization";

type SidebarStaticRoute =
  | "/"
  | "/tasks"
  | "/suggestions"
  | "/projects"
  | "/system/personnel"
  | "/system/reports"
  | "/system/agents"
  | "/system/tools"
  | "/system/hooks"
  | "/system/monitoring"
  | "/system/tenants"
  | "/settings";

interface NavItem {
  readonly label: string;
  readonly to: SidebarStaticRoute;
  readonly icon: ReactNode;
  /** When true, match only when the path is an exact match. */
  readonly exact?: boolean;
}

interface ProjectItem {
  readonly label: string;
  readonly slug: string;
  readonly active: boolean;
}

const ICON_SIZE = 18;
const ICON_STROKE = 1.5;

/** Use `ValidateLinkOptions` so sidebar links keep full route type-safety. */
function SidebarLink<TOptions>(
  props: ValidateLinkOptions<RegisteredRouter, TOptions>,
): JSX.Element {
  return <Link {...props} />;
}

function ZoneLabel({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <h3 className="px-3 pb-1 pt-4 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
      {children}
    </h3>
  );
}

function NavLink({ item }: { readonly item: NavItem }): JSX.Element {
  const location = useRouterState({ select: (s) => s.location });
  const isActive = item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  return (
    <SidebarLink
      to={item.to}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-[length:var(--font-size-sm)] transition-colors duration-[var(--transition-fast)] ${
        isActive
          ? "border-s-2 border-primary bg-primary/10 ps-[10px] font-semibold text-primary"
          : "border-s-2 border-transparent ps-[10px] text-base-content/70 hover:bg-base-300/50 hover:text-base-content"
      }`}
    >
      <span className="shrink-0" aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </SidebarLink>
  );
}

function ProjectLink({ project }: { readonly project: ProjectItem }): JSX.Element {
  const location = useRouterState({ select: (s) => s.location });
  const to = `/projects/${project.slug}`;
  const isActive = location.pathname.startsWith(to);

  return (
    <SidebarLink
      to="/projects/$slug/kanban"
      params={{ slug: project.slug }}
      className={`flex items-center gap-3 rounded-md px-3 py-1.5 text-[length:var(--font-size-sm)] transition-colors duration-[var(--transition-fast)] ${
        isActive
          ? "border-s-2 border-primary bg-primary/10 ps-[10px] font-semibold text-primary"
          : "border-s-2 border-transparent ps-[10px] text-base-content/70 hover:bg-base-300/50 hover:text-base-content"
      }`}
    >
      <span
        className={`inline-block h-2 w-2 shrink-0 rounded-full ${
          project.active ? "bg-primary" : "border border-base-content/30 bg-transparent"
        }`}
        aria-hidden="true"
      />
      <span>{project.label}</span>
    </SidebarLink>
  );
}

export function Sidebar(): JSX.Element {
  const { t, i18n } = useTranslation();

  const mainframeItems: readonly NavItem[] = [
    {
      label: t("nav-dashboard", { defaultValue: "Dashboard" }),
      to: "/",
      icon: <IconLayoutDashboard size={ICON_SIZE} stroke={ICON_STROKE} />,
      exact: true,
    },
    {
      label: t("nav-my-tasks", { defaultValue: "My Tasks" }),
      to: "/tasks",
      icon: <IconChecklist size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-ai-suggestions", { defaultValue: "AI Suggestions" }),
      to: "/suggestions",
      icon: <IconBulb size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
  ];

  const locale = i18n.resolvedLanguage ?? i18n.language;

  const fixtureProjects: readonly ProjectItem[] = PROJECT_FIXTURES.map((p) => ({
    label: pickLocalization(p.localizations, locale).name,
    slug: p.slug,
    active: p.status === "active",
  }));

  const systemItems: readonly NavItem[] = [
    {
      label: t("nav-personnel", { defaultValue: "Personnel" }),
      to: "/system/personnel",
      icon: <IconUsers size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-reports", { defaultValue: "Reports" }),
      to: "/system/reports",
      icon: <IconChartBar size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-agent-backends", { defaultValue: "Agent Backends" }),
      to: "/system/agents",
      icon: <IconRobot size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-tool-registry", { defaultValue: "Tool Registry" }),
      to: "/system/tools",
      icon: <IconTool size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-hooks-policies", { defaultValue: "Hooks & Policies" }),
      to: "/system/hooks",
      icon: <IconWebhook size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-monitoring", { defaultValue: "Monitoring" }),
      to: "/system/monitoring",
      icon: <IconActivity size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
    {
      label: t("nav-tenant-management", { defaultValue: "Tenant Management" }),
      to: "/system/tenants",
      icon: <IconBuilding size={ICON_SIZE} stroke={ICON_STROKE} />,
    },
  ];

  return (
    <nav
      aria-label={t("nav-sidebar-label", { defaultValue: "Main navigation" })}
      className="flex h-full w-60 shrink-0 flex-col overflow-y-auto border-e border-base-300 bg-base-300 pb-4"
    >
      <div className="flex-1 space-y-1 px-2">
        <ZoneLabel>{t("nav-zone-mainframe", { defaultValue: "MAINFRAME" })}</ZoneLabel>
        {mainframeItems.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}

        <ZoneLabel>{t("nav-zone-projects", { defaultValue: "PROJECTS" })}</ZoneLabel>
        <SidebarLink
          to="/projects"
          className="flex items-center gap-3 rounded-md px-3 py-1.5 text-[length:var(--font-size-sm)] text-primary hover:bg-base-300/50"
        >
          <IconPlus size={ICON_SIZE} stroke={ICON_STROKE} aria-hidden="true" />
          <span>{t("nav-new-directive", { defaultValue: "New Directive" })}</span>
        </SidebarLink>
        {fixtureProjects.map((project) => (
          <ProjectLink key={project.slug} project={project} />
        ))}

        <ZoneLabel>{t("nav-zone-system", { defaultValue: "SYSTEM" })}</ZoneLabel>
        {systemItems.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}
      </div>

      <div className="mt-auto space-y-1 border-t border-base-content/10 px-2 pt-3">
        <NavLink
          item={{
            label: t("nav-settings", { defaultValue: "Settings" }),
            to: "/settings",
            icon: <IconSettings size={ICON_SIZE} stroke={ICON_STROKE} />,
          }}
        />
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[length:var(--font-size-sm)] text-base-content/70 transition-colors duration-[var(--transition-fast)] hover:bg-base-300/50 hover:text-base-content"
        >
          <IconMessageCircle size={ICON_SIZE} stroke={ICON_STROKE} aria-hidden="true" />
          <span>{t("nav-feedback", { defaultValue: "Feedback" })}</span>
        </button>
      </div>
    </nav>
  );
}
