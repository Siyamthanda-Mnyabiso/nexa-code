// POST /schedule-consultation
//
// Public endpoint (anon key). Attaches a consultation request to an existing
// quote_requests row so the Nexa Code team walks into the call already
// knowing the client's requirements, category, complexity, risk, and
// estimated effort (all visible in the admin dashboard, never to the client).

import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { getSupabaseAdmin } from "../_shared/supabaseAdmin.ts";

interface SchedulePayload {
  requestId?: string;
  requestedAt?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

function isUuid(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: SchedulePayload;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (!isUuid(body.requestId)) {
    return jsonResponse({ error: "A valid requestId is required" }, 400);
  }
  if (!body.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail)) {
    return jsonResponse({ error: "A valid contact email is required" }, 400);
  }

  const supabase = getSupabaseAdmin();

  const { data: quoteRequest, error: fetchError } = await supabase
    .from("quote_requests")
    .select("id, status")
    .eq("id", body.requestId)
    .single();

  if (fetchError || !quoteRequest) {
    return jsonResponse({ error: "Project assessment not found" }, 404);
  }

  const { data: consultation, error: insertError } = await supabase
    .from("consultations")
    .insert({
      quote_request_id: quoteRequest.id,
      requested_at: body.requestedAt ?? new Date().toISOString(),
      contact_name: body.contactName?.slice(0, 200),
      contact_email: body.contactEmail.slice(0, 200),
      contact_phone: body.contactPhone?.slice(0, 50),
      notes: body.notes?.slice(0, 2000),
      status: "REQUESTED",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to create consultation", insertError);
    return jsonResponse({ error: "Something went wrong. Please try again." }, 500);
  }

  await supabase
    .from("quote_requests")
    .update({ status: "CONSULTATION_SCHEDULED", updated_at: new Date().toISOString() })
    .eq("id", quoteRequest.id);

  // NOTE: notification to the Nexa Code team (email/SMS) is intentionally not
  // wired to a provider yet — see README note on modular notification setup.
  // The admin dashboard's NEW/CONSULTATION_SCHEDULED queue is the source of
  // truth until that's configured.

  return jsonResponse({ consultationId: consultation.id, status: "REQUESTED" });
});
