import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, Trash2, X } from "lucide-react";
import {
  listLeads,
  updateLeadStatus,
  updateLeadFollowUp,
  deleteLead,
} from "@/lib/supabase/queries";
import type { Lead } from "@/lib/supabase/queries";

const STATUS_PILL: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-neutral-200 text-neutral-600",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  function load() {
    listLeads(50)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
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
    try {
      await updateLeadStatus(id, status as "new" | "contacted" | "closed");
    } catch {
      // Revert on failure — refetch
      listLeads(50).then(setLeads).catch(() => {});
    }
  }

  function openDetail(lead: Lead) {
    setNoteDraft(lead.notes ?? "");
    setFollowDate(lead.follow_up_date ?? "");
    setViewing(lead);
  }

  async function saveFollowUp() {
    if (!viewing) return;
    setSavingFollowUp(true);
    try {
      const notes = noteDraft.trim() || null;
      const follow_up_date = followDate || null;
      await updateLeadFollowUp(viewing.id, { notes, follow_up_date });
      const updated = { ...viewing, notes, follow_up_date };
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setViewing(null);
    } catch {
      // Leave modal open so the admin can retry
    } finally {
      setSavingFollowUp(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteLead(deleting.id);
    } finally {
      setDeleting(null);
      load();
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
                <th className="px-4 py-3 font-medium text-neutral-600">Property</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Message</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Date</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer hover:bg-neutral-50"
                  onClick={() => openDetail(lead)}
                >
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {lead.name}
                    {lead.follow_up_date && (
                      <span
                        className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle"
                        title={`Follow up on ${lead.follow_up_date}`}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <div>{lead.phone}</div>
                    {lead.email && <div className="text-xs text-neutral-400">{lead.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{lead.source}</td>
                  <td className="px-4 py-3">
                    {lead.properties ? (
                      <Link
                        to={`/properties/${lead.properties.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:underline"
                      >
                        {lead.properties.title}
                      </Link>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-neutral-600">{lead.message || "—"}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openDetail(lead)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(lead)}
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

      {/* Lead Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">{viewing.name}</h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {new Date(viewing.created_at).toLocaleString()} · {viewing.source}
                </p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_PILL[viewing.status] || STATUS_PILL.new}`}>
                  {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                </span>
                <select
                  value={viewing.status}
                  onChange={(e) => {
                    updateStatus(viewing.id, e.target.value);
                    setViewing({ ...viewing, status: e.target.value });
                  }}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-2 text-neutral-700 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-neutral-400">Phone</div>
                  <div>{viewing.phone || "—"}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-400">Email</div>
                  <div className="break-all">{viewing.email || "—"}</div>
                </div>
              </div>

              {viewing.properties && (
                <div>
                  <div className="text-xs font-medium text-neutral-400">Property</div>
                  <Link
                    to={`/properties/${viewing.properties.slug}`}
                    className="text-primary hover:underline"
                  >
                    {viewing.properties.title}
                  </Link>
                </div>
              )}

              <div>
                <div className="text-xs font-medium text-neutral-400">Message</div>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-neutral-700">
                  {viewing.message || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 p-3">
                <div className="text-xs font-medium text-neutral-500">Follow-up</div>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add internal notes about this lead..."
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-neutral-300 p-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="date"
                    value={followDate}
                    onChange={(e) => setFollowDate(e.target.value)}
                    className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={saveFollowUp}
                    disabled={savingFollowUp}
                    className="rounded-lg bg-primary/90 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-50"
                  >
                    {savingFollowUp ? "Saving..." : "Save Follow-up"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-neutral-900">Delete Lead</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete the lead from <strong>{deleting.name}</strong>? This cannot be undone.
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
