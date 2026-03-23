/** @file Notifications bell dropdown showing recent notification entries. */

import * as Popover from "@radix-ui/react-popover";
import {
  IconAlertTriangle,
  IconBell,
  IconGitPullRequest,
  IconSubtask,
  IconTerminal,
} from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { type NotificationKind, notifications } from "../../data/notifications";
import { pickLocalization } from "../domain/entities/localization";

/* ── Icon per notification kind ───────────────────────────────────── */

const kindIcons: Record<NotificationKind, typeof IconSubtask> = {
  task_assigned: IconSubtask,
  hook_failure: IconTerminal,
  pr_review: IconGitPullRequest,
  system_alert: IconAlertTriangle,
};

/* ── Component ─────────────────────────────────────────────────────── */

export function NotificationsDropdown(): JSX.Element {
  const { t, i18n } = useTranslation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="relative rounded-md p-2 text-base-content/60 transition-colors duration-[var(--transition-fast)] hover:bg-base-300/50 hover:text-base-content"
          aria-label={t("header-notifications-label", { defaultValue: "Notifications" })}
        >
          <IconBell size={20} stroke={1.5} aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[length:var(--font-size-xs)] font-bold text-error-content">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-xl border border-base-300 bg-base-100 shadow-xl"
          sideOffset={8}
          align="end"
        >
          <div className="border-b border-base-300 px-4 py-3">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
              {t("notifications-heading", { defaultValue: "Notifications" })}
            </h2>
          </div>

          <ul
            className="max-h-72 overflow-y-auto"
            aria-label={t("notifications-list-label", {
              defaultValue: "Recent notifications",
            })}
          >
            {notifications.map((notification) => {
              const Icon = kindIcons[notification.kind];
              const loc = pickLocalization(notification.localizations, i18n.language);
              const ts = new Date(notification.timestamp);
              const relative = formatRelativeTime(ts, i18n.language);

              return (
                <li
                  key={notification.id}
                  className={`flex gap-3 border-b border-base-300 px-4 py-3 last:border-b-0 ${
                    notification.read ? "opacity-60" : ""
                  }`}
                >
                  <Icon
                    size={16}
                    stroke={1.5}
                    className="mt-0.5 shrink-0 text-base-content/50"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[length:var(--font-size-sm)] text-base-content">
                      {loc.name}
                    </p>
                    <time
                      dateTime={notification.timestamp}
                      className="text-[length:var(--font-size-xs)] text-base-content/40"
                    >
                      {relative}
                    </time>
                  </div>
                  {!notification.read ? (
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-label={t("notifications-unread", { defaultValue: "Unread" })}
                      role="img"
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function formatRelativeTime(date: Date, locale: string): string {
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });

  const absDiffMins = Math.round(Math.abs(diffMs) / 60_000);
  if (absDiffMins < 1) return rtf.format(0, "minute");
  if (absDiffMins < 60) return rtf.format(-absDiffMins, "minute");

  const absDiffHours = Math.round(absDiffMins / 60);
  if (absDiffHours < 24) return rtf.format(-absDiffHours, "hour");

  const absDiffDays = Math.round(absDiffHours / 24);
  return rtf.format(-absDiffDays, "day");
}
