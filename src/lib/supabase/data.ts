import { listFeatured, listTestimonials, listAgents } from "./queries";
import { SEED_PROPERTIES, SEED_TESTIMONIALS, SEED_AGENTS } from "./seed-data";
import { isSupabaseConfigured } from "./client";
import type { Property, Testimonial, Agent } from "./queries";

function seedProperty(p: (typeof SEED_PROPERTIES)[number], i: number): Property {
  return {
    ...p,
    id: `seed-${i}`,
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agents: null,
  } as Property;
}

function seedTestimonial(t: (typeof SEED_TESTIMONIALS)[number], i: number): Testimonial {
  return {
    ...t,
    id: `seed-t-${i}`,
    property_ref: null,
  } as Testimonial;
}

function seedAgent(a: (typeof SEED_AGENTS)[number], i: number): Agent {
  return {
    ...a,
    id: `seed-a-${i}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Agent;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    return SEED_PROPERTIES.filter((p) => p.is_featured).map(seedProperty);
  }
  try {
    return await listFeatured(6);
  } catch {
    return SEED_PROPERTIES.filter((p) => p.is_featured).map(seedProperty);
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) {
    return SEED_TESTIMONIALS.map(seedTestimonial);
  }
  try {
    return await listTestimonials(10);
  } catch {
    return SEED_TESTIMONIALS.map(seedTestimonial);
  }
}

export async function getAgents(): Promise<Agent[]> {
  if (!isSupabaseConfigured) {
    return SEED_AGENTS.map(seedAgent);
  }
  try {
    return await listAgents();
  } catch {
    return SEED_AGENTS.map(seedAgent);
  }
}
