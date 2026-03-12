/** @file Top header bar with page title, search trigger, notifications, and user menu. */

import { IconBell, IconSearch, IconUserCircle } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { HeaderControls } from "./header-controls";

export function HeaderBar(): JSX.Element {
  const { t } = useTranslation();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-base-300 bg-base-100 px-6">
      <div className="flex-1" />

      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-base-300 px-3 py-1.5 text-[length:var(--font-size-sm)] text-base-content/60 transition-colors duration-[var(--transition-fast)] hover:border-base-content/30 hover:text-base-content"
        aria-label={t("header-search-label", { defaultValue: "Search Directives" })}
      >
        <IconSearch size={16} stroke={1.5} aria-hidden="true" />
        <span className="hidden sm:inline">
          {t("header-search-placeholder", { defaultValue: "Search Directives" })}
        </span>
        <kbd className="hidden rounded border border-base-300 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/40 sm:inline">
          ⌘K
        </kbd>
      </button>

      <HeaderControls />

      <button
        type="button"
        className="relative rounded-md p-2 text-base-content/60 transition-colors duration-[var(--transition-fast)] hover:bg-base-300/50 hover:text-base-content"
        aria-label={t("header-notifications-label", { defaultValue: "Notifications" })}
      >
        <IconBell size={20} stroke={1.5} aria-hidden="true" />
        <span
          className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-error"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        className="rounded-md p-1 text-base-content/60 transition-colors duration-[var(--transition-fast)] hover:bg-base-300/50 hover:text-base-content"
        aria-label={t("header-user-menu-label", { defaultValue: "User menu" })}
      >
        <IconUserCircle size={28} stroke={1.2} aria-hidden="true" />
      </button>
    </header>
  );
}
