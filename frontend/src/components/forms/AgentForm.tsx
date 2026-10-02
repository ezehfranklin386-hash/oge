import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/supabase/queries";

interface AgentFormProps {
  agent?: Agent | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Agent>) => Promise<void>;
}

const EMPTY: Partial<Agent> = {
  name: "",
  role: "",
  phone: "",
  whatsapp: "",
  email: "",
  photo_url: "",
  bio: "",
  active: true,
};

export default function AgentForm({ agent, open, onClose, onSave }: AgentFormProps) {
  const [form, setForm] = useState<Partial<Agent>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (agent) {
      setForm({ ...agent });
    } else {
      setForm({ ...EMPTY });
    }
    setError("");
  }, [agent, open]);

  function set<K extends keyof Agent>(key: K, value: Agent[K]) {
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
            {agent ? "Edit Agent" : "Add Agent"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Name *</label>
            <input
              type="text"
              required
              value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Adaeze Obi"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Role</label>
            <input
              type="text"
              value={form.role || ""}
              onChange={(e) => set("role", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Senior Property Consultant"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Phone</label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+234 801 234 5678"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">WhatsApp</label>
              <input
                type="tel"
                value={form.whatsapp || ""}
                onChange={(e) => set("whatsapp", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+234 801 234 5678"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="agent@ginterior.ng"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Photo URL</label>
            <input
              type="url"
              value={form.photo_url || ""}
              onChange={(e) => set("photo_url", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Bio</label>
            <textarea
              rows={3}
              value={form.bio || ""}
              onChange={(e) => set("bio", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="About this agent..."
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-neutral-700">Active</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
