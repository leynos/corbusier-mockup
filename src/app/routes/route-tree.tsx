/** @file Generated route tree for TanStack Router. */

import { createRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { rootRoute } from "./root-route";

function HomeScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("home-title", { defaultValue: "Dashboard" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("home-description", {
          defaultValue: "Welcome to the Corbusier orchestration platform.",
        })}
      </p>
    </div>
  );
}

function AboutScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("about-title", { defaultValue: "About" })}
      </h1>
      <p className="mt-2 text-base-content/70">
        {t("about-description", {
          defaultValue: "This is a TypeScript/React mockup with accessibility-first design.",
        })}
      </p>
    </div>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeScreen,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutScreen,
});

export const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);
