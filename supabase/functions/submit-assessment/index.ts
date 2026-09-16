// POST /submit-assessment
//
// Public endpoint (anon key). Receives raw questionnaire answers, runs the
// full server-side pipeline (classification -> complexity -> risk -> effort
// -> pricing), persists a quote_requests row, and returns ONLY client-safe
// fields. No internal score, weight, hour breakdown, or formula ever leaves
// this function.

import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { getSupabaseAdmin, loadPricingConfig } from "../_shared/supabaseAdmin.ts";
import { validateAnswers } from "../_shared/validateAnswers.ts";
import { categoryLabel, deriveScopeLabel } from "../_shared/categoryModel.ts";
import { scoreComplexity } from "../_shared/complexityEngine.ts";
import { scoreRisk } from "../_shared/riskEngine.ts";
import { estimateEffort } from "../_shared/effortEngine.ts";
import { calculatePricing } from "../_shared/pricingEngine.ts";

const CONSULTATION_REQUIRED_MESSAGE =
  "Your project requires a more detailed consultation before we can provide a meaningful estimate.";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  let validated;
  try {
    validated = validateAnswers(body);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 400);
  }

  const { answers, errors } = validated;
  if (errors.length > 0) {
    return jsonResponse({ error: "Invalid submission", details: errors }, 400);
  }

  const config = await loadPricingConfig();

  const complexity = scoreComplexity(answers, config);
  const risk = scoreRisk(answers, complexity, config);

  const supabase = getSupabaseAdmin();

  // Red flag: persist the brief for the sales team, but never compute/show a price.
  if (risk.redFlag) {
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        client_name: answers.clientName,
        client_email: answers.clientEmail,
        client_phone: answers.clientPhone,
        client_company: answers.clientCompany,
        category: answers.category,
        web_app_subtype: answers.webAppSubtype ?? null,
        build_modifier: answers.buildModifier,
        design_modifier: answers.designModifier,
        questionnaire: answers,
        complexity_score: complexity.normalizedScore,
        complexity_band: complexity.band,
        risk_score: risk.normalizedScore,
        risk_band: risk.band,
        red_flag: true,
        red_flag_reasons: risk.redFlagReasons,
        status: "NEEDS_REVIEW",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to persist red-flag quote_request", error);
      return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
    }

    return jsonResponse({
      requestId: data.id,
      redFlag: true,
      message: CONSULTATION_REQUIRED_MESSAGE,
    });
  }

  const effort = estimateEffort(answers, complexity.band, config);
  const pricing = calculatePricing(effort.totalHours, risk.band, answers.urgency ?? "normal", config);
  const scopeLabel = deriveScopeLabel(answers);

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      client_name: answers.clientName,
      client_email: answers.clientEmail,
      client_phone: answers.clientPhone,
      client_company: answers.clientCompany,
      category: answers.category,
      web_app_subtype: answers.webAppSubtype ?? null,
      build_modifier: answers.buildModifier,
      design_modifier: answers.designModifier,
      questionnaire: answers,
      complexity_score: complexity.normalizedScore,
      complexity_band: complexity.band,
      risk_score: risk.normalizedScore,
      risk_band: risk.band,
      red_flag: false,
      red_flag_reasons: [],
      estimated_hours: effort.breakdown,
      estimated_price_low: pricing.priceLow,
      estimated_price_high: pricing.priceHigh,
      estimated_timeline_weeks_low: pricing.timelineWeeksLow,
      estimated_timeline_weeks_high: pricing.timelineWeeksHigh,
      status: "ASSESSED",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to persist quote_request", error);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }

  return jsonResponse({
    requestId: data.id,
    redFlag: false,
    projectType: categoryLabel(answers.category),
    projectScope: scopeLabel,
    estimatedTimeline: {
      low: pricing.timelineWeeksLow,
      high: pricing.timelineWeeksHigh,
    },
    estimatedInvestment: {
      low: pricing.priceLow,
      high: pricing.priceHigh,
    },
    disclaimer:
      "Your estimate is based on the requirements provided. The final project quotation will be confirmed after a consultation where we review your scope, requirements and deliverables in detail.",
  });
});
