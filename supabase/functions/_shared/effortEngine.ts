// Effort estimation engine.
//
// Hours = BaseUnitHours × UnitCount × ComplexityMultiplier
//
// All base-unit-hour values and the complexity multiplier table come from
// pricing_config (see pricingConfig.ts) — nothing here is a hardcoded
// business number. Project Management and Client Communication scale with
// estimated project DURATION rather than feature count, since a longer
// project accrues more standups/status updates regardless of how "big" the
// feature list is.

import type { EffortBreakdown, EffortResult, QuestionnaireAnswers } from "./types.ts";
import type { ComplexityBand } from "./types.ts";
import type { PricingConfig } from "./pricingConfig.ts";

export function estimateEffort(
  answers: QuestionnaireAnswers,
  complexityBand: ComplexityBand,
  config: PricingConfig,
): EffortResult {
  const multiplier = config.complexityMultipliers[complexityBand];
  const units = config.baseUnitHours;

  const pages = answers.pageCount ?? (answers.category === "web_application" ? 0 : 1);
  const uniqueLayouts = answers.uniqueLayoutCount ?? 1;
  const entities = answers.coreDataEntityCount ?? (answers.category === "web_application" ? 1 : 0);
  const roles = answers.userRoleCount ?? (answers.needsUserAccounts ? 1 : 0);
  const integrations = answers.integrationCount ?? 0;

  const discovery =
    units.discoveryBaseHours *
    (answers.buildModifier === "redesign" ? 1.5 : 1) *
    (answers.requirementsClarity === "very_vague" ? 1.5 : 1);

  const uiUx = uniqueLayouts * units.perUniqueLayout * multiplier;
  const frontend = pages * units.perPage * multiplier;
  const backend = (entities * units.perCoreDataEntity * 0.6 + roles * units.perUserRole) * multiplier;
  const database = entities * units.perCoreDataEntity * 0.4 * multiplier;
  const integrationsHours = integrations * units.perIntegration * multiplier;

  const seo = (answers.seoImportant ? units.seoBaseHours : 0) + (answers.needsAdvancedSeo ? units.seoBaseHours : 0);
  const deployment = units.deploymentBaseHours * (answers.hasSpecificHostingRequirements ? 1.5 : 1);

  const buildSubtotal = uiUx + frontend + backend + database + integrationsHours;
  const qa = buildSubtotal * config.qaPercentOfBuild;

  const coreHours = discovery + buildSubtotal + qa + seo + deployment;
  const estimatedWeeks = Math.max(1, Math.ceil(coreHours / config.deliveryHoursPerWeek));

  const projectManagement = config.pmHoursPerWeek * estimatedWeeks;
  const clientCommunication = config.clientCommHoursPerWeek * estimatedWeeks;

  const breakdown: EffortBreakdown = {
    discovery,
    uiUx,
    frontend,
    backend,
    database,
    integrations: integrationsHours,
    qa,
    seo,
    deployment,
    projectManagement,
    clientCommunication,
  };

  const totalHours = Object.values(breakdown).reduce((sum, h) => sum + h, 0);

  return { breakdown, totalHours };
}
