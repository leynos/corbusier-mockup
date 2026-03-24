/** @file Profile & Preferences settings screen with form fields. */

import * as Switch from "@radix-ui/react-switch";
import { IconBell, IconMail, IconPhoto, IconUser } from "@tabler/icons-react";
import type { JSX } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionCard } from "../../components/section-card";

/* ── Module-scope helpers ──────────────────────────────────────────── */

/**
 * Derive avatar initials from a display name.
 *
 * Returns the first character of each word (up to 2 characters) for multi-word
 * names, or the first character for single-word names. Handles Unicode
 * characters correctly and falls back to "?" when the name is empty.
 *
 * @param displayName - The user's display name.
 * @returns Initials string (1–2 characters) or "?" if input is empty.
 */
function getInitials(displayName: string | undefined): string {
  if (!displayName || displayName.trim().length === 0) return "?";
  const words = displayName.trim().split(/\s+/u);
  if (words.length === 1) {
    // For single-word names, return the first grapheme cluster
    const first = Array.from(words[0] ?? "")[0];
    return first ?? "?";
  }
  // For multi-word names, return first letter of first two words
  const first = Array.from(words[0] ?? "")[0] ?? "";
  const second = Array.from(words[1] ?? "")[0] ?? "";
  return `${first}${second}` || "?";
}

/**
 * Settings screen for profile and notification preferences.
 *
 * @returns The settings page JSX.Element.
 */
export function SettingsScreen(): JSX.Element {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState("Ava Chen");
  const [email, setEmail] = useState("ava.chen@corbusier.io");

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-settings", { defaultValue: "Settings" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("page-settings-sub", {
          defaultValue: "Application preferences and account configuration.",
        })}
      </p>

      <div className="mt-6 space-y-6">
        {/* Profile section */}
        <SectionCard
          icon={IconUser}
          title={t("settings-profile-heading", { defaultValue: "Profile" })}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="settings-display-name"
                className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
              >
                {t("settings-display-name", { defaultValue: "Display name" })}
              </label>
              <input
                id="settings-display-name"
                type="text"
                className="input input-bordered w-full max-w-md"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
              >
                {t("settings-email", { defaultValue: "Email" })}
              </label>
              <input
                id="settings-email"
                type="email"
                className="input input-bordered w-full max-w-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <fieldset className="border-none p-0">
              <legend className="mb-1 text-[length:var(--font-size-sm)] font-medium text-base-content">
                {t("settings-avatar", { defaultValue: "Avatar" })}
              </legend>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[length:var(--font-size-lg)] font-bold text-primary-content">
                  {getInitials(displayName)}
                </div>
                <button type="button" className="btn btn-outline btn-sm">
                  <IconPhoto size={16} stroke={1.5} aria-hidden="true" />
                  {t("settings-avatar-upload", { defaultValue: "Upload photo" })}
                </button>
              </div>
            </fieldset>
          </div>
        </SectionCard>

        {/* Notification preferences */}
        <SectionCard
          icon={IconBell}
          title={t("settings-notifications-heading", { defaultValue: "Notification preferences" })}
        >
          <div className="space-y-4">
            <NotificationToggle
              id="notif-email"
              icon={IconMail}
              label={t("settings-notif-email", { defaultValue: "Email notifications" })}
              description={t("settings-notif-email-desc", {
                defaultValue: "Receive task assignments and reviews via email.",
              })}
            />
            <NotificationToggle
              id="notif-hook"
              icon={IconBell}
              label={t("settings-notif-hooks", { defaultValue: "Hook failure alerts" })}
              description={t("settings-notif-hooks-desc", {
                defaultValue: "Get notified when a hook or policy gate fails.",
              })}
              defaultChecked
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Notification toggle row ───────────────────────────────────────── */

interface NotificationToggleProps {
  readonly id: string;
  readonly icon: typeof IconBell;
  readonly label: string;
  readonly description: string;
  readonly defaultChecked?: boolean;
}

/**
 * A toggle row for notification preferences.
 *
 * @param props - The component props.
 * @returns The toggle row JSX.Element.
 */
function NotificationToggle({
  id,
  icon: Icon,
  label,
  description,
  defaultChecked = false,
}: NotificationToggleProps): JSX.Element {
  return (
    <div className="flex items-start gap-4">
      <Icon
        size={20}
        stroke={1.5}
        className="mt-0.5 shrink-0 text-base-content/50"
        aria-hidden="true"
      />
      <div className="flex-1">
        <label
          htmlFor={id}
          className="text-[length:var(--font-size-sm)] font-medium text-base-content"
        >
          {label}
        </label>
        <p
          id={`${id}-description`}
          className="text-[length:var(--font-size-xs)] text-base-content/50"
        >
          {description}
        </p>
      </div>
      <Switch.Root
        id={id}
        defaultChecked={defaultChecked}
        aria-describedby={`${id}-description`}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-base-300 transition-colors data-[state=checked]:bg-primary"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-base-100 shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}
