/** @file User avatar dropdown with profile link, tenant display, and sign-out action. */

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

/* ── Fixture user data ─────────────────────────────────────────────── */

const currentUser = {
  displayName: "Ava Chen",
  initials: "AC",
  email: "ava.chen@corbusier.io",
  tenant: "Corbusier Operations",
};

/* ── Component ─────────────────────────────────────────────────────── */

/**
 * Avatar button that opens a dropdown menu for the signed-in user.
 *
 * Trigger: a circular avatar button showing the user's initials.
 * Items: Profile (→ `/settings`), Settings (→ `/settings/appearance`).
 * Sign-out: navigates to `/sign-in` via the TanStack Router `useNavigate` hook.
 */
export function UserMenu(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[length:var(--font-size-xs)] font-bold text-primary-content transition-opacity duration-[var(--transition-fast)] hover:opacity-80"
          aria-label={t("header-user-menu-label", { defaultValue: "User menu" })}
        >
          {currentUser.initials}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-56 rounded-xl border border-base-300 bg-base-100 p-1 shadow-xl"
          sideOffset={8}
          align="end"
        >
          {/* User info header */}
          <div className="px-3 py-2">
            <p className="text-[length:var(--font-size-sm)] font-semibold text-base-content">
              {currentUser.displayName}
            </p>
            <p className="text-[length:var(--font-size-xs)] text-base-content/50">
              {currentUser.email}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-base-300" />

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[length:var(--font-size-sm)] text-base-content outline-none transition-colors data-[highlighted]:bg-base-200"
            onSelect={() => void navigate({ to: "/settings" })}
          >
            <IconUser size={16} stroke={1.5} aria-hidden="true" />
            {t("user-menu-profile", { defaultValue: "Profile" })}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[length:var(--font-size-sm)] text-base-content outline-none transition-colors data-[highlighted]:bg-base-200"
            onSelect={() => void navigate({ to: "/settings/appearance" })}
          >
            <IconSettings size={16} stroke={1.5} aria-hidden="true" />
            {t("user-menu-settings", { defaultValue: "Settings" })}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-base-300" />

          {/* Tenant display */}
          <div className="px-3 py-1.5">
            <p className="text-[length:var(--font-size-xs)] text-base-content/40">
              {t("user-menu-tenant", { defaultValue: "Tenant" })}
            </p>
            <p className="text-[length:var(--font-size-xs)] text-base-content/60">
              {currentUser.tenant}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-base-300" />

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[length:var(--font-size-sm)] text-error outline-none transition-colors data-[highlighted]:bg-error/10"
            onSelect={() => {
              void navigate({ to: "/sign-in" });
            }}
          >
            <IconLogout size={16} stroke={1.5} aria-hidden="true" />
            {t("user-menu-sign-out", { defaultValue: "Sign out" })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
