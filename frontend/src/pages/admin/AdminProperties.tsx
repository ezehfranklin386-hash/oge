import { useEffect, useState } from "react";
import { Star, Search } from "lucide-react";
import { listProperties } from "@/lib/supabase/queries";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import { formatNGN } from "@/lib/utils/currency";
import NoImagePlaceholder from "@/components/ui/NoImagePlaceholder";
import type { Property } from "@/lib/supabase/queries";

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listProperties({ page: "1" })
      .then((r) => setProperties(r.data))
      .catch(() => {
        setProperties(
          SEED_PROPERTIES.map((p, i) => ({
            ...p,
            id: `seed-${i}`,
            views: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            agents: null,
          })) as Property[]
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.city_area?.toLowerCase().includes(search.toLowerCase()) ||
          p.listing_type.toLowerCase().includes(search.toLowerCase())
      )
    : properties;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Properties ({filtered.length})</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-neutral-200" />
                  <div className="h-3 w-24 rounded bg-neutral-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-600">Property</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Price</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Type</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Featured</th>
                <th className="px-4 py-3 font-medium text-neutral-600">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <NoImagePlaceholder className="h-10 w-10 rounded-lg" />
                    )}
                    <div>
                      <p className="font-medium text-neutral-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-neutral-500">{p.city_area}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{formatNGN(p.price)}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.listing_type}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "available" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "sold" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_featured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/properties/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
