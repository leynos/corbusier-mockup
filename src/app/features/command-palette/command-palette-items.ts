/** @file Fixture data for command palette search items, grouped by category. */

import { IconCommand, IconFolder, IconMessage, IconSubtask } from "@tabler/icons-react";

import type { EntityLocalizations } from "../../domain/entities/localization";

export type PaletteItemKind = "task" | "conversation" | "command" | "project";

export interface PaletteItem {
  readonly id: string;
  readonly kind: PaletteItemKind;
  readonly localizations: EntityLocalizations;
  readonly route: string;
  readonly meta?: string;
}

export const paletteItems: readonly PaletteItem[] = [
  /* ── Tasks ───────────────────────────────────────────────────────── */
  {
    id: "TASK-1001",
    kind: "task",
    localizations: {
      "en-GB": { name: "Implement MCP tool registry" },
      ar: { name: "تنفيذ سجل أدوات MCP" },
      de: { name: "MCP-Werkzeugregister implementieren" },
      es: { name: "Implementar registro de herramientas MCP" },
      hi: { name: "MCP उपकरण रजिस्ट्री लागू करें" },
      ja: { name: "MCPツールレジストリを実装する" },
      "zh-CN": { name: "实现 MCP 工具注册表" },
    },
    route: "/tasks/TASK-1001",
    meta: "TASK-1001",
  },
  {
    id: "TASK-1003",
    kind: "task",
    localizations: {
      "en-GB": { name: "Design hook policy engine" },
      ar: { name: "تصميم محرك سياسة الخطافات" },
      de: { name: "Hook-Richtlinienmotor entwerfen" },
      es: { name: "Diseñar motor de políticas de hooks" },
      hi: { name: "हुक नीति इंजन डिज़ाइन करें" },
      ja: { name: "フックポリシーエンジンを設計する" },
      "zh-CN": { name: "设计钩子策略引擎" },
    },
    route: "/tasks/TASK-1003",
    meta: "TASK-1003",
  },
  {
    id: "TASK-1005",
    kind: "task",
    localizations: {
      "en-GB": { name: "Audit RBAC permission matrix" },
      ar: { name: "تدقيق مصفوفة أذونات RBAC" },
      de: { name: "RBAC-Berechtigungsmatrix prüfen" },
      es: { name: "Auditar matriz de permisos RBAC" },
      hi: { name: "RBAC अनुमति मैट्रिक्स ऑडिट करें" },
      ja: { name: "RBAC 権限マトリクスを監査する" },
      "zh-CN": { name: "审计 RBAC 权限矩阵" },
    },
    route: "/tasks/TASK-1005",
    meta: "TASK-1005",
  },

  /* ── Conversations ───────────────────────────────────────────────── */
  {
    id: "conv-deploy",
    kind: "conversation",
    localizations: {
      "en-GB": { name: "Deployment pipeline review" },
      ar: { name: "مراجعة خط أنابيب النشر" },
      de: { name: "Deployment-Pipeline-Überprüfung" },
      es: { name: "Revisión del pipeline de despliegue" },
      hi: { name: "तैनाती पाइपलाइन समीक्षा" },
      ja: { name: "デプロイパイプラインレビュー" },
      "zh-CN": { name: "部署管道审查" },
    },
    route: "/projects/skunkworks-alpha/conversations/CONV-001",
  },
  {
    id: "conv-schema",
    kind: "conversation",
    localizations: {
      "en-GB": { name: "Schema migration planning" },
      ar: { name: "تخطيط ترحيل المخطط" },
      de: { name: "Schema-Migrationsplanung" },
      es: { name: "Planificación de migración de esquema" },
      hi: { name: "स्कीमा माइग्रेशन योजना" },
      ja: { name: "スキーマ移行計画" },
      "zh-CN": { name: "模式迁移规划" },
    },
    route: "/projects/skunkworks-alpha/conversations/CONV-002",
  },

  /* ── Commands ────────────────────────────────────────────────────── */
  {
    id: "cmd-new-task",
    kind: "command",
    localizations: {
      "en-GB": { name: "Create New Task" },
      ar: { name: "إنشاء مهمة جديدة" },
      de: { name: "Neue Aufgabe erstellen" },
      es: { name: "Crear nueva tarea" },
      hi: { name: "नया कार्य बनाएँ" },
      ja: { name: "新しいタスクを作成" },
      "zh-CN": { name: "创建新任务" },
    },
    route: "/tasks",
  },
  {
    id: "cmd-new-directive",
    kind: "command",
    localizations: {
      "en-GB": { name: "New Directive" },
      ar: { name: "توجيه جديد" },
      de: { name: "Neue Direktive" },
      es: { name: "Nueva directiva" },
      hi: { name: "नया निर्देश" },
      ja: { name: "新しいディレクティブ" },
      "zh-CN": { name: "新建指令" },
    },
    route: "/projects/skunkworks-alpha/directives",
  },
  {
    id: "cmd-settings",
    kind: "command",
    localizations: {
      "en-GB": { name: "Open Settings" },
      ar: { name: "فتح الإعدادات" },
      de: { name: "Einstellungen öffnen" },
      es: { name: "Abrir ajustes" },
      hi: { name: "सेटिंग्स खोलें" },
      ja: { name: "設定を開く" },
      "zh-CN": { name: "打开设置" },
    },
    route: "/settings",
  },

  /* ── Projects ────────────────────────────────────────────────────── */
  {
    id: "proj-skunkworks",
    kind: "project",
    localizations: {
      "en-GB": { name: "Skunkworks Alpha" },
      ar: { name: "سكانك ووركس ألفا" },
      de: { name: "Skunkworks Alpha" },
      es: { name: "Skunkworks Alpha" },
      hi: { name: "स्कंकवर्क्स अल्फ़ा" },
      ja: { name: "スカンクワークス・アルファ" },
      "zh-CN": { name: "臭鼬工厂 Alpha" },
    },
    route: "/projects/skunkworks-alpha",
  },
  {
    id: "proj-manhattan",
    kind: "project",
    localizations: {
      "en-GB": { name: "Manhattan Logistics" },
      ar: { name: "مانهاتن للخدمات اللوجستية" },
      de: { name: "Manhattan Logistik" },
      es: { name: "Manhattan Logística" },
      hi: { name: "मैनहट्टन लॉजिस्टिक्स" },
      ja: { name: "マンハッタン・ロジスティクス" },
      "zh-CN": { name: "曼哈顿物流" },
    },
    route: "/projects/manhattan-logistics",
  },
];

/** Icon per palette item kind. */
export const kindIcons: Record<PaletteItemKind, typeof IconSubtask> = {
  task: IconSubtask,
  conversation: IconMessage,
  command: IconCommand,
  project: IconFolder,
};

/** Group labels keyed by PaletteItemKind. */
export const kindLabels: Record<PaletteItemKind, string> = {
  task: "palette-group-tasks",
  conversation: "palette-group-conversations",
  command: "palette-group-commands",
  project: "palette-group-projects",
};
