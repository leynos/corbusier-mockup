/** @file Apollo Guidance suggestion fixtures.
 *
 * Four suggestions (sug-01 … sug-03, sug-08) for the
 * apollo-guidance project, spanning high and medium priority.
 */

import { AVA, ELENA, JAMES, MARCUS } from "./assignees";
import type { Suggestion } from "./types";
import { suggestionId, tagId } from "./types";

export const APOLLO_GUIDANCE_SUGGESTIONS: readonly Suggestion[] = [
  {
    id: suggestionId("sug-01"),
    projectSlug: "apollo-guidance",
    localizations: {
      "en-GB": {
        name: "Add circuit breaker to agent backend calls",
        description:
          "Agent backend HTTP calls currently lack a circuit breaker. Adding one would prevent cascade failures when a backend becomes unresponsive, reducing mean recovery time from minutes to seconds.",
      },
      ar: {
        name: "إضافة قاطع دائرة لاستدعاءات الوكيل الخلفي",
        description:
          "تفتقر استدعاءات HTTP للوكيل الخلفي حالياً إلى قاطع دائرة. إضافته ستمنع الأعطال المتتالية عندما يصبح الخادم الخلفي غير مستجيب.",
      },
      de: {
        name: "Circuit Breaker für Agent-Backend-Aufrufe hinzufügen",
        description:
          "HTTP-Aufrufe an Agent-Backends haben derzeit keinen Circuit Breaker. Das Hinzufügen würde Kaskadenfehler verhindern.",
      },
      es: {
        name: "Agregar circuit breaker a llamadas del backend de agentes",
        description:
          "Las llamadas HTTP al backend de agentes carecen de un circuit breaker. Agregarlo evitaría fallos en cascada.",
      },
      hi: {
        name: "एजेंट बैकएंड कॉल में सर्किट ब्रेकर जोड़ें",
        description: "एजेंट बैकएंड HTTP कॉल में वर्तमान में सर्किट ब्रेकर नहीं है। इसे जोड़ने से कैस्केड विफलताएँ रुकेंगी।",
      },
      ja: {
        name: "エージェントバックエンド呼び出しにサーキットブレーカーを追加",
        description:
          "エージェントバックエンドのHTTP呼び出しにサーキットブレーカーがありません。追加するとカスケード障害を防止できます。",
      },
      "zh-CN": {
        name: "为代理后端调用添加熔断器",
        description:
          "代理后端HTTP调用目前缺少熔断器。添加后可防止级联故障，将平均恢复时间从分钟缩短至秒。",
      },
    },
    priority: "high",
    confidence: 94,
    categoryTagIds: [tagId("architecture"), tagId("performance")],
    dependencyLocalizations: {
      "en-GB": { name: "Depends on TASK-1001 (Claude Code SDK backend)" },
      ar: { name: "يعتمد على TASK-1001 (واجهة Claude Code SDK الخلفية)" },
      de: { name: "Hängt von TASK-1001 ab (Claude Code SDK Backend)" },
      es: { name: "Depende de TASK-1001 (backend Claude Code SDK)" },
      hi: { name: "TASK-1001 (Claude Code SDK बैकएंड) पर निर्भर" },
      ja: { name: "TASK-1001（Claude Code SDKバックエンド）に依存" },
      "zh-CN": { name: "依赖 TASK-1001（Claude Code SDK 后端）" },
    },
    estimatedDuration: "3 days",
    suggestedAssignees: [MARCUS, AVA],
  },
  {
    id: suggestionId("sug-02"),
    projectSlug: "apollo-guidance",
    localizations: {
      "en-GB": {
        name: "Enforce tool access audit logging",
        description:
          "The governance layer records policy evaluations but does not capture individual tool invocation decisions. Adding a structured audit trail would satisfy compliance requirements.",
      },
      ar: {
        name: "فرض تسجيل تدقيق الوصول إلى الأدوات",
        description:
          "طبقة الحوكمة تسجل تقييمات السياسة لكنها لا تلتقط قرارات استدعاء الأدوات الفردية.",
      },
      de: {
        name: "Audit-Logging für Tool-Zugriff durchsetzen",
        description:
          "Die Governance-Schicht zeichnet Richtlinienauswertungen auf, erfasst aber keine einzelnen Tool-Aufrufentscheidungen.",
      },
      es: {
        name: "Imponer registro de auditoría de acceso a herramientas",
        description:
          "La capa de gobernanza registra evaluaciones de políticas pero no captura decisiones individuales de invocación de herramientas.",
      },
      hi: {
        name: "उपकरण पहुँच ऑडिट लॉगिंग लागू करें",
        description: "शासन परत नीति मूल्यांकन रिकॉर्ड करती है लेकिन व्यक्तिगत उपकरण आह्वान निर्णय नहीं।",
      },
      ja: {
        name: "ツールアクセス監査ログを義務化",
        description:
          "ガバナンス層はポリシー評価を記録していますが、個々のツール呼び出し決定は捕捉していません。",
      },
      "zh-CN": {
        name: "强制工具访问审计日志",
        description:
          "治理层记录了策略评估，但未捕获单个工具调用决策。添加结构化审计追踪可满足合规要求。",
      },
    },
    priority: "high",
    confidence: 91,
    categoryTagIds: [tagId("governance"), tagId("security")],
    dependencyLocalizations: {
      "en-GB": { name: "Blocked by TASK-1004 (tool access policy evaluator)" },
      ar: { name: "محظور بواسطة TASK-1004 (مقيّم سياسة الوصول للأدوات)" },
      de: { name: "Blockiert durch TASK-1004 (Tool-Zugriffs-Policy-Evaluator)" },
      es: { name: "Bloqueado por TASK-1004 (evaluador de políticas de acceso)" },
      hi: { name: "TASK-1004 (उपकरण पहुँच नीति मूल्यांकनकर्ता) द्वारा अवरुद्ध" },
      ja: { name: "TASK-1004（ツールアクセスポリシー評価器）によりブロック" },
      "zh-CN": { name: "被 TASK-1004（工具访问策略评估器）阻塞" },
    },
    estimatedDuration: "2 days",
    suggestedAssignees: [JAMES],
  },
  {
    id: suggestionId("sug-03"),
    projectSlug: "apollo-guidance",
    localizations: {
      "en-GB": {
        name: "Extract shared hook lifecycle types",
        description:
          "Pre-hook and post-hook runners share a common event shape, but the types are defined inline in separate modules. Extracting a shared interface reduces duplication and simplifies testing.",
      },
      ar: {
        name: "استخراج أنواع دورة حياة الخطاف المشتركة",
        description:
          "يتشارك مشغّلا ما قبل وما بعد الخطاف شكل حدث مشترك، لكن الأنواع معرّفة بشكل مضمّن.",
      },
      de: {
        name: "Gemeinsame Hook-Lifecycle-Typen extrahieren",
        description:
          "Pre-Hook und Post-Hook Runner teilen sich eine gemeinsame Event-Struktur, die Typen sind aber inline definiert.",
      },
      es: {
        name: "Extraer tipos de ciclo de vida de hooks compartidos",
        description:
          "Los ejecutores de pre-hook y post-hook comparten una estructura de evento común, pero los tipos están definidos inline.",
      },
      hi: {
        name: "साझा हुक जीवनचक्र प्रकार निकालें",
        description:
          "प्री-हुक और पोस्ट-हुक रनर एक सामान्य इवेंट आकार साझा करते हैं, लेकिन प्रकार इनलाइन परिभाषित हैं।",
      },
      ja: {
        name: "共有フックライフサイクル型を抽出",
        description:
          "プレフックとポストフックランナーは共通のイベント形状を共有していますが、型はインラインで定義されています。",
      },
      "zh-CN": {
        name: "提取共享钩子生命周期类型",
        description:
          "前置和后置钩子运行器共享通用事件结构，但类型在各模块中内联定义。提取共享接口可减少重复。",
      },
    },
    priority: "medium",
    confidence: 85,
    categoryTagIds: [tagId("architecture"), tagId("tech-debt")],
    dependencyLocalizations: {
      "en-GB": { name: "Related to TASK-1003 (hook execution engine)" },
      ar: { name: "متعلق بـ TASK-1003 (محرك تنفيذ الخطاف)" },
      de: { name: "Bezogen auf TASK-1003 (Hook-Ausführungsengine)" },
      es: { name: "Relacionado con TASK-1003 (motor de ejecución de hooks)" },
      hi: { name: "TASK-1003 (हुक निष्पादन इंजन) से संबंधित" },
      ja: { name: "TASK-1003（フック実行エンジン）に関連" },
      "zh-CN": { name: "与 TASK-1003（钩子执行引擎）相关" },
    },
    estimatedDuration: "1 day",
    suggestedAssignees: [JAMES, MARCUS],
  },
  {
    id: suggestionId("sug-08"),
    projectSlug: "apollo-guidance",
    localizations: {
      "en-GB": {
        name: "Increase unit test coverage for policy evaluator",
        description:
          "The tool access policy evaluator has 62% line coverage. Raising it above 85% would catch edge cases in permission boundary logic before they reach production.",
      },
      ar: {
        name: "زيادة تغطية اختبار الوحدة لمقيّم السياسات",
        description:
          "يبلغ مقيّم سياسة الوصول للأدوات تغطية 62%. رفعها فوق 85% سيلتقط الحالات الحدية.",
      },
      de: {
        name: "Unit-Test-Abdeckung für Policy-Evaluator erhöhen",
        description:
          "Der Tool-Zugriffs-Policy-Evaluator hat 62% Zeilenabdeckung. Eine Erhöhung auf über 85% fängt Grenzfälle ab.",
      },
      es: {
        name: "Aumentar cobertura de tests unitarios del evaluador de políticas",
        description:
          "El evaluador de políticas tiene 62% de cobertura. Elevarla sobre 85% capturaría casos extremos.",
      },
      hi: {
        name: "नीति मूल्यांकनकर्ता के लिए यूनिट टेस्ट कवरेज बढ़ाएँ",
        description: "उपकरण पहुँच नीति मूल्यांकनकर्ता की 62% लाइन कवरेज है। 85% से ऊपर ले जाने से एज केस पकड़ेंगे।",
      },
      ja: {
        name: "ポリシー評価器のユニットテストカバレッジを向上",
        description:
          "ツールアクセスポリシー評価器のカバレッジは62%です。85%以上に引き上げることで権限境界ロジックのエッジケースを捕捉できます。",
      },
      "zh-CN": {
        name: "提高策略评估器的单元测试覆盖率",
        description:
          "工具访问策略评估器的行覆盖率为62%。将其提高到85%以上可在权限边界逻辑到达生产前捕获边缘情况。",
      },
    },
    priority: "medium",
    confidence: 79,
    categoryTagIds: [tagId("testing"), tagId("governance")],
    dependencyLocalizations: {
      "en-GB": { name: "Follows TASK-1004 (tool access policy evaluator)" },
      ar: { name: "يتبع TASK-1004 (مقيّم سياسة الوصول للأدوات)" },
      de: { name: "Folgt auf TASK-1004 (Tool-Zugriffs-Policy-Evaluator)" },
      es: { name: "Sigue a TASK-1004 (evaluador de políticas de acceso)" },
      hi: { name: "TASK-1004 (उपकरण पहुँच नीति मूल्यांकनकर्ता) के बाद" },
      ja: { name: "TASK-1004（ツールアクセスポリシー評価器）の後" },
      "zh-CN": { name: "接续 TASK-1004（工具访问策略评估器）" },
    },
    estimatedDuration: "2 days",
    suggestedAssignees: [ELENA, MARCUS],
  },
];
