import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/supabase/queries";
import { getTestimonials } from "@/lib/supabase/data";
import TestimonialForm from "@/components/forms/TestimonialForm";
import type { Testimonial } from "@/lib/supabase/queries";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);

  function load() {
    getTestimonials().then(setTestimonials).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Partial<Testimonial>) {
    if (editing && editing.id && !editing.id.startsWith("seed-")) {
      await updateTestimonial(editing.id, data);
    } else {
      await createTestimonial(data);
    }
    load();
  }

  async function handleDelete() {
    if (deleting && deleting.id && !deleting.id.startsWith("seed-")) {
      await deleteTestimonial(deleting.id);
    }
    setDeleting(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Testimonials ({testimonials.length})</h1>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
              <div className="h-4 w-48 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-full rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-600">Client</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Review</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Rating</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 font-medium text-neutral-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{t.client_name}</td>
                  <td className="max-w-[300px] truncate px-4 py-3 text-neutral-600">{t.text}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-500">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.approved ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {t.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing(t); setFormOpen(true); }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(t)}
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
      <TestimonialForm
        testimonial={editing}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-neutral-900">Delete Testimonial</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete the testimonial from <strong>{deleting.client_name}</strong>? This cannot be undone.
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
