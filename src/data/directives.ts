/** @file Directive fixture data: slash command definitions.
 *
 * Each directive carries its own `EntityLocalizations` for display
 * strings. Parameter descriptions and template bodies are not
 * localised — they are developer-facing, code-adjacent content.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";

/* ── Types ─────────────────────────────────────────────────────────── */

/** One parameter definition exposed by a slash directive. */
export interface DirectiveParameter {
  /** Command-line style parameter name without leading dashes. */
  readonly name: string;
  /** Human-readable type description for the parameter value. */
  readonly type: string;
  /** Whether callers must provide this parameter. */
  readonly required: boolean;
  /** Developer-facing explanation of how the parameter is used. */
  readonly description: string;
}

/** One slash-command directive available in the directives registry. */
export interface Directive {
  /** Stable string identifier for routing and rendering keys. */
  readonly id: string;
  /** Localized directive name and summary text. */
  readonly localizations: EntityLocalizations;
  /** Supported parameters rendered in the registry card. */
  readonly parameters: readonly DirectiveParameter[];
  /** Template string showing the directive's invocation shape. */
  readonly template: string;
  /** Example expansions shown in the card disclosure content. */
  readonly exampleExpansions: readonly string[];
}

/* ── Fixture data ──────────────────────────────────────────────────── */

