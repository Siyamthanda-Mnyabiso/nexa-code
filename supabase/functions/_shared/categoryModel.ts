// Category classification and scope-tier labeling.
//
// The client chooses their category directly in the questionnaire (it's a
// simple "what are you looking for?" first step), so there is no inference
// step here. What this module does is:
//   1. validate that a webAppSubtype is only present for web_application
//   2. derive a client-facing "scope tier" label from the answers
//
// Per the approved framework, tiers (Starter/Professional/Advanced) only
// make sense for templated categories. Web Application is sized directly by
// the complexity/effort engines and always labeled "Custom Scope".

import type { ProjectCategory, QuestionnaireAnswers } from "./types.ts";

export function validateCategorySelection(answers: QuestionnaireAnswers): string[] {
  const errors: string[] = [];

  if (answers.category === "web_application" && !answers.webAppSubtype) {
    errors.push("webAppSubtype is required when category is web_application");
  }

  if (answers.category !== "web_application" && answers.webAppSubtype) {
    errors.push("webAppSubtype is only applicable to web_application projects");
  }

  return errors;
}

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  informational: "Informational / Marketing Website",
  ecommerce: "E-commerce Website",
  booking: "Booking / Scheduling Website",
  membership: "Membership / Gated-Content Website",
  web_application: "Web Application",
};

export function categoryLabel(category: ProjectCategory): string {
  return CATEGORY_LABELS[category];
}

/**
 * Derives a client-facing scope tier label. Web Application never gets a
 * tier name — it's always sized as a custom scope directly from the
 * complexity/effort engines.
 */
export function deriveScopeLabel(answers: QuestionnaireAnswers): string {
  if (answers.category === "web_application") {
    return "Custom Scope";
  }

  const pages = answers.pageCount ?? 0;
  const hasAdditionalFeatures =
    Boolean(answers.needsAdminDashboard) ||
    Boolean(answers.needsUserAccounts) ||
    (answers.integrationCount ?? 0) > 0 ||
    Boolean(answers.customAnimation);

  if (answers.category === "informational") {
    if (pages <= 5 && !hasAdditionalFeatures) return "Starter";
    if (pages <= 10) return "Professional";
    return "Advanced";
  }

  if (answers.category === "ecommerce") {
    const catalogue = typeof answers.catalogueSize === "number" ? answers.catalogueSize : 0;
    if (catalogue <= 25 && !answers.isMultiVendor) return "Starter";
    if (catalogue <= 200 && !answers.isMultiVendor) return "Professional";
    return "Advanced";
  }

  if (answers.category === "booking") {
    const providers =
      typeof answers.providerOrResourceCount === "number" ? answers.providerOrResourceCount : 1;
    if (providers <= 1 && !answers.needsRecurringBookings) return "Starter";
    if (providers <= 5) return "Professional";
    return "Advanced";
  }

  if (answers.category === "membership") {
    if (!hasAdditionalFeatures) return "Starter";
    return "Professional";
  }

  return "Professional";
}
