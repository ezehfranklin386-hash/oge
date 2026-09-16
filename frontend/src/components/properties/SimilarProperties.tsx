import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Property } from "@/lib/supabase/queries";

interface SimilarPropertiesProps {
  currentSlug: string;
  cityArea?: string | null;
  propertyType?: string | null;
}

export default function SimilarProperties({ currentSlug, cityArea, propertyType }: SimilarPropertiesProps) {
  const [similar, setSimilar] = useState<Property[]>([]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        const filtered = SEED_PROPERTIES.filter(
          (p) =>
            p.slug !== currentSlug &&
            (p.city_area === cityArea || p.property_type === propertyType)
        ).slice(0, 3);
        setSimilar(
          filtered.map((p, i) => ({
            ...p,
            id: `seed-sim-${i}`,
            views: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            agents: null,
          })) as Property[]
        );
        return;
      }

      try {
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        const { data } = await supabase
          .from("properties")
          .select("*, agents(name, photo_url, phone, whatsapp)")
          .eq("status", "available")
          .neq("slug", currentSlug)
          .or(`city_area.eq.${cityArea || ""},property_type.eq.${propertyType || ""}`)
          .limit(3);

        setSimilar((data || []) as Property[]);
      } catch {
        // silently fail
      }
    }

    if (cityArea || propertyType) load();
  }, [currentSlug, cityArea, propertyType]);

  if (similar.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-neutral-900">Similar Properties</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
