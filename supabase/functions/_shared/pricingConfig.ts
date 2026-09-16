// Centralized pricing configuration for the Nexa Code Project Quote System.
//
// ONLY `minProjectPrice` (R8,000) is a confirmed Nexa Code business rule.
// Every other numeric value below is a PLACEHOLDER default so the engines
// have something sensible to run against during development. Each one is
// marked "REQUIRES NEXA CODE INPUT" — replace via the `pricing_config` table
// (never by editing the calculation engines themselves).
//
// This module is only ever imported by Edge Functions running with the
// service role. It must never be imported by, or bundled into, frontend code.

export interface PricingConfig {
  /** Confirmed: absolute floor below which no estimate or quote may go. */
  minProjectPrice: number;

  /** REQUIRES NEXA CODE INPUT — blended hourly rate used to convert hours to cost. */
  blendedHourlyRate: number;

  /** REQUIRES NEXA CODE INPUT — hours per unit, used by the effort engine. */
  baseUnitHours: {
    perPage: number;
    perUniqueLayout: number;
    perCoreDataEntity: number;
    perIntegration: number;
    perUserRole: number;
    discoveryBaseHours: number;
    seoBaseHours: number;
    deploymentBaseHours: number;
  };

  /** REQUIRES NEXA CODE INPUT — % of build hours allocated to QA. */
  qaPercentOfBuild: number;

  /** REQUIRES NEXA CODE INPUT — PM hours per week of estimated project duration. */
  pmHoursPerWeek: number;

  /** REQUIRES NEXA CODE INPUT — client communication hours per week of duration. */
  clientCommHoursPerWeek: number;

  /** REQUIRES NEXA CODE INPUT — multiplier applied to hours by complexity band. */
  complexityMultipliers: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    VERY_HIGH: number;
  };

  /** Range width (as a fraction) applied around the cost midpoint, by risk band. */
  riskRangeWidth: {
    LOW: number; // default 0.15 -> ±15%
    MEDIUM: number; // default 0.225 -> ±20-25%
    HIGH: number; // default 0.325 -> ±30-35%
  };

  /** REQUIRES NEXA CODE INPUT — premiums applied to cost for urgency tiers. */
  urgencyPremium: {
    normal: number; // 0
    accelerated: number;
    rush: number;
  };

  /** REQUIRES NEXA CODE INPUT — hours per week assumed when converting hours to a timeline. */
  deliveryHoursPerWeek: number;

  /** REQUIRES NEXA CODE INPUT — rate charged per additional revision round beyond what's included. */
  additionalRevisionRate: number;

  /** REQUIRES NEXA CODE INPUT — % of total price required as deposit on official quotes. */
  depositPercent: number;

  /** REQUIRES NEXA CODE INPUT — overhead allocation folded into the blended rate/margin. */
  overheadAllocationPercent: number;

  /** REQUIRES NEXA CODE INPUT — target profit margin folded into the blended rate. */
  targetProfitMarginPercent: number;

  /** Rounding increment applied to the final low/high bounds (nearest R). */
  roundingIncrement: number;

  /** Configurable weight (1-3) per complexity factor. See complexityEngine.ts for factor list. */
  complexityWeights: Record<string, number>;

  /** Configurable weight (1-3) per risk factor. See riskEngine.ts for factor list. */
  riskWeights: Record<string, number>;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  minProjectPrice: 8000, // CONFIRMED — do not change without explicit business decision

  blendedHourlyRate: 450, // REQUIRES NEXA CODE INPUT — placeholder only

  baseUnitHours: {
    perPage: 4, // REQUIRES NEXA CODE INPUT
    perUniqueLayout: 3, // REQUIRES NEXA CODE INPUT
    perCoreDataEntity: 6, // REQUIRES NEXA CODE INPUT
    perIntegration: 5, // REQUIRES NEXA CODE INPUT
    perUserRole: 4, // REQUIRES NEXA CODE INPUT
    discoveryBaseHours: 4, // REQUIRES NEXA CODE INPUT
    seoBaseHours: 3, // REQUIRES NEXA CODE INPUT
    deploymentBaseHours: 3, // REQUIRES NEXA CODE INPUT
  },

  qaPercentOfBuild: 0.15, // REQUIRES NEXA CODE INPUT
  pmHoursPerWeek: 2, // REQUIRES NEXA CODE INPUT
  clientCommHoursPerWeek: 1, // REQUIRES NEXA CODE INPUT

  complexityMultipliers: {
    LOW: 1.0,
    MEDIUM: 1.3, // REQUIRES NEXA CODE INPUT
    HIGH: 1.7, // REQUIRES NEXA CODE INPUT
    VERY_HIGH: 2.2, // REQUIRES NEXA CODE INPUT
  },

  riskRangeWidth: {
    LOW: 0.15,
    MEDIUM: 0.225,
    HIGH: 0.325,
  },

  urgencyPremium: {
    normal: 0,
    accelerated: 0.15, // REQUIRES NEXA CODE INPUT
    rush: 0.3, // REQUIRES NEXA CODE INPUT
  },

  deliveryHoursPerWeek: 20, // REQUIRES NEXA CODE INPUT — effective billable hours/week on a project

  additionalRevisionRate: 500, // REQUIRES NEXA CODE INPUT
  depositPercent: 0.4, // REQUIRES NEXA CODE INPUT
  overheadAllocationPercent: 0.1, // REQUIRES NEXA CODE INPUT — informational; folded into blendedHourlyRate later
  targetProfitMarginPercent: 0.2, // REQUIRES NEXA CODE INPUT — informational; folded into blendedHourlyRate later

  roundingIncrement: 500,

  // Weights reflect how much each factor historically drives rework/time.
  // Starting values are reasonable defaults — tune from real project data
  // once a handful of estimates have been compared against actuals.
  complexityWeights: {
    pageCount: 1,
    uniqueLayouts: 2,
    uiUxComplexity: 2,
    frontendComplexity: 2,
    backendComplexity: 2,
    databaseComplexity: 2,
    authentication: 1,
    userRoles: 2,
    adminFunctionality: 2,
    payments: 2,
    bookingLogic: 2,
    apiIntegrations: 2,
    ecommerceComplexity: 2,
    customBusinessLogic: 3,
    automation: 2,
    notifications: 1,
    searchFiltering: 1,
    fileUploads: 1,
    realtime: 3,
    securityRequirements: 2,
    performanceRequirements: 2,
    seoRequirements: 1,
    contentMigration: 2,
    existingSystemIntegration: 2,
    deploymentRequirements: 1,
  },

  riskWeights: {
    vagueRequirements: 3,
    unknownApis: 2,
    complexIntegrations: 2,
    legacySystems: 2,
    paymentProcessing: 1,
    largeCatalogue: 1,
    migration: 2,
    customBusinessLogic: 2,
    multipleRoles: 1,
    regulatorySecurity: 3,
    missingContent: 1,
    unknownTechnicalRequirements: 2,
  },
};
