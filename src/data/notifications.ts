/** @file Fixture notification entries for the notifications dropdown. */

import type { EntityLocalizations } from "../app/domain/entities/localization";

export type NotificationKind = "task_assigned" | "hook_failure" | "pr_review" | "system_alert";

export interface Notification {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly kind: NotificationKind;
  readonly timestamp: string;
  readonly read: boolean;
}

export const notifications: readonly Notification[] = [
  {
    id: "NOTIF-001",
    kind: "task_assigned",
    timestamp: "2026-03-22T09:15:00Z",
    read: false,
    localizations: {
      "en-GB": { name: "You were assigned to TSK-005: Audit RBAC permission matrix" },
      ar: { name: "تم تعيينك لـ TSK-005: تدقيق مصفوفة أذونات RBAC" },
      de: { name: "Sie wurden TSK-005 zugewiesen: RBAC-Berechtigungsmatrix prüfen" },
      es: { name: "Se le asignó TSK-005: Auditar matriz de permisos RBAC" },
      hi: { name: "आपको TSK-005 सौंपा गया: RBAC अनुमति मैट्रिक्स ऑडिट" },
      ja: { name: "TSK-005 が割り当てられました: RBAC 権限マトリクス監査" },
      "zh-CN": { name: "您已被分配到 TSK-005：审计 RBAC 权限矩阵" },
    },
  },
  {
    id: "NOTIF-002",
    kind: "hook_failure",
    timestamp: "2026-03-22T08:42:00Z",
    read: false,
    localizations: {
      "en-GB": { name: "Pre-commit lint gate failed on branch feature/mcp-registry" },
      ar: { name: "فشل بوابة الفحص قبل الالتزام على فرع feature/mcp-registry" },
      de: { name: "Pre-commit-Lint-Gate fehlgeschlagen auf Branch feature/mcp-registry" },
      es: { name: "Puerta de lint pre-commit falló en rama feature/mcp-registry" },
      hi: { name: "feature/mcp-registry शाखा पर प्री-कमिट लिंट गेट विफल" },
      ja: { name: "feature/mcp-registry ブランチでプリコミットリントゲートが失敗" },
      "zh-CN": { name: "feature/mcp-registry 分支上的预提交 lint 门控失败" },
    },
  },
  {
    id: "NOTIF-003",
    kind: "pr_review",
    timestamp: "2026-03-21T17:30:00Z",
    read: false,
    localizations: {
      "en-GB": { name: "Kenji Tanaka requested your review on PR #142" },
      ar: { name: "طلب كينجي تاناكا مراجعتك على PR #142" },
      de: { name: "Kenji Tanaka hat Ihre Überprüfung für PR #142 angefordert" },
      es: { name: "Kenji Tanaka solicitó su revisión en PR #142" },
      hi: { name: "केंजी तनाका ने PR #142 पर आपकी समीक्षा का अनुरोध किया" },
      ja: { name: "田中健二が PR #142 のレビューをリクエストしました" },
      "zh-CN": { name: "田中健二请求您审查 PR #142" },
    },
  },
  {
    id: "NOTIF-004",
    kind: "system_alert",
    timestamp: "2026-03-21T14:05:00Z",
    read: true,
    localizations: {
      "en-GB": { name: "Agent backend Claude Code SDK reconnected after timeout" },
      ar: { name: "أعاد وكيل Claude Code SDK الاتصال بعد انتهاء المهلة" },
      de: { name: "Agent-Backend Claude Code SDK nach Timeout wiederverbunden" },
      es: { name: "Backend del agente Claude Code SDK reconectado tras timeout" },
      hi: { name: "एजेंट बैकएंड Claude Code SDK टाइमआउट के बाद पुनः कनेक्ट हुआ" },
      ja: { name: "エージェントバックエンド Claude Code SDK がタイムアウト後に再接続" },
      "zh-CN": { name: "代理后端 Claude Code SDK 超时后重新连接" },
    },
  },
  {
    id: "NOTIF-005",
    kind: "task_assigned",
    timestamp: "2026-03-21T11:20:00Z",
    read: true,
    localizations: {
      "en-GB": { name: "New subtask created under TSK-001: Write integration tests" },
      ar: { name: "تم إنشاء مهمة فرعية جديدة ضمن TSK-001: كتابة اختبارات التكامل" },
      de: { name: "Neue Unteraufgabe unter TSK-001 erstellt: Integrationstests schreiben" },
      es: { name: "Nueva subtarea creada bajo TSK-001: Escribir pruebas de integración" },
      hi: { name: "TSK-001 के अंतर्गत नया उपकार्य बनाया गया: एकीकरण परीक्षण लिखें" },
      ja: { name: "TSK-001 の下に新しいサブタスクが作成されました: 統合テストの作成" },
      "zh-CN": { name: "在 TSK-001 下创建了新子任务：编写集成测试" },
    },
  },
  {
    id: "NOTIF-006",
    kind: "pr_review",
    timestamp: "2026-03-20T16:45:00Z",
    read: true,
    localizations: {
      "en-GB": { name: "PR #138 approved by Ava Chen — ready to merge" },
      ar: { name: "تمت الموافقة على PR #138 من قبل آفا تشين — جاهز للدمج" },
      de: { name: "PR #138 von Ava Chen genehmigt — bereit zum Mergen" },
      es: { name: "PR #138 aprobado por Ava Chen — listo para fusionar" },
      hi: { name: "PR #138 अवा चेन द्वारा स्वीकृत — मर्ज के लिए तैयार" },
      ja: { name: "PR #138 がアバ・チェンにより承認されました — マージ可能" },
      "zh-CN": { name: "PR #138 已被 Ava Chen 批准——可以合并" },
    },
  },
];
