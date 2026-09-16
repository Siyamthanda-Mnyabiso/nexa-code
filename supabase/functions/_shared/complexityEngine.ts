// Complexity engine — scores HOW TECHNICALLY HARD a project is.
//
// Deliberately separate from the risk engine (riskEngine.ts), which scores
// how UNCERTAIN the outcome is. Complexity feeds effort estimation; risk
// feeds the estimate range width. Conflating them produces estimates that
// are either falsely confident or uselessly wide.

import type { ComplexityBand, ComplexityFactorScore, ComplexityResult, QuestionnaireAnswers } from "./types.ts";
import type { PricingConfig } from "./pricingConfig.ts";

type FactorScorer = (a: QuestionnaireAnswers) => 0 | 1 | 2 | 3;

const FACTOR_SCORERS: Record<string, FactorScorer> = {
  pageCount: (a) => {
    const pages = a.pageCount ?? 0;
    if (pages <= 5) return 0;
    if (pages <= 10) return 1;
    if (pages <= 20) return 2;
    return 3;
  },
  uniqueLayouts: (a) => {
    const layouts = a.uniqueLayoutCount ?? 1;
    if (layouts <= 2) return 0;
    if (layouts <= 5) return 1;
    if (layouts <= 9) return 2;
    return 3;
  },
  uiUxComplexity: (a) => (a.customAnimation ? (a.designModifier === "bespoke" ? 3 : 2) : 0),
  frontendComplexity: (a) =>
    a.category === "web_application" ? (a.needsRealtime ? 3 : 2) : a.customAnimation ? 1 : 0,
  backendComplexity: (a) => {
    if (a.category !== "web_application") return a.needsPayments || a.needsBooking ? 1 : 0;
    const roles = a.userRoleCount ?? 1;
    if (roles <= 1) return 1;
    if (roles <= 3) return 2;
    return 3;
  },
  databaseComplexity: (a) => {
    const entities = a.coreDataEntityCount ?? 1;
    if (entities <= 1) return 0;
    if (entities <= 3) return 1;
    if (entities <= 6) return 2;
    return 3;
  },
  authentication: (a) => (a.needsUserAccounts ? ((a.userRoleCount ?? 1) > 1 ? 2 : 1) : 0),
  userRoles: (a) => {
    const roles = a.userRoleCount ?? (a.needsUserAccounts ? 1 : 0);
    if (roles <= 1) return 0;
    if (roles === 2) return 1;
    if (roles === 3) return 2;
    return 3;
  },
  adminFunctionality: (a) => (a.needsAdminDashboard ? 2 : 0),
  payments: (a) => (a.needsPayments ? (a.paymentType === "recurring" ? 2 : 1) : 0),
  bookingLogic: (a) => {
    if (!a.needsBooking) return 0;
    const providers = typeof a.providerOrResourceCount === "number" ? a.providerOrResourceCount : 1;
    let score: 0 | 1 | 2 | 3 = providers > 1 ? 2 : 1;
    if (a.needsRecurringBookings || a.needsCalendarSync) score = 3;
    return score;
  },
  apiIntegrations: (a) => {
    const count = a.integrationCount ?? 0;
    if (count === 0) return 0;
    if (count <= 1) return 1;
    if (count <= 3) return 2;
    return 3;
  },
  ecommerceComplexity: (a) => {
    if (a.category !== "ecommerce") return 0;
    if (a.isMultiVendor) return 3;
    const catalogue = typeof a.catalogueSize === "number" ? a.catalogueSize : 0;
    if (catalogue <= 25) return 0;
    if (catalogue <= 100) return 1;
    return 2;
  },
  customBusinessLogic: (a) =>
    a.category === "web_application" ? (a.webAppSubtype === "custom_software" ? 3 : 2) : 0,
  automation: (a) => (a.needsRealtime || a.needsCalendarSync ? 1 : 0),
  notifications: (a) => (a.needsBooking || a.needsPayments || a.needsUserAccounts ? 1 : 0),
  searchFiltering: (a) => (a.needsSearch ? 2 : 0),
  fileUploads: (a) => (a.needsFileUploads ? 1 : 0),
  realtime: (a) => (a.needsRealtime ? 3 : 0),
  securityRequirements: (a) => (a.hasSecurityRequirements ? 2 : 0) as 0 | 2,
  performanceRequirements: (a) => (a.hasPerformanceRequirements ? 2 : 0) as 0 | 2,
  seoRequirements: (a) => (a.needsAdvancedSeo ? 2 : a.seoImportant ? 1 : 0),
  contentMigration: (a) => {
    if (!a.needsContentMigration) return 0;
    if (a.contentVolume === "large") return 3;
    if (a.contentVolume === "medium") return 2;
    if (a.contentVolume === "not_sure") return 2;
    return 1;
  },
  existingSystemIntegration: (a) => (a.hasLegacySystemIntegration === true ? 3 : a.hasLegacySystemIntegration === "not_sure" ? 2 : 0),
  deploymentRequirements: (a) => (a.hasSpecificHostingRequirements ? 2 : 0) as 0 | 2,
};

function bandFromNormalizedScore(normalized: number): ComplexityBand {
  if (normalized < 25) return "LOW";
  if (normalized < 50) return "MEDIUM";
  if (normalized < 75) return "HIGH";
  return "VERY_HIGH";
}

export function scoreComplexity(
  answers: QuestionnaireAnswers,
  config: PricingConfig,
): ComplexityResult {
  const factors: ComplexityFactorScore[] = [];
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const [factor, scorer] of Object.entries(FACTOR_SCORERS)) {
    const weight = config.complexityWeights[factor] ?? 1;
    const score = scorer(answers);
    const weighted = score * weight;

    factors.push({ factor, score, weight, weighted });
    totalScore += weighted;
    maxPossibleScore += 3 * weight;
  }

  const normalizedScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  return {
    factors,
    totalScore,
    maxPossibleScore,
    normalizedScore,
    band: bandFromNormalizedScore(normalizedScore),
  };
}
