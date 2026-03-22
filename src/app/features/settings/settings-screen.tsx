/** @file Profile & Preferences settings screen with form fields. */

import * as Switch from "@radix-ui/react-switch";
import { IconBell, IconMail, IconPhoto, IconUser } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { SectionCard } from "../../components/section-card";

export function SettingsScreen(): JSX.Element {
  const { t } = useTranslation();

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
            <fieldset className="border-none p-0">
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
                defaultValue="Ava Chen"
              />
            </fieldset>

            <fieldset className="border-none p-0">
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
                defaultValue="ava.chen@corbusier.io"
              />
            </fieldset>

            <fieldset className="border-none p-0">
              <legend className="mb-1 text-[length:var(--font-size-sm)] font-medium text-base-content">
                {t("settings-avatar", { defaultValue: "Avatar" })}
              </legend>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-[length:var(--font-size-lg)] font-bold text-primary-content">
                  {t("settings-avatar-initials", { defaultValue: "AC" })}
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
        <p className="text-[length:var(--font-size-xs)] text-base-content/50">{description}</p>
      </div>
      <Switch.Root
        id={id}
        defaultChecked={defaultChecked}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-base-300 transition-colors data-[state=checked]:bg-primary"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-base-100 shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}
