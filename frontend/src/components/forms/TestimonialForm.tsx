import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/supabase/queries";

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Testimonial>) => Promise<void>;
}

const EMPTY: Partial<Testimonial> = {
  client_name: "",
  text: "",
  rating: 5,
  approved: true,
};

export default function TestimonialForm({ testimonial, open, onClose, onSave }: TestimonialFormProps) {
  const [form, setForm] = useState<Partial<Testimonial>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (testimonial) {
      setForm({ ...testimonial });
    } else {
      setForm({ ...EMPTY });
    }
    setError("");
  }, [testimonial, open]);

  function set<K extends keyof Testimonial>(key: K, value: Testimonial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Client Name *</label>
            <input
              type="text"
              required
              value={form.client_name || ""}
              onChange={(e) => set("client_name", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ngozi A."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Review *</label>
            <textarea
              rows={4}
              required
              value={form.text || ""}
              onChange={(e) => set("text", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="What the client said..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Rating</label>
              <select
                value={form.rating || 5}
                onChange={(e) => set("rating", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Status</label>
              <select
                value={form.approved ? "approved" : "pending"}
                onChange={(e) => set("approved", e.target.value === "approved")}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : testimonial ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
