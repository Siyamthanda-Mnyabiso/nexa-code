// Deterministic pricing engine.
//
// This is the ONLY place a price is calculated. It never receives a
// client-submitted price and never lets one influence the result — the
// caller passes only hours/risk/urgency derived server-side by the other
// engines. The R8,000 floor is enforced here, unconditionally, as the last
// step before rounding.

import type { PricingResult, RiskBand, Urgency } from "./types.ts";
import type { PricingConfig } from "./pricingConfig.ts";
import { rangeWidthForBand } from "./riskEngine.ts";

function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

export function calculatePricing(
  totalHours: number,
  riskBand: RiskBand,
  urgency: Urgency,
  config: PricingConfig,
): PricingResult {
  const urgencyMultiplier = 1 + (config.urgencyPremium[urgency] ?? 0);
  const costMidpoint = totalHours * config.blendedHourlyRate * urgencyMultiplier;

  const rangeWidthPct = rangeWidthForBand(riskBand, config);

  let low = costMidpoint * (1 - rangeWidthPct);
  let high = costMidpoint * (1 + rangeWidthPct);

  let floorApplied = false;
  if (low < config.minProjectPrice) {
    low = config.minProjectPrice;
    floorApplied = true;
  }
  if (high < config.minProjectPrice) {
    high = config.minProjectPrice;
    floorApplied = true;
  }

  low = roundToIncrement(low, config.roundingIncrement);
  high = roundToIncrement(high, config.roundingIncrement);

  if (high < low) {
    high = low;
  }

  const timelineWeeksLow = Math.max(1, Math.round(totalHours / config.deliveryHoursPerWeek));
  const timelineWeeksHigh = Math.max(
    timelineWeeksLow,
    Math.ceil((totalHours * (1 + rangeWidthPct)) / config.deliveryHoursPerWeek),
  );

  return {
    costMidpoint,
    rangeWidthPct,
    priceLow: low,
    priceHigh: high,
    timelineWeeksLow,
    timelineWeeksHigh,
    floorApplied,
  };
}
