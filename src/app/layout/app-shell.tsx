/** @file Desktop app shell layout: sidebar + header + scrollable content area. */

import type { JSX, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { HeaderBar } from "./header-bar";
import { Sidebar } from "./sidebar";

export interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen overflow-hidden bg-base-200 text-base-content">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderBar />
        <main className="relative flex-1 overflow-y-auto p-6">
          <a
            href="#app-shell-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-10 focus:rounded-md focus:bg-base-100 focus:px-3 focus:py-2 focus:text-base-content"
          >
            {t("app-skip-to-content")}
          </a>
          <div id="app-shell-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
