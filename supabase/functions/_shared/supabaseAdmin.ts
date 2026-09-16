// Service-role Supabase client for use inside Edge Functions only.
// Never import this from frontend code — the service role key must never
// reach the browser bundle.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "./pricingConfig.ts";

export function getSupabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Loads pricing config from the `pricing_config` table, falling back to
 * DEFAULT_PRICING_CONFIG for any field not yet set by Nexa Code. This is the
 * only place the pricing engines should read financial variables from.
 */
export async function loadPricingConfig(): Promise<PricingConfig> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("pricing_config")
    .select("config")
    .eq("id", 1)
    .single();

  if (error || !data?.config || Object.keys(data.config).length === 0) {
    return DEFAULT_PRICING_CONFIG;
  }

  return { ...DEFAULT_PRICING_CONFIG, ...data.config } as PricingConfig;
}
