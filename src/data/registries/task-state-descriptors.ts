/** @file Task state descriptor registry — resolves state IDs to localised labels. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { TaskState } from "../tasks";

export interface TaskStateDescriptor {
  readonly id: TaskState;
  readonly localizations: EntityLocalizations;
}

export const taskStateDescriptors: Record<string, TaskStateDescriptor> = {
  draft: {
    id: "draft" as TaskState,
    localizations: {
      "en-GB": { name: "Draft" },
      ar: { name: "مسودة" },
      de: { name: "Entwurf" },
      es: { name: "Borrador" },
      hi: { name: "ड्राफ़्ट" },
      ja: { name: "下書き" },
      "zh-CN": { name: "草稿" },
    },
  },
  in_progress: {
    id: "in_progress" as TaskState,
    localizations: {
      "en-GB": { name: "In Progress" },
      ar: { name: "قيد التنفيذ" },
      de: { name: "In Bearbeitung" },
      es: { name: "En curso" },
      hi: { name: "प्रगति में" },
      ja: { name: "進行中" },
      "zh-CN": { name: "进行中" },
    },
  },
  in_review: {
    id: "in_review" as TaskState,
    localizations: {
      "en-GB": { name: "In Review" },
      ar: { name: "قيد المراجعة" },
      de: { name: "In Prüfung" },
      es: { name: "En revisión" },
      hi: { name: "समीक्षा में" },
      ja: { name: "レビュー中" },
      "zh-CN": { name: "审核中" },
    },
  },
  paused: {
    id: "paused" as TaskState,
    localizations: {
      "en-GB": { name: "Paused" },
      ar: { name: "متوقفة مؤقتاً" },
      de: { name: "Pausiert" },
      es: { name: "Pausada" },
      hi: { name: "रोका गया" },
      ja: { name: "一時停止" },
      "zh-CN": { name: "已暂停" },
    },
  },
  done: {
    id: "done" as TaskState,
    localizations: {
      "en-GB": { name: "Done" },
      ar: { name: "منجزة" },
      de: { name: "Erledigt" },
      es: { name: "Completada" },
      hi: { name: "पूर्ण" },
      ja: { name: "完了" },
      "zh-CN": { name: "已完成" },
    },
  },
  abandoned: {
    id: "abandoned" as TaskState,
    localizations: {
      "en-GB": { name: "Abandoned" },
      ar: { name: "مهجورة" },
      de: { name: "Abgebrochen" },
      es: { name: "Abandonada" },
      hi: { name: "परित्यक्त" },
      ja: { name: "中止" },
      "zh-CN": { name: "已放弃" },
    },
  },
};
