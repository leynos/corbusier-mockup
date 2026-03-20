/** @file Skunkworks Alpha suggestion fixtures.
 *
 * Three suggestions (sug-06, sug-07, sug-10) for the
 * skunkworks-alpha project, spanning high, medium, and low priority.
 */

import { ELENA, JAMES, TOMAS } from "./assignees";
import type { Suggestion } from "./types";
import { suggestionId, tagId } from "./types";

export const SKUNKWORKS_ALPHA_SUGGESTIONS: readonly Suggestion[] = [
  {
    id: suggestionId("sug-06"),
    projectSlug: "skunkworks-alpha",
    localizations: {
      "en-GB": {
        name: "Automate tenant namespace cleanup on deprovisioning",
        description:
          "When a tenant is deprovisioned, orphaned resources remain in the namespace. Adding automated cleanup prevents resource leaks and reduces infrastructure costs.",
      },
      ar: {
        name: "أتمتة تنظيف مساحة اسم المستأجر عند إلغاء التزويد",
        description:
          "عند إلغاء تزويد مستأجر، تبقى موارد يتيمة في مساحة الاسم. الأتمتة ستمنع تسرب الموارد.",
      },
      de: {
        name: "Automatische Namespace-Bereinigung bei Tenant-Deprovisionierung",
        description:
          "Bei der Deprovisionierung bleiben verwaiste Ressourcen im Namespace. Automatische Bereinigung verhindert Ressourcen-Lecks.",
      },
      es: {
        name: "Automatizar limpieza de namespace al desaprovisionar tenant",
        description:
          "Cuando un tenant se desaprovisiona, quedan recursos huérfanos. La automatización evitaría fugas de recursos.",
      },
      hi: {
        name: "डिप्रोविज़निंग पर टेनेंट नेमस्पेस क्लीनअप स्वचालित करें",
        description:
          "जब टेनेंट डिप्रोविज़न होता है, तो अनाथ संसाधन नेमस्पेस में बने रहते हैं। स्वचालन से संसाधन रिसाव रुकेगा।",
      },
      ja: {
        name: "テナントデプロビジョニング時の名前空間クリーンアップを自動化",
        description:
          "テナントがデプロビジョニングされると、孤立リソースが名前空間に残ります。自動クリーンアップでリソースリークを防止できます。",
      },
      "zh-CN": {
        name: "在租户取消配置时自动清理命名空间",
        description:
          "当租户取消配置时，孤立资源留在命名空间中。添加自动清理可防止资源泄漏并降低基础设施成本。",
      },
    },
    priority: "high",
    confidence: 92,
    categoryTagIds: [tagId("automation"), tagId("governance")],
    dependencyLocalizations: {
      "en-GB": { name: "Extends TASK-1012 (tenant onboarding automation)" },
      ar: { name: "يمتد من TASK-1012 (أتمتة إعداد المستأجرين)" },
      de: { name: "Erweitert TASK-1012 (Tenant-Onboarding-Automatisierung)" },
      es: { name: "Extiende TASK-1012 (automatización de onboarding de tenant)" },
      hi: { name: "TASK-1012 (टेनेंट ऑनबोर्डिंग ऑटोमेशन) का विस्तार" },
      ja: { name: "TASK-1012（テナントオンボーディング自動化）を拡張" },
      "zh-CN": { name: "扩展 TASK-1012（租户入驻自动化）" },
    },
    estimatedDuration: "2 days",
    suggestedAssignees: [TOMAS, JAMES],
  },
  {
    id: suggestionId("sug-07"),
    projectSlug: "skunkworks-alpha",
    localizations: {
      "en-GB": {
        name: "Add cross-tenant request tracing headers",
        description:
          "Distributed tracing does not propagate tenant context across service boundaries. Adding a trace header would accelerate root cause analysis for cross-tenant issues.",
      },
      ar: {
        name: "إضافة رؤوس تتبع الطلبات عبر المستأجرين",
        description:
          "لا ينشر التتبع الموزع سياق المستأجر عبر حدود الخدمات. إضافة رأس تتبع سيسرع التحليل.",
      },
      de: {
        name: "Cross-Tenant-Request-Tracing-Header hinzufügen",
        description:
          "Distributed Tracing propagiert keinen Tenant-Kontext über Servicegrenzen. Ein Trace-Header beschleunigt die Ursachenanalyse.",
      },
      es: {
        name: "Agregar encabezados de rastreo de solicitudes cross-tenant",
        description:
          "El rastreo distribuido no propaga contexto de tenant. Agregar un encabezado aceleraría el análisis de causa raíz.",
      },
      hi: {
        name: "क्रॉस-टेनेंट अनुरोध ट्रेसिंग हेडर जोड़ें",
        description:
          "डिस्ट्रीब्यूटेड ट्रेसिंग सेवा सीमाओं के पार टेनेंट संदर्भ प्रसारित नहीं करती। ट्रेस हेडर जोड़ने से मूल कारण विश्लेषण तेज होगा।",
      },
      ja: {
        name: "クロステナントリクエストトレーシングヘッダーを追加",
        description:
          "分散トレーシングはサービス境界を越えてテナントコンテキストを伝播しません。トレースヘッダーの追加で根本原因分析が加速します。",
      },
      "zh-CN": {
        name: "添加跨租户请求追踪头",
        description: "分布式追踪未跨服务边界传播租户上下文。添加追踪头可加速跨租户问题的根因分析。",
      },
    },
    priority: "medium",
    confidence: 83,
    categoryTagIds: [tagId("observability"), tagId("architecture")],
    dependencyLocalizations: {
      "en-GB": { name: "Depends on TASK-1011 (tenant isolation boundaries)" },
      ar: { name: "يعتمد على TASK-1011 (حدود عزل المستأجرين)" },
      de: { name: "Hängt von TASK-1011 ab (Tenant-Isolationsgrenzen)" },
      es: { name: "Depende de TASK-1011 (límites de aislamiento de tenant)" },
      hi: { name: "TASK-1011 (टेनेंट आइसोलेशन बाउंड्री) पर निर्भर" },
      ja: { name: "TASK-1011（テナント分離境界）に依存" },
      "zh-CN": { name: "依赖 TASK-1011（租户隔离边界）" },
    },
    estimatedDuration: "3 days",
    suggestedAssignees: [TOMAS],
  },
  {
    id: suggestionId("sug-10"),
    projectSlug: "skunkworks-alpha",
    localizations: {
      "en-GB": {
        name: "Add integration test for tenant provisioning flow",
        description:
          "The tenant provisioning flow has no end-to-end integration test. Adding one would verify that namespace creation, default policy seeding, and agent registration complete without errors.",
      },
      ar: {
        name: "إضافة اختبار تكامل لتدفق تزويد المستأجرين",
        description:
          "لا يوجد اختبار تكامل شامل لتدفق تزويد المستأجرين. إضافته سيتحقق من اكتمال العملية.",
      },
      de: {
        name: "Integrationstest für Tenant-Provisioning-Flow hinzufügen",
        description:
          "Der Tenant-Provisioning-Flow hat keinen End-to-End-Integrationstest. Ein Test stellt sicher, dass alles fehlerfrei abläuft.",
      },
      es: {
        name: "Agregar test de integración para flujo de aprovisionamiento de tenant",
        description:
          "El flujo de aprovisionamiento no tiene test de integración. Agregarlo verificaría que la creación completa sin errores.",
      },
      hi: {
        name: "टेनेंट प्रोविज़निंग फ्लो के लिए इंटीग्रेशन टेस्ट जोड़ें",
        description:
          "टेनेंट प्रोविज़निंग फ्लो में कोई एंड-टू-एंड इंटीग्रेशन टेस्ट नहीं है। इसे जोड़ने से प्रक्रिया की सत्यापना होगी।",
      },
      ja: {
        name: "テナントプロビジョニングフローの統合テストを追加",
        description:
          "テナントプロビジョニングフローにエンドツーエンドの統合テストがありません。追加することでプロセスの検証が可能になります。",
      },
      "zh-CN": {
        name: "为租户配置流程添加集成测试",
        description:
          "租户配置流程没有端到端集成测试。添加后可验证命名空间创建、默认策略种子和代理注册均无错误完成。",
      },
    },
    priority: "low",
    confidence: 68,
    categoryTagIds: [tagId("testing"), tagId("automation")],
    dependencyLocalizations: {
      "en-GB": { name: "Depends on TASK-1012 (tenant onboarding automation)" },
      ar: { name: "يعتمد على TASK-1012 (أتمتة إعداد المستأجرين)" },
      de: { name: "Hängt von TASK-1012 ab (Tenant-Onboarding-Automatisierung)" },
      es: { name: "Depende de TASK-1012 (automatización de onboarding de tenant)" },
      hi: { name: "TASK-1012 (टेनेंट ऑनबोर्डिंग ऑटोमेशन) पर निर्भर" },
      ja: { name: "TASK-1012（テナントオンボーディング自動化）に依存" },
      "zh-CN": { name: "依赖 TASK-1012（租户入驻自动化）" },
    },
    estimatedDuration: "2 days",
    suggestedAssignees: [ELENA],
  },
];
