/** @file Priority descriptor registry — resolves priority IDs to localised labels. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import { Priority } from "../tasks";

export interface PriorityDescriptor {
  readonly id: Priority;
  readonly localizations: EntityLocalizations;
}

export const priorityDescriptors = {
  low: {
    id: Priority.Low,
    localizations: {
      "en-GB": { name: "Low" },
      ar: { name: "منخفضة" },
      de: { name: "Niedrig" },
      es: { name: "Baja" },
      hi: { name: "निम्न" },
      ja: { name: "低" },
      "zh-CN": { name: "低" },
    },
  },
  medium: {
    id: Priority.Medium,
    localizations: {
      "en-GB": { name: "Medium" },
      ar: { name: "متوسطة" },
      de: { name: "Mittel" },
      es: { name: "Media" },
      hi: { name: "मध्यम" },
      ja: { name: "中" },
      "zh-CN": { name: "中" },
    },
  },
  high: {
    id: Priority.High,
    localizations: {
      "en-GB": { name: "High" },
      ar: { name: "عالية" },
      de: { name: "Hoch" },
      es: { name: "Alta" },
      hi: { name: "उच्च" },
      ja: { name: "高" },
      "zh-CN": { name: "高" },
    },
  },
  critical: {
    id: Priority.Critical,
    localizations: {
      "en-GB": { name: "Critical" },
      ar: { name: "حرجة" },
      de: { name: "Kritisch" },
      es: { name: "Crítica" },
      hi: { name: "गंभीर" },
      ja: { name: "緊急" },
      "zh-CN": { name: "紧急" },
    },
  },
} satisfies Record<Priority, PriorityDescriptor>;
