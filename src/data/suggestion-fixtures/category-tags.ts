/** @file Category tag descriptor registry for AI suggestions.
 *
 * Eight tag IDs with 7-locale translations. Tags are
 * suggestion-specific and not shared with other entity types.
 */

import type { EntityLocalizations } from "../../app/domain/entities/localization";

const CATEGORY_TAGS_BY_ID = {
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
} satisfies Record<string, EntityLocalizations>;

export type CategoryTagId = keyof typeof CATEGORY_TAGS_BY_ID;

export const CATEGORY_TAGS: Record<CategoryTagId, EntityLocalizations> = CATEGORY_TAGS_BY_ID;
