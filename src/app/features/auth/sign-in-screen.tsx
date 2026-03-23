/** @file Standalone sign-in page rendered outside the app shell. */

import { IconBolt, IconChartLine, IconLock, IconMail, IconShieldCheck } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function SignInScreen(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-8">
      <main className="w-full max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <BrandingPanel />
          <SignInCard />
        </div>
      </main>
    </div>
  );
}

/* ── Branding panel ────────────────────────────────────────────────── */

function BrandingPanel(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="text-center lg:text-start">
      <div className="mb-6 inline-flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent font-[family-name:var(--font-mono)] text-[length:var(--font-size-3xl)] font-bold text-accent-content shadow-sm md:h-20 md:w-20 md:text-[length:var(--font-size-4xl)]">
          C
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-3xl)] font-bold tracking-tight text-base-content md:text-[length:var(--font-size-4xl)]">
            {t("sign-in-brand", { defaultValue: "CORBUSIER" })}
          </h1>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/60">
            {t("sign-in-tagline", {
              defaultValue: "Engineering Orchestration Platform",
            })}
          </p>
        </div>
      </div>

      <div className="mt-12 hidden space-y-6 lg:block">
        <FeatureCallout
          icon={IconBolt}
          title={t("sign-in-feature-orchestration", {
            defaultValue: "Real-time Task Orchestration",
          })}
          description={t("sign-in-feature-orchestration-desc", {
            defaultValue: "Intelligent agent-driven workflows with live status updates",
          })}
        />
        <FeatureCallout
          icon={IconShieldCheck}
          title={t("sign-in-feature-security", {
            defaultValue: "Enterprise-Grade Security",
          })}
          description={t("sign-in-feature-security-desc", {
            defaultValue: "RBAC, audit trails, and policy enforcement",
          })}
        />
        <FeatureCallout
          icon={IconChartLine}
          title={t("sign-in-feature-insights", {
            defaultValue: "AI-Powered Insights",
          })}
          description={t("sign-in-feature-insights-desc", {
            defaultValue: "Proactive suggestions and intelligent recommendations",
          })}
        />
      </div>
    </div>
  );
}

/* ── Sign-in card ──────────────────────────────────────────────────── */

function SignInCard(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="card border border-base-300 bg-base-100 shadow-lg">
        <div className="card-body p-8 md:p-10">
          <h2 className="text-[length:var(--font-size-2xl)] font-bold text-base-content md:text-[length:var(--font-size-3xl)]">
            {t("sign-in-heading", { defaultValue: "Welcome back" })}
          </h2>
          <p className="text-base-content/60">
            {t("sign-in-subtitle", {
              defaultValue: "Sign in to your workspace to continue",
            })}
          </p>

          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="border-none p-0">
              <label
                htmlFor="sign-in-email"
                className="mb-2 block text-[length:var(--font-size-sm)] font-semibold text-base-content"
              >
                {t("sign-in-email-label", { defaultValue: "Email address" })}
              </label>
              <div className="relative">
                <IconMail
                  size={18}
                  stroke={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  aria-hidden="true"
                />
                <input
                  id="sign-in-email"
                  type="email"
                  placeholder={t("sign-in-email-placeholder", {
                    defaultValue: "you@company.com",
                  })}
                  className="input input-bordered w-full ps-10"
                  autoComplete="email"
                  required
                />
              </div>
            </fieldset>

            <fieldset className="border-none p-0">
              <label
                htmlFor="sign-in-password"
                className="mb-2 block text-[length:var(--font-size-sm)] font-semibold text-base-content"
              >
                {t("sign-in-password-label", { defaultValue: "Password" })}
              </label>
              <div className="relative">
                <IconLock
                  size={18}
                  stroke={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  aria-hidden="true"
                />
                <input
                  id="sign-in-password"
                  type="password"
                  placeholder={t("sign-in-password-placeholder", {
                    defaultValue: "Enter your password",
                  })}
                  className="input input-bordered w-full ps-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </fieldset>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                <span className="text-[length:var(--font-size-sm)] text-base-content">
                  {t("sign-in-remember", { defaultValue: "Remember this device" })}
                </span>
              </label>
              <button
                type="button"
                className="text-[length:var(--font-size-sm)] font-semibold text-primary hover:text-primary/80"
              >
                {t("sign-in-forgot", { defaultValue: "Forgot password?" })}
              </button>
            </div>

            <button type="submit" className="btn btn-accent w-full">
              {t("sign-in-submit", { defaultValue: "Sign in to workspace" })}
            </button>
          </form>

          <p className="mt-6 text-center text-[length:var(--font-size-sm)] text-base-content/60">
            {t("sign-in-no-account", { defaultValue: "Don't have an account?" })}{" "}
            <button type="button" className="font-semibold text-primary hover:text-primary/80">
              {t("sign-in-request-access", { defaultValue: "Request access" })}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Feature callout ───────────────────────────────────────────────── */

interface FeatureCalloutProps {
  readonly icon: typeof IconBolt;
  readonly title: string;
  readonly description: string;
}

function FeatureCallout({ icon: Icon, title, description }: FeatureCalloutProps): JSX.Element {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon size={24} stroke={1.5} className="text-primary" aria-hidden="true" />
      </div>
      <div className="text-start">
        <h3 className="font-semibold text-base-content">{title}</h3>
        <p className="text-[length:var(--font-size-sm)] text-base-content/60">{description}</p>
      </div>
    </div>
  );
}
