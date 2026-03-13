/** @file Label descriptor registry — resolves label IDs to localised names. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";

export interface LabelDescriptor {
  readonly id: string;
  readonly localizations: EntityLocalizations;
}

export const labelDescriptors: Record<string, LabelDescriptor> = {
  backend: {
    id: "backend",
    localizations: {
      "en-GB": { name: "backend" },
      ar: { name: "backend" },
      de: { name: "backend" },
      es: { name: "backend" },
      hi: { name: "backend" },
      ja: { name: "backend" },
      "zh-CN": { name: "backend" },
    },
  },
  agent: {
    id: "agent",
    localizations: {
      "en-GB": { name: "agent" },
      ar: { name: "agent" },
      de: { name: "agent" },
      es: { name: "agent" },
      hi: { name: "agent" },
      ja: { name: "agent" },
      "zh-CN": { name: "agent" },
    },
  },
  schema: {
    id: "schema",
    localizations: {
      "en-GB": { name: "schema" },
      ar: { name: "schema" },
      de: { name: "schema" },
      es: { name: "schema" },
      hi: { name: "schema" },
      ja: { name: "schema" },
      "zh-CN": { name: "schema" },
    },
  },
  hooks: {
    id: "hooks",
    localizations: {
      "en-GB": { name: "hooks" },
      ar: { name: "hooks" },
      de: { name: "hooks" },
      es: { name: "hooks" },
      hi: { name: "hooks" },
      ja: { name: "hooks" },
      "zh-CN": { name: "hooks" },
    },
  },
  policy: {
    id: "policy",
    localizations: {
      "en-GB": { name: "policy" },
      ar: { name: "policy" },
      de: { name: "policy" },
      es: { name: "policy" },
      hi: { name: "policy" },
      ja: { name: "policy" },
      "zh-CN": { name: "policy" },
    },
  },
  streaming: {
    id: "streaming",
    localizations: {
      "en-GB": { name: "streaming" },
      ar: { name: "streaming" },
      de: { name: "streaming" },
      es: { name: "streaming" },
      hi: { name: "streaming" },
      ja: { name: "streaming" },
      "zh-CN": { name: "streaming" },
    },
  },
  frontend: {
    id: "frontend",
    localizations: {
      "en-GB": { name: "frontend" },
      ar: { name: "frontend" },
      de: { name: "frontend" },
      es: { name: "frontend" },
      hi: { name: "frontend" },
      ja: { name: "frontend" },
      "zh-CN": { name: "frontend" },
    },
  },
  ui: {
    id: "ui",
    localizations: {
      "en-GB": { name: "ui" },
      ar: { name: "ui" },
      de: { name: "ui" },
      es: { name: "ui" },
      hi: { name: "ui" },
      ja: { name: "ui" },
      "zh-CN": { name: "ui" },
    },
  },
  testing: {
    id: "testing",
    localizations: {
      "en-GB": { name: "testing" },
      ar: { name: "testing" },
      de: { name: "testing" },
      es: { name: "testing" },
      hi: { name: "testing" },
      ja: { name: "testing" },
      "zh-CN": { name: "testing" },
    },
  },
  devops: {
    id: "devops",
    localizations: {
      "en-GB": { name: "devops" },
      ar: { name: "devops" },
      de: { name: "devops" },
      es: { name: "devops" },
      hi: { name: "devops" },
      ja: { name: "devops" },
      "zh-CN": { name: "devops" },
    },
  },
  governance: {
    id: "governance",
    localizations: {
      "en-GB": { name: "governance" },
      ar: { name: "governance" },
      de: { name: "governance" },
      es: { name: "governance" },
      hi: { name: "governance" },
      ja: { name: "governance" },
      "zh-CN": { name: "governance" },
    },
  },
  dashboard: {
    id: "dashboard",
    localizations: {
      "en-GB": { name: "dashboard" },
      ar: { name: "dashboard" },
      de: { name: "dashboard" },
      es: { name: "dashboard" },
      hi: { name: "dashboard" },
      ja: { name: "dashboard" },
      "zh-CN": { name: "dashboard" },
    },
  },
  parser: {
    id: "parser",
    localizations: {
      "en-GB": { name: "parser" },
      ar: { name: "parser" },
      de: { name: "parser" },
      es: { name: "parser" },
      hi: { name: "parser" },
      ja: { name: "parser" },
      "zh-CN": { name: "parser" },
    },
  },
  security: {
    id: "security",
    localizations: {
      "en-GB": { name: "security" },
      ar: { name: "security" },
      de: { name: "security" },
      es: { name: "security" },
      hi: { name: "security" },
      ja: { name: "security" },
      "zh-CN": { name: "security" },
    },
  },
  automation: {
    id: "automation",
    localizations: {
      "en-GB": { name: "automation" },
      ar: { name: "automation" },
      de: { name: "automation" },
      es: { name: "automation" },
      hi: { name: "automation" },
      ja: { name: "automation" },
      "zh-CN": { name: "automation" },
    },
  },
  a11y: {
    id: "a11y",
    localizations: {
      "en-GB": { name: "a11y" },
      ar: { name: "a11y" },
      de: { name: "a11y" },
      es: { name: "a11y" },
      hi: { name: "a11y" },
      ja: { name: "a11y" },
      "zh-CN": { name: "a11y" },
    },
  },
  monitoring: {
    id: "monitoring",
    localizations: {
      "en-GB": { name: "monitoring" },
      ar: { name: "monitoring" },
      de: { name: "monitoring" },
      es: { name: "monitoring" },
      hi: { name: "monitoring" },
      ja: { name: "monitoring" },
      "zh-CN": { name: "monitoring" },
    },
  },
  settings: {
    id: "settings",
    localizations: {
      "en-GB": { name: "settings" },
      ar: { name: "settings" },
      de: { name: "settings" },
      es: { name: "settings" },
      hi: { name: "settings" },
      ja: { name: "settings" },
      "zh-CN": { name: "settings" },
    },
  },
};
