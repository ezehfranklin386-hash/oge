import { useEffect, useState } from "react";
import { Star, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { listProperties, createProperty, updateProperty, deleteProperty } from "@/lib/supabase/queries";
import { deleteImagesByUrls, isStorageUrl } from "@/lib/supabase/storage";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import { formatNGN } from "@/lib/utils/currency";
import NoImagePlaceholder from "@/components/ui/NoImagePlaceholder";
import PropertyForm from "@/components/forms/PropertyForm";
import type { Property } from "@/lib/supabase/queries";

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);

  function load() {
    // Admin sees every status (available, sold, rented), not just 'available'.
    listProperties({ page: "1" }, { allStatuses: true })
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
  }

  useEffect(() => { load(); }, []);

  const filtered = search
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.city_area?.toLowerCase().includes(search.toLowerCase()) ||
          p.listing_type.toLowerCase().includes(search.toLowerCase())
      )
    : properties;

  async function handleSave(data: Partial<Property>) {
    if (editing && editing.id && !editing.id.startsWith("seed-")) {
      await updateProperty(editing.id, data);
    } else {
      await createProperty(data);
    }
    load();
  }

  async function handleDelete() {
    if (deleting && deleting.id && !deleting.id.startsWith("seed-")) {
      await deleteProperty(deleting.id);
      // Best-effort cleanup of storage objects owned by this property.
      // isStorageUrl filters out pasted external URLs (Unsplash etc.).
      void deleteImagesByUrls((deleting.images || []).filter(isStorageUrl));
    }
    setDeleting(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Properties ({filtered.length})</h1>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> Add Property
          </button>
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
                <th className="px-4 py-3 font-medium text-neutral-600 text-right">Actions</th>
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
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/properties/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
                        title="View"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6V5.25A2.25 2.25 0 0 0 11.25 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 5.25 22h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                      </a>
                      <button
                        onClick={() => { setEditing(p); setFormOpen(true); }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <PropertyForm
        property={editing}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-neutral-900">Delete Property</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete <strong>{deleting.title}</strong>? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
