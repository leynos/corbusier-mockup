/** @file AI suggestion and insight fixture data.
 *
 * Defines the `Suggestion` and `AiInsight` entity types and provides
 * 10 suggestion fixtures across all three priority levels and all
 * three projects, plus 6 AI insight observations. All entity display
 * strings live in `localizations` maps per the data-model-driven card
 * architecture spec.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import type { ProjectSlug } from "./registries/project-descriptors";
import type { Assignee } from "./tasks";

/* -- Tag ID type --------------------------------------------------------- */

export type TagId = string & { readonly brand: "TagId" };

export function tagId(id: string): TagId {
  return id as TagId;
}

/* -- Suggestion ---------------------------------------------------------- */

export type SuggestionPriority = "high" | "medium" | "low";

export interface Suggestion {
  readonly id: string;
  readonly projectSlug: ProjectSlug;
  readonly localizations: EntityLocalizations;
  readonly priority: SuggestionPriority;
  readonly confidence: number;
  readonly categoryTagIds: readonly TagId[];
  readonly dependencyLocalizations: EntityLocalizations;
  readonly estimatedDuration: string;
  readonly suggestedAssignees: readonly Assignee[];
}

/* -- AI insight ---------------------------------------------------------- */

export type InsightSeverity = "info" | "warning" | "critical";

export interface AiInsight {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly severity: InsightSeverity;
}

/* -- Category tag descriptors -------------------------------------------- */

export const CATEGORY_TAGS: Record<string, EntityLocalizations> = {
  performance: {
    "en-GB": { name: "Performance" },
    ar: { name: "الأداء" },
    de: { name: "Leistung" },
    es: { name: "Rendimiento" },
    hi: { name: "प्रदर्शन" },
    ja: { name: "パフォーマンス" },
    "zh-CN": { name: "性能" },
  },
  security: {
    "en-GB": { name: "Security" },
    ar: { name: "الأمان" },
    de: { name: "Sicherheit" },
    es: { name: "Seguridad" },
    hi: { name: "सुरक्षा" },
    ja: { name: "セキュリティ" },
    "zh-CN": { name: "安全" },
  },
  architecture: {
    "en-GB": { name: "Architecture" },
    ar: { name: "الهندسة المعمارية" },
    de: { name: "Architektur" },
    es: { name: "Arquitectura" },
    hi: { name: "आर्किटेक्चर" },
    ja: { name: "アーキテクチャ" },
    "zh-CN": { name: "架构" },
  },
  testing: {
    "en-GB": { name: "Testing" },
    ar: { name: "الاختبار" },
    de: { name: "Tests" },
    es: { name: "Pruebas" },
    hi: { name: "परीक्षण" },
    ja: { name: "テスト" },
    "zh-CN": { name: "测试" },
  },
  observability: {
    "en-GB": { name: "Observability" },
    ar: { name: "المراقبة" },
    de: { name: "Observability" },
    es: { name: "Observabilidad" },
    hi: { name: "अवलोकनशीलता" },
    ja: { name: "オブザーバビリティ" },
    "zh-CN": { name: "可观测性" },
  },
  governance: {
    "en-GB": { name: "Governance" },
    ar: { name: "الحوكمة" },
    de: { name: "Governance" },
    es: { name: "Gobernanza" },
    hi: { name: "शासन" },
    ja: { name: "ガバナンス" },
    "zh-CN": { name: "治理" },
  },
  "tech-debt": {
    "en-GB": { name: "Tech Debt" },
    ar: { name: "الديون التقنية" },
    de: { name: "Tech Debt" },
    es: { name: "Deuda Técnica" },
    hi: { name: "टेक ऋण" },
    ja: { name: "技術的負債" },
    "zh-CN": { name: "技术债务" },
  },
  automation: {
    "en-GB": { name: "Automation" },
    ar: { name: "الأتمتة" },
    de: { name: "Automatisierung" },
    es: { name: "Automatización" },
    hi: { name: "स्वचालन" },
    ja: { name: "自動化" },
    "zh-CN": { name: "自动化" },
  },
};

/* -- Assignee pool ------------------------------------------------------- */

const AVA: Assignee = { name: "Ava Chen", initials: "AC", role: "Tech Lead" };
const MARCUS: Assignee = { name: "Marcus Webb", initials: "MW", role: "Backend Eng" };
const PRIYA: Assignee = { name: "Priya Sharma", initials: "PS", role: "Frontend Eng" };
const TOMAS: Assignee = { name: "Tomás Herrera", initials: "TH", role: "DevOps Eng" };
const ELENA: Assignee = { name: "Elena Rossi", initials: "ER", role: "QA Engineer" };
const JAMES: Assignee = { name: "James Okafor", initials: "JO", role: "Platform Eng" };

