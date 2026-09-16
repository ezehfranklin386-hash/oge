import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import type { Property, Lead } from "@/lib/supabase/queries";
import { listProperties, listLeads } from "@/lib/supabase/queries";

export default function Dashboard() {
  const [totalProperties, setTotalProperties] = useState(0);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    listProperties({ page: "1" })
      .then((r) => setTotalProperties(r.total))
      .catch(() => setTotalProperties(SEED_PROPERTIES.length));

    listLeads(5)
      .then(setRecentLeads)
      .catch(() => setRecentLeads([]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <Link to="/admin/properties" className="rounded-lg bg-primary/90 px-4 py-2 text-sm font-medium text-white hover:bg-primary">
          + Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Total Properties</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">{totalProperties}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">New Leads</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">{recentLeads.filter((l) => l.status === "new").length}</p>
        </div>
      </div>

      {/* Recent leads */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">Recent Leads</h2>
          <Link to="/admin/leads" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-neutral-500">No leads yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-medium text-neutral-900">{lead.name}</p>
                  <p className="text-xs text-neutral-500">{lead.phone} • {lead.source}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  lead.status === "new" ? "bg-blue-100 text-blue-700" :
                  lead.status === "contacted" ? "bg-amber-100 text-amber-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
