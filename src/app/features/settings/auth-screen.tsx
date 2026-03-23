/** @file Authentication settings: API key management and active sessions. */

import { IconDeviceLaptop, IconKey } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { type Column, DataTable } from "../../components/data-table";
import { SectionCard } from "../../components/section-card";

/* ── Fixture data ──────────────────────────────────────────────────── */

interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly created: string;
  readonly lastUsed: string;
}

interface Session {
  readonly id: string;
  readonly device: string;
  readonly ip: string;
  readonly lastActive: string;
}

const apiKeys: readonly ApiKey[] = [
  {
    id: "key-001",
    name: "CI Pipeline Token",
    prefix: "ck_live_7f2a…",
    created: "2026-01-15",
    lastUsed: "2026-03-22",
  },
  {
    id: "key-002",
    name: "Personal Dev Token",
    prefix: "ck_dev_9b3e…",
    created: "2025-11-03",
    lastUsed: "2026-03-21",
  },
  {
    id: "key-003",
    name: "Monitoring Hook",
    prefix: "ck_hook_4d1c…",
    created: "2026-02-28",
    lastUsed: "2026-03-20",
  },
];

const sessions: readonly Session[] = [
  {
    id: "sess-001",
    device: "Chrome on macOS",
    ip: "192.168.1.42",
    lastActive: "2026-03-22T09:30:00Z",
  },
  {
    id: "sess-002",
    device: "Firefox on Ubuntu",
    ip: "10.0.0.17",
    lastActive: "2026-03-21T14:15:00Z",
  },
  { id: "sess-003", device: "Safari on iOS", ip: "172.16.0.8", lastActive: "2026-03-19T11:00:00Z" },
];

/* ── Component ─────────────────────────────────────────────────────── */

export function AuthScreen(): JSX.Element {
  const { t, i18n } = useTranslation();

  function handleGenerateKey(): void {
    /* Placeholder: open the key-generation modal or trigger the generate flow. */
    console.log("generate key");
  }

  const keyColumns: readonly Column<ApiKey, keyof ApiKey & string>[] = [
    { key: "name", header: t("auth-col-name", { defaultValue: "Name" }) },
    {
      key: "prefix",
      header: t("auth-col-key", { defaultValue: "Key" }),
      className: "font-[family-name:var(--font-mono)]",
    },
    { key: "created", header: t("auth-col-created", { defaultValue: "Created" }) },
    { key: "lastUsed", header: t("auth-col-last-used", { defaultValue: "Last used" }) },
  ];

  const sessionColumns: readonly Column<Session, keyof Session & string>[] = [
    { key: "device", header: t("auth-col-device", { defaultValue: "Device" }) },
    {
      key: "ip",
      header: t("auth-col-ip", { defaultValue: "IP Address" }),
      className: "font-[family-name:var(--font-mono)]",
    },
    {
      key: "lastActive",
      header: t("auth-col-last-active", { defaultValue: "Last active" }),
      render: (val) => new Intl.DateTimeFormat(i18n.language).format(new Date(val)),
    },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-auth-settings", { defaultValue: "Authentication" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("page-auth-settings-sub", {
          defaultValue: "Login methods, tokens, and session policies.",
        })}
      </p>

      <div className="mt-6 space-y-6">
        <SectionCard
          icon={IconKey}
          title={t("auth-api-keys-heading", { defaultValue: "API Keys" })}
        >
          <div className="mb-3 flex justify-end">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleGenerateKey}>
              {t("auth-generate-key", { defaultValue: "Generate key" })}
            </button>
          </div>
          <DataTable
            columns={keyColumns}
            data={apiKeys}
            rowKey={(row) => row.id}
            label={t("auth-api-keys-table-label", { defaultValue: "API keys" })}
          />
        </SectionCard>

        <SectionCard
          icon={IconDeviceLaptop}
          title={t("auth-sessions-heading", { defaultValue: "Active Sessions" })}
        >
          <DataTable
            columns={sessionColumns}
            data={sessions}
            rowKey={(row) => row.id}
            label={t("auth-sessions-table-label", { defaultValue: "Active sessions" })}
          />
        </SectionCard>
      </div>
    </div>
  );
}
