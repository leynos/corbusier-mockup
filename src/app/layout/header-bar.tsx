/** @file Top header bar with search trigger, notifications dropdown, and user menu. */

import { IconSearch } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { useCommandPalette } from "../features/command-palette/command-palette-provider";
import { HeaderControls } from "./header-controls";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserMenu } from "./user-menu";

export function HeaderBar(): JSX.Element {
  const { t } = useTranslation();
  const { open } = useCommandPalette();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-base-300 bg-base-100 px-6">
      <div className="flex-1" />

      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-base-300 px-3 py-1.5 text-[length:var(--font-size-sm)] text-base-content/60 transition-colors duration-[var(--transition-fast)] hover:border-base-content/30 hover:text-base-content"
        aria-label={t("header-search-label", { defaultValue: "Search Directives" })}
        onClick={open}
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

      <NotificationsDropdown />

      <UserMenu />
    </header>
  );
}
