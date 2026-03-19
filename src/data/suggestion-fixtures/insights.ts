/** @file AI insight observation fixtures.
 *
 * Six insights covering schedule forecasts, blocked-task warnings,
 * and velocity trends. All display strings live in `localizations`
 * maps with 7-locale translations.
 */

import { type AiInsight, aiInsightId } from "./types";

export const AI_INSIGHTS: readonly AiInsight[] = [
  {
    id: aiInsightId("ins-01"),
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
    id: aiInsightId("ins-02"),
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
    id: aiInsightId("ins-03"),
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
    id: aiInsightId("ins-04"),
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
    id: aiInsightId("ins-05"),
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
    id: aiInsightId("ins-06"),
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
