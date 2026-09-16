// Risk engine — scores HOW UNCERTAIN a project's outcome is.
//
// Separate from complexityEngine.ts on purpose (see that file's header).
// Risk affects the ESTIMATE RANGE WIDTH, never the point estimate directly —
// widening the range is more honest than silently padding a number, and the
// disclosed midpoint should never move just because risk is high.
//
// This module also owns the "red flag" decision: when risk crosses a
// threshold, or specific hard-stop conditions are met, the caller should
// skip pricing entirely and route to "requires consultation".

import type {
  ComplexityResult,
  QuestionnaireAnswers,
  RiskBand,
  RiskFactorFlag,
  RiskResult,
} from "./types.ts";
import type { PricingConfig } from "./pricingConfig.ts";

type FactorFlagger = (a: QuestionnaireAnswers) => boolean;

const NOT_SURE = "not_sure";

function countNotSureAnswers(a: QuestionnaireAnswers): number {
  const notSureFields = [
    a.hasLegacySystemIntegration,
    a.contentVolume,
    a.estimatedUserVolume,
    a.whoManagesContentAfterLaunch,
    a.paymentType,
    a.catalogueSize,
    a.providerOrResourceCount,
    a.budgetIndicated,
  ];
  return notSureFields.filter((v) => v === NOT_SURE).length;
}

const FACTOR_FLAGGERS: Record<string, FactorFlagger> = {
  vagueRequirements: (a) => a.requirementsClarity === "very_vague" || countNotSureAnswers(a) >= 3,
  unknownApis: (a) => Boolean(a.hasUnknownIntegrations),
  complexIntegrations: (a) => (a.integrationCount ?? 0) >= 3,
  legacySystems: (a) => a.hasLegacySystemIntegration === true || a.hasLegacySystemIntegration === NOT_SURE,
  paymentProcessing: (a) => Boolean(a.needsPayments),
  largeCatalogue: (a) =>
    a.category === "ecommerce" && (a.catalogueSize === NOT_SURE || (typeof a.catalogueSize === "number" && a.catalogueSize > 200)),
  migration: (a) => Boolean(a.needsContentMigration) && (a.contentVolume === "large" || a.contentVolume === NOT_SURE),
  customBusinessLogic: (a) => a.category === "web_application" && a.webAppSubtype === "custom_software",
  multipleRoles: (a) => (a.userRoleCount ?? 0) >= 3,
  regulatorySecurity: (a) => Boolean(a.hasRegulatoryOrComplianceNeeds),
  missingContent: (a) => a.hasExistingContent === false,
  unknownTechnicalRequirements: (a) => a.hasSpecificHostingRequirements === undefined && a.category === "web_application",
};

function bandFromNormalizedScore(normalized: number): RiskBand {
  if (normalized < 25) return "LOW";
  if (normalized < 50) return "MEDIUM";
  if (normalized < 70) return "HIGH";
  return "VERY_HIGH";
}

export function rangeWidthForBand(band: RiskBand, config: PricingConfig): number {
  if (band === "LOW") return config.riskRangeWidth.LOW;
  if (band === "MEDIUM") return config.riskRangeWidth.MEDIUM;
  // HIGH and VERY_HIGH share the widest configured bound; VERY_HIGH should
  // normally be intercepted by the red-flag check before pricing runs at all.
  return config.riskRangeWidth.HIGH;
}

/**
 * Hard-stop conditions per the approved framework §11/§12. These trigger
 * "requires consultation" regardless of the numeric risk score, because no
 * amount of range-widening makes the estimate meaningful in these cases.
 */
function evaluateRedFlags(
  answers: QuestionnaireAnswers,
  complexity: ComplexityResult,
  riskBand: RiskBand,
): string[] {
  const reasons: string[] = [];

  if (answers.requirementsClarity === "very_vague") {
    reasons.push("Requirements are too vague to size confidently.");
  }
  if (countNotSureAnswers(answers) >= 3) {
    reasons.push("Multiple key requirements are marked as unknown.");
  }
  if (answers.category === "web_application" && (complexity.band === "HIGH" || complexity.band === "VERY_HIGH")) {
    reasons.push("This is a high-complexity custom application.");
  }
  if (answers.hasUnknownIntegrations) {
    reasons.push("One or more required integrations are not yet identified.");
  }
  if (answers.hasRegulatoryOrComplianceNeeds) {
    reasons.push("The project involves regulatory or compliance requirements.");
  }
  if (
    answers.category === "web_application" &&
    (answers.webAppSubtype === "marketplace" || answers.webAppSubtype === "saas") &&
    complexity.band !== "LOW"
  ) {
    reasons.push("Marketplace/SaaS platforms of this scope need a detailed discovery conversation.");
  }
  if (answers.hasLegacySystemIntegration === true || answers.hasLegacySystemIntegration === NOT_SURE) {
    reasons.push("Integration with an existing/legacy system needs to be reviewed directly.");
  }
  if (answers.needsContentMigration && (answers.contentVolume === "large" || answers.contentVolume === NOT_SURE)) {
    reasons.push("A large or not-yet-assessed content migration is involved.");
  }
  if (answers.category === "ecommerce" && answers.catalogueSize === NOT_SURE) {
    reasons.push("Catalogue size and data quality are not yet known.");
  }
  if (riskBand === "VERY_HIGH") {
    reasons.push("Overall project uncertainty is too high for a reliable range.");
  }

  return reasons;
}

export function scoreRisk(
  answers: QuestionnaireAnswers,
  complexity: ComplexityResult,
  config: PricingConfig,
): RiskResult {
  const flags: RiskFactorFlag[] = [];
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const [factor, flagger] of Object.entries(FACTOR_FLAGGERS)) {
    const weight = config.riskWeights[factor] ?? 1;
    const triggered = flagger(answers);

    flags.push({ factor, triggered, weight });
    totalScore += triggered ? weight : 0;
    maxPossibleScore += weight;
  }

  const normalizedScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  const band = bandFromNormalizedScore(normalizedScore);
  const redFlagReasons = evaluateRedFlags(answers, complexity, band);

  return {
    flags,
    totalScore,
    maxPossibleScore,
    normalizedScore,
    band,
    redFlag: redFlagReasons.length > 0,
    redFlagReasons,
  };
}
