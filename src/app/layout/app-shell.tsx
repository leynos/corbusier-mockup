/** @file Desktop app shell layout: sidebar + header + scrollable content area. */

import type { JSX, ReactNode } from "react";

import { HeaderBar } from "./header-bar";
import { Sidebar } from "./sidebar";

export interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-base-200 text-base-content">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
