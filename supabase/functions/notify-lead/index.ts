// notify-lead — Database Webhook target for INSERTs into public.leads.
//
// Chain: contact/property form -> anon INSERT into `leads` -> Supabase
// Database Webhook -> this function -> Brevo API -> admin inbox + the extra
// "Notification Email" from site_settings.
//
// Best-effort by design: the lead row is already committed before this runs,
// so a failure here only logs — it never blocks lead capture.
//
// Secrets (Dashboard -> Project Settings -> Edge Functions -> Secrets):
//   BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const BREVO_SENDER_EMAIL = Deno.env.get("BREVO_SENDER_EMAIL") ?? "";
const BREVO_SENDER_NAME = Deno.env.get("BREVO_SENDER_NAME") ?? "G Interior";

interface LeadRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  property_id: string | null;
  created_at: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(lead: LeadRecord, sourceLabel: string): string {
  const received = new Date(lead.created_at).toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rows: Array<[string, string]> = [
    ["Name", lead.name],
    ["Phone", lead.phone || "—"],
    ["Email", lead.email || "—"],
    ["Source", sourceLabel],
    ["Received", `${received} (WAT)`],
    ["Lead ID", lead.id],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `        <tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#171717;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("\n");

  const messageBlock = lead.message
    ? `      <p style="margin:20px 0 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
      <div style="margin-top:8px;border-left:3px solid #c9a227;background:#fafafa;padding:14px 16px;border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#171717;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>
      </div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
      <div style="background:#171717;padding:22px 28px;">
        <p style="margin:0;color:#c9a227;font-size:18px;font-weight:700;letter-spacing:0.04em;">G INTERIOR</p>
        <p style="margin:4px 0 0;color:#a3a3a3;font-size:13px;">New enquiry received</p>
      </div>
      <div style="padding:28px;">
        <p style="margin:0;color:#171717;font-size:15px;line-height:1.6;">
          A new lead was submitted on your website. Details are below — follow up by phone or WhatsApp when you can.
        </p>
        <table style="width:100%;margin-top:20px;border-collapse:collapse;">
${rowsHtml}
        </table>
${messageBlock}
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0 16px;" />
        <p style="margin:0;color:#a3a3a3;font-size:12px;line-height:1.6;">
          This notification was sent automatically by the G Interior website. You receive it because your account is in the admins table or you set a Notification Email in Admin → Settings.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    // Database Webhooks send { type, table, schema, record, old_record }.
    // Accept a bare lead row too, so manual testing is easy.
    const lead: LeadRecord | undefined = payload?.record ?? payload;
    if (!lead?.name) {
      return new Response(JSON.stringify({ error: "No lead record in payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
      console.error("notify-lead: BREVO_API_KEY / BREVO_SENDER_EMAIL not set");
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Recipients: every admins row + the extra address from Settings, deduped.
    const [{ data: admins, error: adminsError }, { data: settings, error: settingsError }] =
      await Promise.all([
        supabase.from("admins").select("email"),
        supabase.from("site_settings").select("notify_email").eq("id", "main").maybeSingle(),
      ]);

    if (adminsError) console.error("notify-lead: admins fetch failed:", adminsError.message);
    if (settingsError) console.error("notify-lead: settings fetch failed:", settingsError.message);

    const recipients = [
      ...(admins ?? []).map((a) => (a.email ?? "").trim()),
      (settings?.notify_email ?? "").trim(),
    ]
      .filter((email) => email.length > 0 && email.includes("@"))
      .filter((email, index, all) => all.indexOf(email) === index);

    if (recipients.length === 0) {
      console.log("notify-lead: no recipients configured (admins empty, no Notification Email) — skipping send");
      return new Response(JSON.stringify({ ok: true, skipped: "no recipients" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const sourceLabel = lead.source === "contact" ? "Contact form" : "Property enquiry";
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
        to: recipients.map((email) => ({ email })),
        subject: `New ${sourceLabel.toLowerCase()} from ${lead.name}`,
        htmlContent: buildEmailHtml(lead, sourceLabel),
      }),
    });

    if (!brevoResponse.ok) {
      const body = await brevoResponse.text();
      console.error(`notify-lead: Brevo returned ${brevoResponse.status}:`, body);
      return new Response(JSON.stringify({ error: "Brevo send failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`notify-lead: sent to ${recipients.length} recipient(s)`);
    return new Response(JSON.stringify({ ok: true, recipients: recipients.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("notify-lead: unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
