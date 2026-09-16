// Shared types for the Project Quote System engines.
// This is the contract between the public questionnaire and the server-side
// classification/complexity/risk/effort/pricing pipeline.

export type ProjectCategory =
  | "informational"
  | "ecommerce"
  | "booking"
  | "membership"
  | "web_application";

export type WebAppSubtype =
  | "saas"
  | "marketplace"
  | "client_portal"
  | "admin_dashboard"
  | "custom_web_app"
  | "custom_software";

export type BuildModifier = "new_build" | "redesign";
export type DesignModifier = "templated" | "bespoke";

export type ComplexityBand = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
export type RiskBand = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
export type Urgency = "normal" | "accelerated" | "rush";
export type NotSure = "not_sure";

// Raw answers submitted by the client through the adaptive questionnaire.
// Every field is optional because the questionnaire is adaptive — fields
// irrelevant to the chosen category are simply never asked.
export interface QuestionnaireAnswers {
  category: ProjectCategory;
  webAppSubtype?: WebAppSubtype;
  buildModifier: BuildModifier;
  designModifier: DesignModifier;

  // PROJECT / BUSINESS
  projectGoal?: string;
  businessDescription?: string;
  requirementsClarity?: "clear" | "somewhat_vague" | "very_vague";

  // PAGES / DESIGN
  pageCount?: number;
  uniqueLayoutCount?: number;
  hasBrandAssets?: boolean;
  customAnimation?: boolean;

  // FEATURES / FUNCTIONALITY
  needsUserAccounts?: boolean;
  needsAdminDashboard?: boolean;
  needsSearch?: boolean;
  needsFileUploads?: boolean;
  needsRealtime?: boolean;
  userRoleCount?: number;
  coreDataEntityCount?: number;

  // INTEGRATIONS
  integrationCount?: number;
  hasUnknownIntegrations?: boolean;
  hasLegacySystemIntegration?: boolean | NotSure;

  // CONTENT
  hasExistingContent?: boolean;
  needsContentMigration?: boolean;
  contentVolume?: "small" | "medium" | "large" | NotSure;

  // USERS
  estimatedUserVolume?: "small" | "medium" | "large" | NotSure;

  // ADMIN
  whoManagesContentAfterLaunch?: "client" | "nexa_code" | NotSure;

  // PAYMENTS
  needsPayments?: boolean;
  paymentType?: "one_time" | "recurring" | NotSure;
  catalogueSize?: number | NotSure;
  isMultiVendor?: boolean;

  // BOOKING
  needsBooking?: boolean;
  providerOrResourceCount?: number | NotSure;
  needsRecurringBookings?: boolean;
  needsCalendarSync?: boolean;

  // SEO
  seoImportant?: boolean;
  needsAdvancedSeo?: boolean;

  // TIMELINE
  desiredTimelineWeeks?: number;
  urgency?: Urgency;

  // BUDGET
  budgetIndicated?: number | NotSure;

  // TECHNICAL / COMPLIANCE
  hasRegulatoryOrComplianceNeeds?: boolean;
  hasSpecificHostingRequirements?: boolean;
  hasSecurityRequirements?: boolean;
  hasPerformanceRequirements?: boolean;

  // Contact
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
}

export interface ComplexityFactorScore {
  factor: string;
  score: 0 | 1 | 2 | 3;
  weight: number;
  weighted: number;
}

export interface ComplexityResult {
  factors: ComplexityFactorScore[];
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0-100
  band: ComplexityBand;
}

export interface RiskFactorFlag {
  factor: string;
  triggered: boolean;
  weight: number;
}

export interface RiskResult {
  flags: RiskFactorFlag[];
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0-100
  band: RiskBand;
  redFlag: boolean;
  redFlagReasons: string[];
}

export type EffortCategory =
  | "discovery"
  | "uiUx"
  | "frontend"
  | "backend"
  | "database"
  | "integrations"
  | "qa"
  | "seo"
  | "deployment"
  | "projectManagement"
  | "clientCommunication";

export type EffortBreakdown = Record<EffortCategory, number>;

export interface EffortResult {
  breakdown: EffortBreakdown;
  totalHours: number;
}

export interface PricingResult {
  costMidpoint: number;
  rangeWidthPct: number;
  priceLow: number;
  priceHigh: number;
  timelineWeeksLow: number;
  timelineWeeksHigh: number;
  floorApplied: boolean;
}

export interface AssessmentResult {
  category: ProjectCategory;
  webAppSubtype?: WebAppSubtype;
  scopeLabel: string;
  complexity: ComplexityResult;
  risk: RiskResult;
  effort: EffortResult;
  pricing: PricingResult;
}
