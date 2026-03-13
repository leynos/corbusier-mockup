/** @file Agent status descriptor registry. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { AgentStatus } from "../dashboard";

export interface AgentStatusDescriptor {
  readonly id: AgentStatus;
  readonly localizations: EntityLocalizations;
}

export const agentStatusDescriptors: Record<AgentStatus, AgentStatusDescriptor> = {
  active: {
    id: "active",
    localizations: {
      "en-GB": { name: "Active" },
      ar: { name: "نشط" },
      de: { name: "Aktiv" },
      es: { name: "Activo" },
      hi: { name: "सक्रिय" },
      ja: { name: "アクティブ" },
      "zh-CN": { name: "活跃" },
    },
  },
  inactive: {
    id: "inactive",
    localizations: {
      "en-GB": { name: "Inactive" },
      ar: { name: "غير نشط" },
      de: { name: "Inaktiv" },
      es: { name: "Inactivo" },
      hi: { name: "निष्क्रिय" },
      ja: { name: "非アクティブ" },
      "zh-CN": { name: "闲置" },
    },
  },
  error: {
    id: "error",
    localizations: {
      "en-GB": { name: "Error" },
      ar: { name: "خطأ" },
      de: { name: "Fehler" },
      es: { name: "Error" },
      hi: { name: "त्रुटि" },
      ja: { name: "エラー" },
      "zh-CN": { name: "错误" },
    },
  },
};
