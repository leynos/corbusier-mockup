/** @file Workspace defaults: encapsulation provider, resource limits, tool policy. */

import * as Slider from "@radix-ui/react-slider";
import { IconBox, IconCpu, IconShieldCheck } from "@tabler/icons-react";
import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionCard } from "../../components/section-card";

export function WorkspaceScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-workspace-settings", { defaultValue: "Workspace" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("page-workspace-settings-sub", {
          defaultValue: "Workspace name, defaults, and team preferences.",
        })}
      </p>

      <div className="mt-6 space-y-6">
        {/* Encapsulation provider */}
        <SectionCard
          icon={IconBox}
          title={t("workspace-encapsulation-heading", { defaultValue: "Encapsulation Provider" })}
        >
          <fieldset className="border-none p-0">
            <label
              htmlFor="encapsulation-select"
              className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
            >
              {t("workspace-provider-label", { defaultValue: "Provider" })}
            </label>
            <select id="encapsulation-select" className="select select-bordered w-full max-w-md">
              <option>{t("workspace-provider-docker", { defaultValue: "Docker" })}</option>
              <option>{t("workspace-provider-podman", { defaultValue: "Podman" })}</option>
              <option>
                {t("workspace-provider-firecracker", { defaultValue: "Firecracker" })}
              </option>
              <option>{t("workspace-provider-gvisor", { defaultValue: "gVisor" })}</option>
            </select>
          </fieldset>
        </SectionCard>

        {/* Resource limits */}
        <SectionCard
          icon={IconCpu}
          title={t("workspace-resources-heading", { defaultValue: "Resource Limits" })}
        >
          <div className="space-y-6">
            <ResourceSlider
              id="cpu-limit"
              label={t("workspace-cpu-label", { defaultValue: "CPU cores" })}
              min={1}
              max={16}
              step={1}
              defaultValue={4}
              unit=""
            />
            <ResourceSlider
              id="memory-limit"
              label={t("workspace-memory-label", { defaultValue: "Memory (GB)" })}
              min={1}
              max={64}
              step={1}
              defaultValue={8}
              unit={t("workspace-unit-gb", { defaultValue: "GB" })}
            />
            <ResourceSlider
              id="disk-limit"
              label={t("workspace-disk-label", { defaultValue: "Disk (GB)" })}
              min={10}
              max={500}
              step={10}
              defaultValue={100}
              unit={t("workspace-unit-gb", { defaultValue: "GB" })}
            />
            <ResourceSlider
              id="timeout-limit"
              label={t("workspace-timeout-label", { defaultValue: "Task timeout (minutes)" })}
              min={5}
              max={120}
              step={5}
              defaultValue={30}
              unit={t("workspace-unit-min", { defaultValue: "min" })}
            />
          </div>
        </SectionCard>

        {/* Tool policy */}
        <SectionCard
          icon={IconShieldCheck}
          title={t("workspace-tool-policy-heading", { defaultValue: "Tool Policy" })}
        >
          <fieldset className="border-none p-0">
            <legend className="mb-2 text-[length:var(--font-size-sm)] font-medium text-base-content">
              {t("workspace-file-edit-policy", { defaultValue: "File edit policy" })}
            </legend>
            <div className="space-y-2">
              {(
                [
                  ["ask", "workspace-policy-ask", "Ask before each edit"],
                  ["allow", "workspace-policy-allow", "Allow all edits"],
                  ["deny", "workspace-policy-deny", "Deny all edits"],
                ] as const
              ).map(([value, key, fallback]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="file-edit-policy"
                    value={value}
                    defaultChecked={value === "ask"}
                    className="radio radio-sm radio-primary"
                  />
                  <span className="text-[length:var(--font-size-sm)] text-base-content">
                    {t(key, { defaultValue: fallback })}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4 border-none p-0">
            <legend className="mb-2 text-[length:var(--font-size-sm)] font-medium text-base-content">
              {t("workspace-allowed-tools-heading", { defaultValue: "Allowed tools" })}
            </legend>
            <div className="space-y-2">
              {(
                [
                  ["bash", "workspace-tool-bash", "Bash"],
                  ["file-read", "workspace-tool-file-read", "File read"],
                  ["file-edit", "workspace-tool-file-edit", "File edit"],
                  ["web-fetch", "workspace-tool-web-fetch", "Web fetch"],
                  ["web-search", "workspace-tool-web-search", "Web search"],
                ] as const
              ).map(([value, key, fallback]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`allowed-tool-${value}`}
                    name="allowed-tools"
                    value={value}
                    defaultChecked
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-[length:var(--font-size-sm)] text-base-content">
                    {t(key, { defaultValue: fallback })}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── Resource slider ───────────────────────────────────────────────── */

interface ResourceSliderProps {
  readonly id: string;
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly defaultValue: number;
  readonly unit: string;
}

function ResourceSlider({
  id,
  label,
  min,
  max,
  step,
  defaultValue,
  unit,
}: ResourceSliderProps): JSX.Element {
  const [value, setValue] = useState(defaultValue);

  const labelId = `${id}-label`;
  const outputId = `${id}-output`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span
          id={labelId}
          className="text-[length:var(--font-size-sm)] font-medium text-base-content"
        >
          {label}
        </span>
        <output
          id={outputId}
          className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/70"
        >
          {value}
          {unit ? ` ${unit}` : ""}
        </output>
      </div>
      <Slider.Root
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => {
          if (v !== undefined) setValue(v);
        }}
        className="relative flex h-5 w-full max-w-md touch-none items-center"
      >
        <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-base-300">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          aria-labelledby={labelId}
          aria-describedby={outputId}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-base-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </Slider.Root>
    </div>
  );
}
