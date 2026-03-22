/** @file Appearance settings: theme toggle, layout density, and SSE reconnect preference. */

import * as Switch from "@radix-ui/react-switch";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { IconLayout, IconMoon, IconPalette, IconSun, IconWifi } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { SectionCard } from "../../components/section-card";
import { useTheme } from "../../providers/theme-provider";

export function AppearanceScreen(): JSX.Element {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-appearance", { defaultValue: "Appearance" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("page-appearance-sub", {
          defaultValue: "Theme, display density, and visual preferences.",
        })}
      </p>

      <div className="mt-6 space-y-6">
        {/* Theme toggle */}
        <SectionCard
          icon={IconPalette}
          title={t("appearance-theme-heading", { defaultValue: "Theme" })}
        >
          <ToggleGroup.Root
            type="single"
            value={theme}
            onValueChange={(val) => {
              if (val) setTheme(val);
            }}
            className="inline-flex gap-2"
            aria-label={t("controls-theme-group-label", { defaultValue: "Theme" })}
          >
            <ToggleGroup.Item
              value="corbusier-mockup-day"
              className="btn btn-sm btn-ghost data-[state=on]:btn-primary"
            >
              <IconSun size={16} stroke={1.5} aria-hidden="true" />
              {t("controls-theme-day-option-label", { defaultValue: "Day" })}
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="corbusier-mockup-night"
              className="btn btn-sm btn-ghost data-[state=on]:btn-primary"
            >
              <IconMoon size={16} stroke={1.5} aria-hidden="true" />
              {t("controls-theme-night-option-label", { defaultValue: "Night" })}
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </SectionCard>

        {/* Layout density */}
        <SectionCard
          icon={IconLayout}
          title={t("appearance-density-heading", { defaultValue: "Layout Density" })}
        >
          <ToggleGroup.Root
            type="single"
            defaultValue="comfortable"
            className="inline-flex gap-2"
            aria-label={t("appearance-density-label", { defaultValue: "Layout density" })}
          >
            {(
              [
                ["compact", "appearance-density-compact", "Compact"],
                ["comfortable", "appearance-density-comfortable", "Comfortable"],
                ["spacious", "appearance-density-spacious", "Spacious"],
              ] as const
            ).map(([value, key, fallback]) => (
              <ToggleGroup.Item
                key={value}
                value={value}
                className="btn btn-sm btn-ghost data-[state=on]:btn-primary"
              >
                {t(key, { defaultValue: fallback })}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </SectionCard>

        {/* SSE reconnection */}
        <SectionCard
          icon={IconWifi}
          title={t("appearance-sse-heading", { defaultValue: "Real-time Updates" })}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-[length:var(--font-size-sm)] font-medium text-base-content">
                {t("appearance-sse-auto-reconnect", {
                  defaultValue: "Auto-reconnect on connection loss",
                })}
              </p>
              <p className="text-[length:var(--font-size-xs)] text-base-content/60">
                {t("appearance-sse-desc", {
                  defaultValue:
                    "Automatically re-establish SSE connections when the server becomes available.",
                })}
              </p>
            </div>
            <Switch.Root
              id="sse-reconnect"
              defaultChecked
              className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-base-300 transition-colors data-[state=checked]:bg-primary"
              aria-label={t("appearance-sse-auto-reconnect", {
                defaultValue: "Auto-reconnect on connection loss",
              })}
            >
              <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-base-100 shadow-sm transition-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
