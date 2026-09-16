import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { getAgents } from "@/lib/supabase/data";
import type { Agent } from "@/lib/supabase/queries";

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents().then(setAgents).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Agents</h1>
        <span className="text-sm text-neutral-500">{agents.length} agents</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4">
              <div className="h-16 w-16 rounded-full bg-neutral-200" />
              <div className="mt-3 h-4 w-24 rounded bg-neutral-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <img src={agent.photo_url || "/brand/logo.jpeg"} alt="" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-neutral-900">{agent.name}</p>
                  <p className="text-sm text-primary">{agent.role}</p>
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
    </div>
  );
}
