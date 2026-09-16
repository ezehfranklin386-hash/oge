import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import FiltersBar from "@/components/properties/FiltersBar";
import PropertyCard from "@/components/properties/PropertyCard";
import Pagination from "@/components/properties/Pagination";
import PropertyMapWrapper from "@/components/properties/PropertyMapWrapper";
import { listProperties } from "@/lib/supabase/queries";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import type { Property } from "@/lib/supabase/queries";

const PER_PAGE = 9;

function filterSeedData(filters: URLSearchParams) {
  let results = [...SEED_PROPERTIES] as unknown as Property[];

  const q = filters.get("q");
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.address?.toLowerCase().includes(lower) ||
        p.city_area?.toLowerCase().includes(lower)
    );
  }

  const type = filters.get("type");
  if (type) results = results.filter((p) => p.listing_type === type);

  const beds = filters.get("beds");
  if (beds) results = results.filter((p) => (p.beds || 0) >= parseInt(beds));

  const minPrice = filters.get("min_price");
  if (minPrice) results = results.filter((p) => p.price >= parseFloat(minPrice));

  const maxPrice = filters.get("max_price");
  if (maxPrice) results = results.filter((p) => p.price <= parseFloat(maxPrice));

  const cityArea = filters.get("city_area");
  if (cityArea) results = results.filter((p) => p.city_area === cityArea);

  const sort = filters.get("sort") || "newest";
  if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
  else results.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));

  const page = parseInt(filters.get("page") || "1");
  const total = results.length;
  const data = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return { data, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const paramsStr = searchParams.toString();

    // Try Supabase first, fall back to seed data
    listProperties({
      q: searchParams.get("q") || undefined,
      type: searchParams.get("type") || undefined,
      min_price: searchParams.get("min_price") || undefined,
      max_price: searchParams.get("max_price") || undefined,
      beds: searchParams.get("beds") || undefined,
      city_area: searchParams.get("city_area") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: searchParams.get("page") || undefined,
    })
      .then((result) => {
        setProperties(result.data);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
      })
      .catch(() => {
        // Fall back to seed data filtering
        const result = filterSeedData(searchParams);
        setProperties(result.data);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Properties</h1>
      <p className="mt-2 text-neutral-500">Browse our available properties across Lagos</p>

      <div className="mt-6">
        <FiltersBar />
      </div>

      {/* Map toggle */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-11.22a3.375 3.375 0 1 1-4.747 0 3.375 3.375 0 0 1 4.747 0ZM4.5 19.23v-2.25a3.375 3.375 0 0 1 3.375-3.375h12.75a3.375 3.375 0 0 1 3.375 3.375v2.25" />
          </svg>
          {showMap ? "Hide Map" : "Show Map"}
        </button>
        <span className="text-sm text-neutral-500">{properties.length} properties found</span>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mt-4">
          <PropertyMapWrapper properties={properties} height="350px" />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white">
              <div className="aspect-[4/3] bg-neutral-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-24 rounded bg-neutral-200" />
                <div className="h-4 w-full rounded bg-neutral-200" />
                <div className="h-3 w-1/2 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="mt-12 text-center">
          <svg className="mx-auto h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-neutral-900">No properties found</p>
          <p className="mt-2 text-sm text-neutral-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
