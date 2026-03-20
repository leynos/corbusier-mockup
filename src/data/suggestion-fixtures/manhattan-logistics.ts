/** @file Manhattan Logistics suggestion fixtures.
 *
 * Three suggestions (sug-04, sug-05, sug-09) for the
 * manhattan-logistics project, spanning medium and low priority.
 */

import { PRIYA, TOMAS } from "./assignees";
import type { Suggestion } from "./types";
import { suggestionId, tagId } from "./types";

export const MANHATTAN_LOGISTICS_SUGGESTIONS: readonly Suggestion[] = [
  {
    id: suggestionId("sug-04"),
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
    id: suggestionId("sug-05"),
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
    id: suggestionId("sug-09"),
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
];
