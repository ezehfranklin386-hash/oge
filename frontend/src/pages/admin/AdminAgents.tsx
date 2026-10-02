import { useEffect, useState } from "react";
import { Phone, Plus, Pencil, Trash2 } from "lucide-react";
import { createAgent, updateAgent, deleteAgent } from "@/lib/supabase/queries";
import { getAgents } from "@/lib/supabase/data";
import AgentForm from "@/components/forms/AgentForm";
import type { Agent } from "@/lib/supabase/queries";

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState<Agent | null>(null);

  function load() {
    getAgents().then(setAgents).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Partial<Agent>) {
    if (editing && editing.id && !editing.id.startsWith("seed-")) {
      await updateAgent(editing.id, data);
    } else {
      await createAgent(data);
    }
    load();
  }

  async function handleDelete() {
    if (deleting && deleting.id && !deleting.id.startsWith("seed-")) {
      await deleteAgent(deleting.id);
    }
    setDeleting(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Agents ({agents.length})</h1>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add Agent
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
              <div className="h-16 w-16 rounded-full bg-neutral-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-24 rounded bg-neutral-200" />
                <div className="h-3 w-32 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={agent.photo_url || "/brand/logo.jpeg"} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-neutral-900">{agent.name}</p>
                    <p className="text-sm text-primary">{agent.role}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(agent); setFormOpen(true); }}
                    className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(agent)}
                    className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-neutral-500">{agent.bio}</p>
              <div className="mt-3 flex gap-2">
                {agent.phone && <span className="flex items-center gap-1 text-xs text-neutral-400"><Phone className="h-3 w-3" /> {agent.phone}</span>}
                {agent.active !== false && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <AgentForm
        agent={editing}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-neutral-900">Delete Agent</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete <strong>{deleting.name}</strong>? This cannot be undone.
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
