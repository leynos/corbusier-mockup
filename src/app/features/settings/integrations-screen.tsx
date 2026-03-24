/** @file Integrations settings: VCS provider cards and Frankie adapter config. */

import { IconBrandGithub, IconBrandGitlab, IconPlugConnected } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { SectionCard } from "../../components/section-card";

export function IntegrationsScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-integrations", { defaultValue: "Integrations" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("page-integrations-sub", {
          defaultValue: "Third-party service connections and API keys.",
        })}
      </p>

      <div className="mt-6 space-y-6">
        <IntegrationCard
          icon={IconBrandGithub}
          title={t("integrations-github-heading", { defaultValue: "GitHub" })}
          clientIdLabel={t("integrations-client-id", { defaultValue: "Client ID" })}
          secretLabel={t("integrations-client-secret", { defaultValue: "Client secret" })}
          webhookLabel={t("integrations-webhook-url", { defaultValue: "Webhook URL" })}
          clientIdPlaceholder="Iv1.abc123def456"
          webhookPlaceholder="https://corbusier.io/hooks/github"
        />

        <IntegrationCard
          icon={IconBrandGitlab}
          title={t("integrations-gitlab-heading", { defaultValue: "GitLab" })}
          clientIdLabel={t("integrations-client-id", { defaultValue: "Client ID" })}
          secretLabel={t("integrations-client-secret", { defaultValue: "Client secret" })}
          webhookLabel={t("integrations-webhook-url", { defaultValue: "Webhook URL" })}
          clientIdPlaceholder="gl-app-id-7890"
          webhookPlaceholder="https://corbusier.io/hooks/gitlab"
        />

        <SectionCard
          icon={IconPlugConnected}
          title={t("integrations-frankie-heading", { defaultValue: "Frankie Review Adapter" })}
        >
          <div className="space-y-4">
            <fieldset className="border-none p-0">
              <label
                htmlFor="frankie-endpoint"
                className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
              >
                {t("integrations-frankie-endpoint", { defaultValue: "Endpoint URL" })}
              </label>
              <input
                id="frankie-endpoint"
                type="url"
                className="input input-bordered w-full max-w-md"
                placeholder={t("integrations-frankie-endpoint-placeholder", {
                  defaultValue: "https://frankie.internal/api/v1",
                })}
              />
            </fieldset>

            <fieldset className="border-none p-0">
              <label
                htmlFor="frankie-token"
                className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
              >
                {t("integrations-frankie-token", { defaultValue: "API Token" })}
              </label>
              <input
                id="frankie-token"
                type="password"
                className="input input-bordered w-full max-w-md"
                placeholder={t("integrations-frankie-token-placeholder", {
                  defaultValue: "frk_••••••••",
                })}
              />
            </fieldset>

            <button type="button" className="btn btn-primary btn-sm">
              {t("integrations-test-connection", { defaultValue: "Test connection" })}
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ── VCS integration card ──────────────────────────────────────────── */

interface IntegrationCardProps {
  readonly icon: typeof IconBrandGithub;
  readonly title: string;
  readonly clientIdLabel: string;
  readonly secretLabel: string;
  readonly webhookLabel: string;
  readonly clientIdPlaceholder: string;
  readonly webhookPlaceholder: string;
}

function IntegrationCard({
  icon,
  title,
  clientIdLabel,
  secretLabel,
  webhookLabel,
  clientIdPlaceholder,
  webhookPlaceholder,
}: IntegrationCardProps): JSX.Element {
  const idBase = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <SectionCard icon={icon} title={title}>
      <div className="space-y-4">
        <fieldset className="border-none p-0">
          <label
            htmlFor={`${idBase}-client-id`}
            className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
          >
            {clientIdLabel}
          </label>
          <input
            id={`${idBase}-client-id`}
            type="text"
            className="input input-bordered w-full max-w-md"
            placeholder={clientIdPlaceholder}
          />
        </fieldset>

        <fieldset className="border-none p-0">
          <label
            htmlFor={`${idBase}-secret`}
            className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
          >
            {secretLabel}
          </label>
          <input
            id={`${idBase}-secret`}
            type="password"
            className="input input-bordered w-full max-w-md"
            placeholder="••••••••••••"
          />
        </fieldset>

        <fieldset className="border-none p-0">
          <label
            htmlFor={`${idBase}-webhook`}
            className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-base-content"
          >
            {webhookLabel}
          </label>
          <input
            id={`${idBase}-webhook`}
            type="url"
            className="input input-bordered w-full max-w-md"
            placeholder={webhookPlaceholder}
          />
        </fieldset>
      </div>
    </SectionCard>
  );
}
