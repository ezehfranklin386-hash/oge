import { useEffect, useState } from "react";
import { getTestimonials } from "@/lib/supabase/data";
import type { Testimonial } from "@/lib/supabase/queries";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then(setTestimonials).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Testimonials</h1>
        <span className="text-sm text-neutral-500">{testimonials.length} testimonials</span>
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
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-600">Client</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Review</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Rating</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
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
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Approved
                    </span>
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
