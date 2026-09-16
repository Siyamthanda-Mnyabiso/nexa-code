// Minimal server-side input validation/sanitization for questionnaire
// submissions. This runs BEFORE any engine touches the payload — never trust
// data coming from the browser, including its shape.

import type { QuestionnaireAnswers } from "./types.ts";
import { validateCategorySelection } from "./categoryModel.ts";

const CATEGORIES = ["informational", "ecommerce", "booking", "membership", "web_application"];
const SUBTYPES = ["saas", "marketplace", "client_portal", "admin_dashboard", "custom_web_app", "custom_software"];
const BUILD_MODIFIERS = ["new_build", "redesign"];
const DESIGN_MODIFIERS = ["templated", "bespoke"];

const MAX_STRING_LENGTH = 2000;
const MAX_NUMBER = 100000;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function sanitizeString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  return v.slice(0, MAX_STRING_LENGTH).trim();
}

function sanitizeNumber(v: unknown): number | undefined {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return undefined;
  return Math.min(v, MAX_NUMBER);
}

/**
 * Validates and coerces a raw JSON body into QuestionnaireAnswers. Throws
 * with a client-safe message on any structural problem — callers should
 * catch and return a 400 without leaking internals.
 */
export function validateAnswers(raw: unknown): { answers: QuestionnaireAnswers; errors: string[] } {
  if (!isPlainObject(raw)) {
    throw new Error("Request body must be a JSON object");
  }

  const errors: string[] = [];

  const category = typeof raw.category === "string" ? raw.category : undefined;
  if (!category || !CATEGORIES.includes(category)) {
    errors.push("A valid project category is required");
  }

  const webAppSubtype = typeof raw.webAppSubtype === "string" && SUBTYPES.includes(raw.webAppSubtype)
    ? raw.webAppSubtype
    : undefined;

  const buildModifier = typeof raw.buildModifier === "string" && BUILD_MODIFIERS.includes(raw.buildModifier)
    ? raw.buildModifier
    : "new_build";

  const designModifier = typeof raw.designModifier === "string" && DESIGN_MODIFIERS.includes(raw.designModifier)
    ? raw.designModifier
    : "templated";

  const answers = {
    category,
    webAppSubtype,
    buildModifier,
    designModifier,

    projectGoal: sanitizeString(raw.projectGoal),
    businessDescription: sanitizeString(raw.businessDescription),
    requirementsClarity: ["clear", "somewhat_vague", "very_vague"].includes(raw.requirementsClarity as string)
      ? (raw.requirementsClarity as QuestionnaireAnswers["requirementsClarity"])
      : undefined,

    pageCount: sanitizeNumber(raw.pageCount),
    uniqueLayoutCount: sanitizeNumber(raw.uniqueLayoutCount),
    hasBrandAssets: typeof raw.hasBrandAssets === "boolean" ? raw.hasBrandAssets : undefined,
    customAnimation: typeof raw.customAnimation === "boolean" ? raw.customAnimation : undefined,

    needsUserAccounts: typeof raw.needsUserAccounts === "boolean" ? raw.needsUserAccounts : undefined,
    needsAdminDashboard: typeof raw.needsAdminDashboard === "boolean" ? raw.needsAdminDashboard : undefined,
    needsSearch: typeof raw.needsSearch === "boolean" ? raw.needsSearch : undefined,
    needsFileUploads: typeof raw.needsFileUploads === "boolean" ? raw.needsFileUploads : undefined,
    needsRealtime: typeof raw.needsRealtime === "boolean" ? raw.needsRealtime : undefined,
    userRoleCount: sanitizeNumber(raw.userRoleCount),
    coreDataEntityCount: sanitizeNumber(raw.coreDataEntityCount),

    integrationCount: sanitizeNumber(raw.integrationCount),
    hasUnknownIntegrations: typeof raw.hasUnknownIntegrations === "boolean" ? raw.hasUnknownIntegrations : undefined,
    hasLegacySystemIntegration:
      raw.hasLegacySystemIntegration === "not_sure"
        ? "not_sure"
        : typeof raw.hasLegacySystemIntegration === "boolean"
          ? raw.hasLegacySystemIntegration
          : undefined,

    hasExistingContent: typeof raw.hasExistingContent === "boolean" ? raw.hasExistingContent : undefined,
    needsContentMigration: typeof raw.needsContentMigration === "boolean" ? raw.needsContentMigration : undefined,
    contentVolume: ["small", "medium", "large", "not_sure"].includes(raw.contentVolume as string)
      ? (raw.contentVolume as QuestionnaireAnswers["contentVolume"])
      : undefined,

    estimatedUserVolume: ["small", "medium", "large", "not_sure"].includes(raw.estimatedUserVolume as string)
      ? (raw.estimatedUserVolume as QuestionnaireAnswers["estimatedUserVolume"])
      : undefined,

    whoManagesContentAfterLaunch: ["client", "nexa_code", "not_sure"].includes(
      raw.whoManagesContentAfterLaunch as string,
    )
      ? (raw.whoManagesContentAfterLaunch as QuestionnaireAnswers["whoManagesContentAfterLaunch"])
      : undefined,

    needsPayments: typeof raw.needsPayments === "boolean" ? raw.needsPayments : undefined,
    paymentType: ["one_time", "recurring", "not_sure"].includes(raw.paymentType as string)
      ? (raw.paymentType as QuestionnaireAnswers["paymentType"])
      : undefined,
    catalogueSize: raw.catalogueSize === "not_sure" ? "not_sure" : sanitizeNumber(raw.catalogueSize),
    isMultiVendor: typeof raw.isMultiVendor === "boolean" ? raw.isMultiVendor : undefined,

    needsBooking: typeof raw.needsBooking === "boolean" ? raw.needsBooking : undefined,
    providerOrResourceCount:
      raw.providerOrResourceCount === "not_sure" ? "not_sure" : sanitizeNumber(raw.providerOrResourceCount),
    needsRecurringBookings: typeof raw.needsRecurringBookings === "boolean" ? raw.needsRecurringBookings : undefined,
    needsCalendarSync: typeof raw.needsCalendarSync === "boolean" ? raw.needsCalendarSync : undefined,

    seoImportant: typeof raw.seoImportant === "boolean" ? raw.seoImportant : undefined,
    needsAdvancedSeo: typeof raw.needsAdvancedSeo === "boolean" ? raw.needsAdvancedSeo : undefined,

    desiredTimelineWeeks: sanitizeNumber(raw.desiredTimelineWeeks),
    urgency: ["normal", "accelerated", "rush"].includes(raw.urgency as string)
      ? (raw.urgency as QuestionnaireAnswers["urgency"])
      : "normal",

    budgetIndicated: raw.budgetIndicated === "not_sure" ? "not_sure" : sanitizeNumber(raw.budgetIndicated),

    hasRegulatoryOrComplianceNeeds:
      typeof raw.hasRegulatoryOrComplianceNeeds === "boolean" ? raw.hasRegulatoryOrComplianceNeeds : undefined,
    hasSpecificHostingRequirements:
      typeof raw.hasSpecificHostingRequirements === "boolean" ? raw.hasSpecificHostingRequirements : undefined,
    hasSecurityRequirements: typeof raw.hasSecurityRequirements === "boolean" ? raw.hasSecurityRequirements : undefined,
    hasPerformanceRequirements:
      typeof raw.hasPerformanceRequirements === "boolean" ? raw.hasPerformanceRequirements : undefined,

    clientName: sanitizeString(raw.clientName),
    clientEmail: sanitizeString(raw.clientEmail),
    clientPhone: sanitizeString(raw.clientPhone),
    clientCompany: sanitizeString(raw.clientCompany),
  } as QuestionnaireAnswers;

  if (answers.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.clientEmail)) {
    errors.push("A valid email address is required");
  }

  errors.push(...validateCategorySelection(answers));

  return { answers, errors };
}