/* -- Fixture suggestions ------------------------------------------------- */

export const SUGGESTIONS: readonly Suggestion[] = [
  {
    id: "sug-01",
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
    id: "sug-02",
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
    id: "sug-03",
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
    id: "sug-04",
    projectSlug: "manhattan-logistics",
    localizations: {
      "en-GB": {
        name: "Add retry logic to SSE reconnection",
        description:
          "The current SSE client reconnects immediately on disconnect. Adding exponential back-off with jitter would prevent thundering-herd reconnection storms during backend restarts.",
      },
      ar: {
        name: "إضافة منطق إعادة المحاولة لإعادة اتصال SSE",
        description:
          "يعيد عميل SSE الحالي الاتصال فوراً عند الانقطاع. إضافة تراجع أسي مع تشويش سيمنع عواصف إعادة الاتصال.",
      },
      de: {
        name: "Retry-Logik für SSE-Wiederverbindung hinzufügen",
        description:
          "Der aktuelle SSE-Client verbindet sich sofort bei Trennung. Exponentielles Backoff mit Jitter verhindert Reconnection-Stürme.",
      },
      es: {
        name: "Agregar lógica de reintento a reconexión SSE",
        description:
          "El cliente SSE actual se reconecta inmediatamente. Agregar back-off exponencial evitaría tormentas de reconexión.",
      },
      hi: {
        name: "SSE पुनःसंयोजन में पुनः प्रयास तर्क जोड़ें",
        description:
          "वर्तमान SSE क्लाइंट डिस्कनेक्ट पर तुरंत पुनः कनेक्ट होता है। एक्सपोनेंशियल बैक-ऑफ जोड़ने से तूफानी पुनःकनेक्शन रुकेंगे।",
      },
      ja: {
        name: "SSE再接続にリトライロジックを追加",
        description:
          "現在のSSEクライアントは切断時に即座に再接続します。指数バックオフとジッターを追加すると、再接続ストームを防止できます。",
      },
      "zh-CN": {
        name: "为SSE重连添加重试逻辑",
        description:
          "当前SSE客户端在断开后立即重连。添加指数退避和抖动可防止后端重启时的重连风暴。",
      },
    },
    priority: "medium",
    confidence: 88,
    categoryTagIds: [tagId("performance"), tagId("architecture")],
    dependencyLocalizations: {
      "en-GB": { name: "Follows TASK-1005 (SSE streaming for agent turns)" },
      ar: { name: "يتبع TASK-1005 (بث SSE لأدوار الوكيل)" },
      de: { name: "Folgt auf TASK-1005 (SSE-Streaming für Agent-Turns)" },
      es: { name: "Sigue a TASK-1005 (streaming SSE para turnos de agentes)" },
      hi: { name: "TASK-1005 (एजेंट टर्न के लिए SSE स्ट्रीमिंग) के बाद" },
      ja: { name: "TASK-1005（エージェントターンのSSEストリーミング）の後" },
      "zh-CN": { name: "接续 TASK-1005（代理轮次的SSE流）" },
    },
    estimatedDuration: "2 days",
    suggestedAssignees: [TOMAS],
  },
  {
    id: "sug-05",
    projectSlug: "manhattan-logistics",
    localizations: {
      "en-GB": {
        name: "Add keyboard shortcut overlay to conversation detail",
        description:
          "Power users navigating conversation threads would benefit from a keyboard shortcut reference. A discoverable overlay would reduce time to first productive action.",
      },
      ar: {
        name: "إضافة طبقة اختصارات لوحة المفاتيح لتفاصيل المحادثة",
        description:
          "سيستفيد المستخدمون المتقدمون من مرجع اختصارات لوحة المفاتيح في سلاسل المحادثة.",
      },
      de: {
        name: "Tastaturkürzel-Overlay für Konversationsdetails hinzufügen",
        description:
          "Power-User in Konversationsthreads würden von einer Tastaturkürzel-Referenz profitieren.",
      },
      es: {
        name: "Agregar superposición de atajos de teclado al detalle de conversación",
        description:
          "Los usuarios avanzados se beneficiarían de una referencia de atajos de teclado en hilos de conversación.",
      },
      hi: {
        name: "वार्तालाप विवरण में कीबोर्ड शॉर्टकट ओवरले जोड़ें",
        description: "पावर उपयोगकर्ताओं को वार्तालाप थ्रेड में कीबोर्ड शॉर्टकट संदर्भ से लाभ होगा।",
      },
      ja: {
        name: "会話詳細にキーボードショートカットオーバーレイを追加",
        description:
          "会話スレッドを操作するパワーユーザーにキーボードショートカットリファレンスが役立ちます。",
      },
      "zh-CN": {
        name: "为对话详情添加键盘快捷键浮层",
        description:
          "高级用户在浏览对话线程时将受益于键盘快捷键参考。可发现的浮层将缩短首次高效操作的时间。",
      },
    },
    priority: "low",
    confidence: 72,
    categoryTagIds: [tagId("architecture")],
    dependencyLocalizations: {
      "en-GB": { name: "Related to TASK-1006 (conversation thread UI)" },
      ar: { name: "متعلق بـ TASK-1006 (واجهة سلسلة المحادثة)" },
      de: { name: "Bezogen auf TASK-1006 (Konversationsthread-UI)" },
      es: { name: "Relacionado con TASK-1006 (UI de hilo de conversación)" },
      hi: { name: "TASK-1006 (वार्तालाप थ्रेड UI) से संबंधित" },
      ja: { name: "TASK-1006（会話スレッドUI）に関連" },
      "zh-CN": { name: "与 TASK-1006（对话线程UI）相关" },
    },
    estimatedDuration: "1 day",
    suggestedAssignees: [PRIYA],
  },
  {
    id: "sug-06",
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
    id: "sug-07",
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
    id: "sug-08",
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
  {
    id: "sug-09",
    projectSlug: "manhattan-logistics",
    localizations: {
      "en-GB": {
        name: "Add loading skeleton to Kanban column transitions",
        description:
          "When tasks move between Kanban columns, there is a flash of empty state. Adding skeleton placeholders would smooth the visual transition and reduce perceived latency.",
      },
      ar: {
        name: "إضافة هيكل تحميل لانتقالات عمود كانبان",
        description:
          "عند نقل المهام بين أعمدة كانبان، يظهر وميض فارغ. إضافة عناصر نائبة هيكلية ستنعم الانتقال البصري.",
      },
      de: {
        name: "Lade-Skeleton für Kanban-Spaltenübergänge hinzufügen",
        description:
          "Beim Verschieben von Tasks zwischen Kanban-Spalten gibt es einen leeren Blitz. Skeleton-Platzhalter glätten den visuellen Übergang.",
      },
      es: {
        name: "Agregar skeleton de carga a transiciones de columnas Kanban",
        description:
          "Al mover tareas entre columnas Kanban hay un destello vacío. Placeholders skeleton suavizarían la transición.",
      },
      hi: {
        name: "कानबन कॉलम ट्रांजिशन में लोडिंग स्केलेटन जोड़ें",
        description:
          "जब टास्क कानबन कॉलम के बीच जाते हैं, खाली स्थिति की चमक होती है। स्केलेटन प्लेसहोल्डर दृश्य संक्रमण को सुचारू करेंगे।",
      },
      ja: {
        name: "カンバン列遷移にローディングスケルトンを追加",
        description:
          "タスクがカンバン列間を移動する際、空状態のフラッシュが発生します。スケルトンプレースホルダーで視覚的遷移をスムーズにできます。",
      },
      "zh-CN": {
        name: "为看板列过渡添加加载骨架",
        description:
          "当任务在看板列间移动时，会出现空状态闪烁。添加骨架占位符可平滑视觉过渡并减少感知延迟。",
      },
    },
    priority: "low",
    confidence: 76,
    categoryTagIds: [tagId("performance")],
    dependencyLocalizations: {
      "en-GB": { name: "Related to TASK-1013 (Kanban drag-and-drop)" },
      ar: { name: "متعلق بـ TASK-1013 (سحب وإفلات كانبان)" },
      de: { name: "Bezogen auf TASK-1013 (Kanban Drag-and-Drop)" },
      es: { name: "Relacionado con TASK-1013 (arrastrar y soltar Kanban)" },
      hi: { name: "TASK-1013 (कानबन ड्रैग-एंड-ड्रॉप) से संबंधित" },
      ja: { name: "TASK-1013（カンバンドラッグ＆ドロップ）に関連" },
      "zh-CN": { name: "与 TASK-1013（看板拖放）相关" },
    },
    estimatedDuration: "1 day",
    suggestedAssignees: [PRIYA],
  },
  {
    id: "sug-10",
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

/* -- Fixture AI insights ------------------------------------------------- */

export const AI_INSIGHTS: readonly AiInsight[] = [
  {
    id: "ins-01",
    localizations: {
      "en-GB": {
        name: "Sprint velocity trending downward",
        description:
          "Velocity has decreased 18% over the past 3 sprints. Consider reviewing scope commitments.",
      },
      ar: {
        name: "سرعة السبرنت في اتجاه هبوطي",
        description: "انخفضت السرعة بنسبة 18% خلال الأسبرنتات الثلاثة الماضية.",
      },
      de: {
        name: "Sprint-Velocity mit Abwärtstrend",
        description: "Die Velocity ist in den letzten 3 Sprints um 18% gesunken.",
      },
      es: {
        name: "Velocidad del sprint en tendencia bajista",
        description: "La velocidad ha disminuido un 18% en los últimos 3 sprints.",
      },
      hi: {
        name: "स्प्रिंट वेलोसिटी गिरावट की ओर",
        description: "पिछले 3 स्प्रिंट में वेलोसिटी 18% कम हुई है।",
      },
      ja: {
        name: "スプリント速度が低下傾向",
        description:
          "過去3スプリントで速度が18%低下しています。スコープコミットメントの見直しを検討してください。",
      },
      "zh-CN": {
        name: "迭代速度呈下降趋势",
        description: "过去3个迭代中速度下降了18%。建议审查范围承诺。",
      },
    },
    severity: "warning",
  },
  {
    id: "ins-02",
    localizations: {
      "en-GB": {
        name: "Three tasks blocked for over 5 days",
        description:
          "TASK-1003, TASK-1004, and TASK-1012 have been blocked for more than 5 business days. Clearing blockers would unblock 8 story points.",
      },
      ar: {
        name: "ثلاث مهام محظورة لأكثر من 5 أيام",
        description: "TASK-1003 وTASK-1004 وTASK-1012 محظورة لأكثر من 5 أيام عمل.",
      },
      de: {
        name: "Drei Aufgaben seit über 5 Tagen blockiert",
        description: "TASK-1003, TASK-1004 und TASK-1012 sind seit über 5 Werktagen blockiert.",
      },
      es: {
        name: "Tres tareas bloqueadas por más de 5 días",
        description: "TASK-1003, TASK-1004 y TASK-1012 llevan más de 5 días hábiles bloqueadas.",
      },
      hi: {
        name: "तीन कार्य 5 दिनों से अधिक समय से अवरुद्ध",
        description: "TASK-1003, TASK-1004 और TASK-1012 5 कार्यदिवसों से अधिक समय से अवरुद्ध हैं।",
      },
      ja: {
        name: "3つのタスクが5日以上ブロック中",
        description: "TASK-1003、TASK-1004、TASK-1012が5営業日以上ブロックされています。",
      },
      "zh-CN": {
        name: "三项任务被阻塞超过5天",
        description:
          "TASK-1003、TASK-1004和TASK-1012已被阻塞超过5个工作日。解除阻塞将释放8个故事点。",
      },
    },
    severity: "critical",
  },
  {
    id: "ins-03",
    localizations: {
      "en-GB": {
        name: "Agent backend error rate within normal range",
        description:
          "Claude Code SDK error rate is 0.3% and Codex CLI is 0.1% — both within the 1% threshold.",
      },
      ar: {
        name: "معدل خطأ الوكيل الخلفي ضمن النطاق الطبيعي",
        description: "معدل خطأ Claude Code SDK هو 0.3% وCodex CLI هو 0.1%.",
      },
      de: {
        name: "Agent-Backend-Fehlerrate im Normalbereich",
        description:
          "Claude Code SDK Fehlerrate 0,3%, Codex CLI 0,1% — beide unter dem 1%-Schwellenwert.",
      },
      es: {
        name: "Tasa de error de backend de agentes en rango normal",
        description: "La tasa de error de Claude Code SDK es 0,3% y Codex CLI es 0,1%.",
      },
      hi: {
        name: "एजेंट बैकएंड त्रुटि दर सामान्य सीमा में",
        description: "Claude Code SDK त्रुटि दर 0.3% और Codex CLI 0.1% — दोनों 1% सीमा के भीतर।",
      },
      ja: {
        name: "エージェントバックエンドのエラー率は正常範囲内",
        description:
          "Claude Code SDKのエラー率は0.3%、Codex CLIは0.1% — どちらも1%のしきい値内です。",
      },
      "zh-CN": {
        name: "代理后端错误率在正常范围内",
        description: "Claude Code SDK错误率为0.3%，Codex CLI为0.1%——均在1%阈值内。",
      },
    },
    severity: "info",
  },
  {
    id: "ins-04",
    localizations: {
      "en-GB": {
        name: "High-priority task completion rate is 40%",
        description:
          "Only 2 of 5 high-priority tasks are on track. Consider redistributing workload or adjusting deadlines.",
      },
      ar: {
        name: "معدل إكمال المهام عالية الأولوية 40%",
        description: "مهمتان فقط من 5 مهام عالية الأولوية في المسار الصحيح.",
      },
      de: {
        name: "Abschlussrate hochprioritärer Aufgaben bei 40%",
        description: "Nur 2 von 5 hochprioritären Aufgaben sind auf Kurs.",
      },
      es: {
        name: "Tasa de completitud de tareas de alta prioridad es 40%",
        description: "Solo 2 de 5 tareas de alta prioridad van por buen camino.",
      },
      hi: {
        name: "उच्च-प्राथमिकता कार्य पूर्णता दर 40%",
        description: "5 में से केवल 2 उच्च-प्राथमिकता कार्य ट्रैक पर हैं।",
      },
      ja: {
        name: "高優先タスクの完了率は40%",
        description:
          "5つの高優先タスクのうち2つのみが順調です。ワークロードの再分配を検討してください。",
      },
      "zh-CN": {
        name: "高优先级任务完成率为40%",
        description: "5项高优先级任务中仅2项按计划进行。建议重新分配工作量或调整截止日期。",
      },
    },
    severity: "warning",
  },
  {
    id: "ins-05",
    localizations: {
      "en-GB": {
        name: "Skunkworks-Alpha nearing delivery milestone",
        description:
          "Tenant isolation (TASK-1011) is 80% complete. Completion this week would unblock the onboarding automation track.",
      },
      ar: {
        name: "Skunkworks-Alpha يقترب من معلم التسليم",
        description: "عزل المستأجرين (TASK-1011) مكتمل بنسبة 80%.",
      },
      de: {
        name: "Skunkworks-Alpha nähert sich dem Liefermeilenstein",
        description: "Tenant-Isolation (TASK-1011) ist zu 80% abgeschlossen.",
      },
      es: {
        name: "Skunkworks-Alpha cerca del hito de entrega",
        description: "El aislamiento de tenant (TASK-1011) está completado al 80%.",
      },
      hi: {
        name: "Skunkworks-Alpha डिलीवरी मील का पत्थर के करीब",
        description: "टेनेंट आइसोलेशन (TASK-1011) 80% पूर्ण है।",
      },
      ja: {
        name: "Skunkworks-Alphaがデリバリーマイルストーンに接近",
        description:
          "テナント分離（TASK-1011）は80%完了しています。今週完了するとオンボーディング自動化のブロックが解除されます。",
      },
      "zh-CN": {
        name: "Skunkworks-Alpha接近交付里程碑",
        description: "租户隔离（TASK-1011）已完成80%。本周完成将解除入驻自动化的阻塞。",
      },
    },
    severity: "info",
  },
  {
    id: "ins-06",
    localizations: {
      "en-GB": {
        name: "Frontend test coverage below team target",
        description:
          "Manhattan-Logistics frontend coverage is at 54%, below the 70% team threshold. The conversation UI module has the largest gap.",
      },
      ar: {
        name: "تغطية اختبار الواجهة الأمامية أقل من هدف الفريق",
        description: "تغطية واجهة Manhattan-Logistics الأمامية 54%، أقل من عتبة الفريق 70%.",
      },
      de: {
        name: "Frontend-Testabdeckung unter Team-Ziel",
        description:
          "Manhattan-Logistics Frontend-Abdeckung liegt bei 54%, unter der 70%-Schwelle des Teams.",
      },
      es: {
        name: "Cobertura de tests frontend por debajo del objetivo del equipo",
        description:
          "La cobertura frontend de Manhattan-Logistics es del 54%, por debajo del 70% del equipo.",
      },
      hi: {
        name: "फ्रंटएंड टेस्ट कवरेज टीम लक्ष्य से नीचे",
        description: "Manhattan-Logistics फ्रंटएंड कवरेज 54% पर है, 70% टीम थ्रेशोल्ड से नीचे।",
      },
      ja: {
        name: "フロントエンドテストカバレッジがチーム目標以下",
        description:
          "Manhattan-Logisticsのフロントエンドカバレッジは54%で、チームの70%しきい値を下回っています。",
      },
      "zh-CN": {
        name: "前端测试覆盖率低于团队目标",
        description: "Manhattan-Logistics前端覆盖率为54%，低于团队70%的阈值。对话UI模块差距最大。",
      },
    },
    severity: "warning",
  },
];
