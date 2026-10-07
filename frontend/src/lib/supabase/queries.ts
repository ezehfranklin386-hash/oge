import { getSupabase } from "./client";
import type { Database } from "./types";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];
type AgentInsert = Database["public"]["Tables"]["agents"]["Insert"];
type AgentUpdate = Database["public"]["Tables"]["agents"]["Update"];
type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];
type TestimonialUpdate = Database["public"]["Tables"]["testimonials"]["Update"];
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];

export interface PropertyFilters {
  q?: string;
  type?: string;
  property_type?: string;
  min_price?: string;
  max_price?: string;
  beds?: string;
  city_area?: string;
  sort?: string;
  page?: string;
}

export interface ListOptions {
  /** Admin views: return every status, not just 'available'. */
  allStatuses?: boolean;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  listing_type: string;
  property_type: string | null;
  beds: number | null;
  baths: number | null;
  size_sqm: number | null;
  address: string | null;
  city_area: string | null;
  city: string;
  description: string | null;
  features: string[];
  images: string[];
  video_url: string | null;
  is_featured: boolean;
  status: string;
  lat: number | null;
  lng: number | null;
  agent_id: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  agents?: Agent | null;
}

export interface Agent {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  photo_url: string | null;
  bio: string | null;
  active: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  text: string;
  rating: number;
  property_ref: string | null;
  approved: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  property_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
  properties?: { title: string; slug: string } | null;
}

const PER_PAGE = 9;

export async function listProperties(filters: PropertyFilters, opts?: ListOptions) {
  const supabase = getSupabase();
  const page = Math.max(1, parseInt(filters.page || "1", 10));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  let query = supabase
    .from("properties")
    .select("*, agents(name, phone, whatsapp, photo_url)", { count: "exact" });

  // Public views only see 'available'; the admin list opts out of this filter.
  if (!opts?.allStatuses) {
    query = query.eq("status", "available");
  }

  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,address.ilike.%${filters.q}%,city_area.ilike.%${filters.q}%`
    );
  }
  if (filters.type) query = query.eq("listing_type", filters.type);
  if (filters.property_type) query = query.eq("property_type", filters.property_type);
  if (filters.beds) query = query.gte("beds", parseInt(filters.beds, 10));
  if (filters.min_price) query = query.gte("price", parseFloat(filters.min_price));
  if (filters.max_price) query = query.lte("price", parseFloat(filters.max_price));
  if (filters.city_area) query = query.eq("city_area", filters.city_area);

  const sort = filters.sort || "newest";
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    data: (data || []) as Property[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / PER_PAGE),
  };
}

export async function getPropertyBySlug(slug: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*, agents(*)")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Property;
}

export async function listFeatured(limit = 6) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("properties")
    .select("*, agents(name, photo_url, phone, whatsapp)")
    .eq("status", "available")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Property[];
}

export async function listAgents() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw error;
  return (data || []) as Agent[];
}

export async function listTestimonials(limit = 10) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Testimonial[];
}

export async function listLeads(limit = 50) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*, properties(title, slug)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Lead[];
}

export async function submitLead(lead: {
  property_id?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
}) {
  const supabase = getSupabase();
  const row: LeadInsert = {
    property_id: lead.property_id || null,
    name: lead.name,
    phone: lead.phone,
    email: lead.email || null,
    message: lead.message || null,
    source: lead.source || "property",
    status: "new",
  };
  const { error } = await supabase.from("leads").insert(row);
  if (error) throw error;
}

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "closed") {
  const supabase = getSupabase();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

// Settings helpers

export async function getSiteSettings() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateSiteSettings(settings: {
  phone?: string;
  phoneRaw?: string;
  phone2?: string;
  phone2Raw?: string;
  whatsapp?: string;
  whatsappRaw?: string;
  email?: string;
  notifyEmail?: string;
  address?: string;
  addressFull?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}) {
  const supabase = getSupabase();
  // updated_at is owned by the DB trigger (set_updated_at) — not set here.
  const row: SiteSettingsInsert = {
    id: "main",
    phone: settings.phone,
    phone_raw: settings.phoneRaw,
    phone2: settings.phone2 || null,
    phone2_raw: settings.phone2Raw || null,
    whatsapp: settings.whatsapp,
    whatsapp_raw: settings.whatsappRaw,
    email: settings.email,
    notify_email: settings.notifyEmail || null,
    address: settings.address,
    address_full: settings.addressFull,
    instagram: settings.instagram || null,
    facebook: settings.facebook || null,
    twitter: settings.twitter || null,
    linkedin: settings.linkedin || null,
    tiktok: settings.tiktok || null,
  };
  const { error } = await supabase.from("site_settings").upsert(row);
  if (error) throw error;
}

// ── Property CRUD ───────────────────────────────────────────────

export async function createProperty(data: Partial<Property>) {
  const supabase = getSupabase();
  // `agents` is a read-only join field, not a column — strip it before insert.
  const { agents: _agents, ...row } = data;
  const { error } = await supabase.from("properties").insert(row as PropertyInsert);
  if (error) throw error;
}

export async function updateProperty(id: string, data: Partial<Property>) {
  const supabase = getSupabase();
  // `agents` is a read-only join field, not a column — strip it before update.
  const { agents: _agents, ...row } = data;
  const { error } = await supabase.from("properties").update(row as PropertyUpdate).eq("id", id);
  if (error) throw error;
}

export async function deleteProperty(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

// ── Agent CRUD ──────────────────────────────────────────────────

export async function createAgent(data: Partial<Agent>) {
  const supabase = getSupabase();
  const { error } = await supabase.from("agents").insert(data as AgentInsert);
  if (error) throw error;
}

export async function updateAgent(id: string, data: Partial<Agent>) {
  const supabase = getSupabase();
  const { error } = await supabase.from("agents").update(data as AgentUpdate).eq("id", id);
  if (error) throw error;
}

export async function deleteAgent(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw error;
}

// ── Testimonial CRUD ────────────────────────────────────────────

export async function createTestimonial(data: Partial<Testimonial>) {
  const supabase = getSupabase();
  const { error } = await supabase.from("testimonials").insert(data as TestimonialInsert);
  if (error) throw error;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("testimonials")
    .update(data as TestimonialUpdate)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}
