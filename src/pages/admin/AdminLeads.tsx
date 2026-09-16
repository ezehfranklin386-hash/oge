import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { listLeads } from "@/lib/supabase/queries";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Lead } from "@/lib/supabase/queries";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    listLeads(50)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (!isSupabaseConfigured) return;
    try {
      const supabase = getSupabase() as any;
      await supabase.from("leads").update({ status }).eq("id", id);
    } catch {
      // Revert on failure — refetch
      listLeads(50).then(setLeads).catch(() => {});
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>

      {/* Search + Filter tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", "new", "contacted", "closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab ? "bg-primary/90 text-white" : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && ` (${leads.filter((l) => l.status === tab).length})`}
              {tab === "all" && ` (${leads.length})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
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
              <div className="h-4 w-32 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-48 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500">
          No leads found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Contact</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Source</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Message</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{lead.name}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    <div>{lead.phone}</div>
                    {lead.email && <div className="text-xs text-neutral-400">{lead.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{lead.source}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-neutral-600">{lead.message || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {new Date(lead.created_at).toLocaleDateString()}
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
