#!/usr/bin/env node
/**
 * Endpoint + RLS test suite for the G Interior Supabase backend.
 *
 * Tests every table, every public query path, and the full RLS matrix
 * using only the anon key (exactly what the browser sends).
 *
 * Usage:
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_ANON_KEY=<anon-key> \
 *   node supabase/test-endpoints.mjs
 *
 * Optional (for the authenticated-admin section):
 *   ADMIN_EMAIL=admin@ginterior.ng
 *   ADMIN_PASSWORD=<password>
 */

const URL_ = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;

if (!URL_ || !ANON) {
  console.error("Set SUPABASE_URL and SUPABASE_ANON_KEY env vars first.");
  process.exit(2);
}

const REST = `${URL_}/rest/v1`;
const AUTH = `${URL_}/auth/v1`;
const headers = {
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  "Content-Type": "application/json",
};

let pass = 0, fail = 0;
const results = [];

async function test(name, fn) {
  try {
    await fn();
    pass++;
    results.push({ name, ok: true });
    console.log(`  \x1b[32mPASS\x1b[0m  ${name}`);
  } catch (err) {
    fail++;
    results.push({ name, ok: false, err: err.message });
    console.log(`  \x1b[31mFAIL\x1b[0m  ${name} — ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function rest(path, opts = {}) {
  const res = await fetch(`${REST}${path}`, { headers, ...opts });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, body };
}

// ── Anonymous reads (public site) ───────────────────────────────

console.log("\n── Anonymous reads (public) ──");

await test("GET /properties — 200, only 'available'", async () => {
  const { status, body } = await rest("/properties?select=*&status=available");
  assert(status === 200, `status ${status}`);
  assert(Array.isArray(body), "not an array");
  for (const p of body) assert(p.status === "available", `bad status ${p.status}`);
  console.log(`        ${body.length} available properties`);
});

await test("GET /properties with agents join", async () => {
  const { status, body } = await rest("/properties?select=*,agents(name,phone)&status=available&limit=3");
  assert(status === 200, `status ${status}`);
  assert(Array.isArray(body), "not an array");
});

await test("GET /properties?is_featured=true", async () => {
  const { status, body } = await rest("/properties?select=*&status=available&is_featured=true");
  assert(status === 200, `status ${status}`);
  for (const p of body) assert(p.is_featured === true, "not featured");
});

await test("GET /agents — 200, only active", async () => {
  const { status, body } = await rest("/agents?select=*&active=true");
  assert(status === 200, `status ${status}`);
  for (const a of body) assert(a.active === true, "inactive agent returned");
  console.log(`        ${body.length} active agents`);
});

await test("GET /testimonials — 200, only approved", async () => {
  const { status, body } = await rest("/testimonials?select=*&approved=true");
  assert(status === 200, `status ${status}`);
  for (const t of body) assert(t.approved === true, "unapproved returned");
  console.log(`        ${body.length} approved testimonials`);
});

await test("GET /site_settings — 200, one 'main' row", async () => {
  const { status, body } = await rest("/site_settings?select=*&id=eq.main");
  assert(status === 200, `status ${status}`);
  assert(Array.isArray(body) && body.length === 1, `expected 1 row, got ${body?.length}`);
});

await test("GET /leads — 200, empty (no anon SELECT policy)", async () => {
  const { status, body } = await rest("/leads?select=*");
  assert(status === 200, `status ${status}`);
  assert(Array.isArray(body) && body.length === 0, `expected [], got ${JSON.stringify(body)}`);
});

// ── Anonymous writes (RLS enforcement) ──────────────────────────

console.log("\n── Anonymous writes (RLS must block) ──");

await test("POST /properties — blocked (42501)", async () => {
  const { status } = await rest("/properties", {
    method: "POST",
    body: JSON.stringify({ title: "Hack", slug: "hack-test", price: 1, listing_type: "rent" }),
  });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("PATCH /properties — blocked (42501)", async () => {
  const { status } = await rest("/properties?id=eq.no-such-id", {
    method: "PATCH",
    body: JSON.stringify({ title: "Hacked" }),
  });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("DELETE /properties — blocked (42501)", async () => {
  const { status } = await rest("/properties?id=eq.no-such-id", { method: "DELETE" });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("POST /agents — blocked (42501)", async () => {
  const { status } = await rest("/agents", {
    method: "POST",
    body: JSON.stringify({ name: "Hacker" }),
  });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("POST /site_settings — blocked (42501)", async () => {
  const { status } = await rest("/site_settings", {
    method: "POST",
    body: JSON.stringify({ id: "hack", phone: "000" }),
  });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("POST /leads status='new' — allowed (201)", async () => {
  const { status } = await rest("/leads", {
    method: "POST",
    body: JSON.stringify({
      name: "Test Lead",
      phone: "+2348000000000",
      email: "test@example.com",
      message: "Endpoint test",
      source: "test",
      status: "new",
    }),
  });
  assert(status === 201, `expected 201, got ${status}`);
});

await test("POST /leads status='closed' — blocked (42501)", async () => {
  const { status } = await rest("/leads", {
    method: "POST",
    body: JSON.stringify({ name: "Sneaky", phone: "+2348000000001", status: "closed" }),
  });
  assert(status === 42501 || status === 403, `expected 42501/403, got ${status}`);
});

await test("POST /rpc/is_admin (anon) — returns false", async () => {
  const res = await fetch(`${REST}/rpc/is_admin`, {
    headers,
    method: "POST",
    body: JSON.stringify({}),
  });
  const body = await res.json();
  assert(body === false, `expected false, got ${JSON.stringify(body)}`);
});

// ── Property filter paths (public queries) ──────────────────────

console.log("\n── Property filter paths ──");

await test("Filter: listing_type=rent", async () => {
  const { status, body } = await rest("/properties?select=listing_type&status=available&listing_type=eq.rent");
  assert(status === 200, `status ${status}`);
  for (const p of body) assert(p.listing_type === "rent", "wrong type");
});

await test("Filter: price gte / lte", async () => {
  const { status, body } = await rest("/properties?select=price&status=available&price=gte.1000000&price=lte.50000000");
  assert(status === 200, `status ${status}`);
  for (const p of body) assert(p.price >= 1000000 && p.price <= 50000000, `price ${p.price} out of range`);
});

await test("Filter: city_area=eq.Lekki", async () => {
  const { status, body } = await rest("/properties?select=city_area&status=available&city_area=eq.Lekki");
  assert(status === 200, `status ${status}`);
  for (const p of body) assert(p.city_area === "Lekki", `wrong area ${p.city_area}`);
});

await test("Sort: price ascending", async () => {
  const { status, body } = await rest("/properties?select=price&status=available&order=price.asc");
  assert(status === 200, `status ${status}`);
  for (let i = 1; i < body.length; i++) {
    assert(body[i].price >= body[i - 1].price, "not sorted");
  }
});

// ── Authenticated admin section ─────────────────────────────────

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  console.log("\n── Authenticated admin ──");

  let token = null;
  await test("Sign in as admin", async () => {
    const res = await fetch(`${AUTH}/token?grant_type=password`, {
      headers: { ...headers, Authorization: `Bearer ${ANON}` },
      method: "POST",
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const body = await res.json();
    assert(body.access_token, `no token: ${JSON.stringify(body)}`);
    token = body.access_token;
  });

  if (token) {
    const adminHeaders = { ...headers, Authorization: `Bearer ${token}` };

    await test("rpc/is_admin (admin) — returns true", async () => {
      const res = await fetch(`${REST}/rpc/is_admin`, {
        headers: adminHeaders,
        method: "POST",
        body: JSON.stringify({}),
      });
      const body = await res.json();
      assert(body === true, `expected true, got ${JSON.stringify(body)}`);
    });

    await test("GET /leads (admin) — sees all leads", async () => {
      const res = await fetch(`${REST}/leads?select=*`, { headers: adminHeaders });
      const body = await res.json();
      assert(res.status === 200, `status ${res.status}`);
      assert(Array.isArray(body), "not an array");
      console.log(`        ${body.length} leads visible to admin`);
    });

    await test("GET /properties all statuses (admin)", async () => {
      const res = await fetch(`${REST}/properties?select=status`, { headers: adminHeaders });
      const body = await res.json();
      assert(res.status === 200, `status ${res.status}`);
      const statuses = [...new Set(body.map((p) => p.status))];
      console.log(`        statuses visible: ${statuses.join(", ")}`);
    });

    await test("PATCH /leads — update status to contacted", async () => {
      const listRes = await fetch(`${REST}/leads?select=id&limit=1`, { headers: adminHeaders });
      const leads = await listRes.json();
      if (!leads.length) return console.log("        (no leads to update — skipped)");
      const { status } = await fetch(`${REST}/leads?id=eq.${leads[0].id}`, {
        headers: adminHeaders,
        method: "PATCH",
        body: JSON.stringify({ status: "contacted" }),
      });
      assert(status === 204 || status === 200, `status ${status}`);
    });

    await test("POST /site_settings upsert (admin) — 201/204", async () => {
      const res = await fetch(`${REST}/site_settings`, {
        headers: adminHeaders,
        method: "POST",
        body: JSON.stringify({ id: "main" }),
      });
      // upsert may return 201 or 204 depending on Prefer header
      assert([200, 201, 204].includes(res.status), `status ${res.status}`);
    });
  }
} else {
  console.log("\n\x1b[33m── Admin section skipped (set ADMIN_EMAIL + ADMIN_PASSWORD to run) ──\x1b[0m");
}

// ── Summary ──────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: \x1b[32m${pass} passed\x1b[0m, ${fail ? `\x1b[31m${fail} failed\x1b[0m` : "0 failed"}`);
console.log(`${"─".repeat(50)}\n`);
process.exit(fail ? 1 : 0);
