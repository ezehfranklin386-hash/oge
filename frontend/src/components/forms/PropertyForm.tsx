import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LISTING_TYPES, LAGOS_AREAS } from "@/lib/utils/constants";
import type { Property } from "@/lib/supabase/queries";

interface PropertyFormProps {
  property?: Property | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Property>) => Promise<void>;
}

const EMPTY: Partial<Property> = {
  title: "",
  slug: "",
  price: 0,
  listing_type: "sale",
  property_type: "house",
  beds: 0,
  baths: 0,
  size_sqm: 0,
  address: "",
  city_area: "",
  city: "Lagos",
  description: "",
  features: [],
  images: [],
  is_featured: false,
  status: "available",
  lat: null,
  lng: null,
};

export default function PropertyForm({ property, open, onClose, onSave }: PropertyFormProps) {
  const [form, setForm] = useState<Partial<Property>>(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (property) {
      setForm({ ...property });
      setFeaturesText((property.features || []).join("\n"));
      setImagesText((property.images || []).join("\n"));
    } else {
      setForm({ ...EMPTY });
      setFeaturesText("");
      setImagesText("");
    }
    setError("");
  }, [property, open]);

  function set<K extends keyof Property>(key: K, value: Property[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function makeSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = {
        ...form,
        slug: form.slug || makeSlug(form.title || ""),
        features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
        images: imagesText.split("\n").map((s) => s.trim()).filter(Boolean),
        price: Number(form.price) || 0,
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        size_sqm: Number(form.size_sqm) || 0,
      };
      await onSave(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            {property ? "Edit Property" : "Add Property"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Title *</label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Luxury 4-Bedroom Duplex"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Price (₦) *</label>
              <input
                type="number"
                required
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Status</label>
              <select
                value={form.status || "available"}
                onChange={(e) => set("status", e.target.value as Property["status"])}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Listing Type</label>
              <select
                value={form.listing_type || "sale"}
                onChange={(e) => set("listing_type", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Property Type</label>
              <select
                value={form.property_type || "house"}
                onChange={(e) => set("property_type", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Beds</label>
              <input
                type="number"
                min="0"
                value={form.beds || ""}
                onChange={(e) => set("beds", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Baths</label>
              <input
                type="number"
                min="0"
                value={form.baths || ""}
                onChange={(e) => set("baths", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Size (m²)</label>
              <input
                type="number"
                min="0"
                value={form.size_sqm || ""}
                onChange={(e) => set("size_sqm", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Area</label>
              <select
                value={form.city_area || ""}
                onChange={(e) => set("city_area", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select area</option>
                {LAGOS_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Address</label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => set("address", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Plot 12, Admiralty Way"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Describe the property..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Image URLs (one per line)</label>
            <textarea
              rows={3}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://images.unsplash.com/photo-xxx?w=800"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Features (one per line)</label>
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Swimming Pool&#10;24/7 Security&#10;Smart Home"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured || false}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-neutral-700">Featured property</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : property ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