export const DIRECTIVES: readonly Directive[] = [
  {
    id: "dir-task",
    localizations: {
      "en-GB": { name: "/task", description: "Create or update a task in the current project" },
      ar: { name: "/task", description: "إنشاء أو تحديث مهمة في المشروع الحالي" },
      de: {
        name: "/task",
        description: "Aufgabe im aktuellen Projekt erstellen oder aktualisieren",
      },
      es: { name: "/task", description: "Crear o actualizar una tarea en el proyecto actual" },
      hi: { name: "/task", description: "वर्तमान प्रोजेक्ट में कार्य बनाएँ या अपडेट करें" },
      ja: { name: "/task", description: "現在のプロジェクトでタスクを作成または更新" },
      "zh-CN": { name: "/task", description: "在当前项目中创建或更新任务" },
    },
    parameters: [
      { name: "title", type: "string", required: true, description: "Task title" },
      {
        name: "priority",
        type: "low | medium | high | critical",
        required: false,
        description: "Task priority level",
      },
      { name: "assignee", type: "string", required: false, description: "Team member to assign" },
    ],
    template: '/task --title "$title" --priority $priority --assignee $assignee',
    exampleExpansions: [
      '/task --title "Migrate auth to OAuth 2.0" --priority high --assignee "Ava Chen"',
    ],
  },
  {
    id: "dir-review",
    localizations: {
      "en-GB": { name: "/review", description: "Request a code review from an agent backend" },
      ar: { name: "/review", description: "طلب مراجعة كود من وكيل خلفي" },
      de: { name: "/review", description: "Code-Review von einem Agent-Backend anfordern" },
      es: { name: "/review", description: "Solicitar revisión de código de un backend de agente" },
      hi: { name: "/review", description: "एजेंट बैकएंड से कोड समीक्षा का अनुरोध करें" },
      ja: { name: "/review", description: "エージェントバックエンドにコードレビューを依頼" },
      "zh-CN": { name: "/review", description: "向代理后端请求代码审查" },
    },
    parameters: [
      { name: "branch", type: "string", required: true, description: "Branch name to review" },
      { name: "scope", type: "full | diff", required: false, description: "Review scope" },
      { name: "focus", type: "string", required: false, description: "Areas to focus on" },
    ],
    template: "/review --branch $branch --scope $scope --focus $focus",
    exampleExpansions: [
      '/review --branch "feature/pgbouncer" --scope diff --focus "security,performance"',
    ],
  },
  {
    id: "dir-deploy",
    localizations: {
      "en-GB": {
        name: "/deploy",
        description: "Trigger a deployment to the specified environment",
      },
      ar: { name: "/deploy", description: "بدء عملية نشر إلى البيئة المحددة" },
      de: { name: "/deploy", description: "Deployment in die angegebene Umgebung auslösen" },
      es: { name: "/deploy", description: "Disparar un despliegue al entorno especificado" },
      hi: { name: "/deploy", description: "निर्दिष्ट वातावरण में डिप्लॉयमेंट ट्रिगर करें" },
      ja: { name: "/deploy", description: "指定された環境へのデプロイをトリガー" },
      "zh-CN": { name: "/deploy", description: "触发部署到指定环境" },
    },
    parameters: [
      {
        name: "env",
        type: "staging | production",
        required: true,
        description: "Target environment",
      },
      { name: "tag", type: "string", required: false, description: "Release tag" },
      {
        name: "dry-run",
        type: "boolean",
        required: false,
        description: "Preview without applying",
      },
    ],
    template: "/deploy --env $env --tag $tag --dry-run $dry-run",
    exampleExpansions: [
      "/deploy --env staging --tag v2.3.1 --dry-run true",
      "/deploy --env production --tag v2.3.1",
    ],
  },
  {
    id: "dir-search",
    localizations: {
      "en-GB": { name: "/search", description: "Search the codebase for patterns or symbols" },
      ar: { name: "/search", description: "البحث في قاعدة الكود عن أنماط أو رموز" },
      de: { name: "/search", description: "Codebasis nach Mustern oder Symbolen durchsuchen" },
      es: { name: "/search", description: "Buscar patrones o símbolos en el código fuente" },
      hi: { name: "/search", description: "कोडबेस में पैटर्न या प्रतीकों की खोज करें" },
      ja: { name: "/search", description: "コードベースでパターンやシンボルを検索" },
      "zh-CN": { name: "/search", description: "在代码库中搜索模式或符号" },
    },
    parameters: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Search query or regex pattern",
      },
      { name: "type", type: "text | symbol | file", required: false, description: "Search type" },
      { name: "path", type: "string", required: false, description: "Restrict to path" },
    ],
    template: "/search --query $query --type $type --path $path",
    exampleExpansions: ['/search --query "authenticate" --type symbol --path "src/middleware/"'],
  },
  {
    id: "dir-status",
    localizations: {
      "en-GB": { name: "/status", description: "Display the current agent and task status" },
      ar: { name: "/status", description: "عرض حالة الوكيل والمهمة الحالية" },
      de: { name: "/status", description: "Aktuellen Agent- und Aufgabenstatus anzeigen" },
      es: { name: "/status", description: "Mostrar el estado actual del agente y la tarea" },
      hi: { name: "/status", description: "वर्तमान एजेंट और कार्य स्थिति प्रदर्शित करें" },
      ja: { name: "/status", description: "現在のエージェントとタスクのステータスを表示" },
      "zh-CN": { name: "/status", description: "显示当前代理和任务状态" },
    },
    parameters: [
      { name: "verbose", type: "boolean", required: false, description: "Show detailed status" },
    ],
    template: "/status --verbose $verbose",
    exampleExpansions: ["/status", "/status --verbose true"],
  },
  {
    id: "dir-rollback",
    localizations: {
      "en-GB": { name: "/rollback", description: "Revert the last agent action or file change" },
      ar: { name: "/rollback", description: "التراجع عن آخر إجراء للوكيل أو تغيير ملف" },
      de: {
        name: "/rollback",
        description: "Letzte Agent-Aktion oder Dateiänderung rückgängig machen",
      },
      es: {
        name: "/rollback",
        description: "Revertir la última acción del agente o cambio de archivo",
      },
      hi: { name: "/rollback", description: "अंतिम एजेंट क्रिया या फ़ाइल परिवर्तन वापस लें" },
      ja: {
        name: "/rollback",
        description: "最後のエージェントアクションまたはファイル変更を元に戻す",
      },
      "zh-CN": { name: "/rollback", description: "撤销最后一次代理操作或文件更改" },
    },
    parameters: [
      {
        name: "steps",
        type: "number",
        required: false,
        description: "Number of actions to revert",
      },
      {
        name: "confirm",
        type: "boolean",
        required: false,
        description: "Skip confirmation prompt",
      },
    ],
    template: "/rollback --steps $steps --confirm $confirm",
    exampleExpansions: ["/rollback --steps 1", "/rollback --steps 3 --confirm true"],
  },
];

/** Find a directive by its ID. */
export function findDirective(id: string): Directive | undefined {
  return DIRECTIVES.find((d) => d.id === id);
}
