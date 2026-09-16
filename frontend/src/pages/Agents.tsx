import { useEffect, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { getAgents } from "@/lib/supabase/data";
import type { Agent } from "@/lib/supabase/queries";

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgents().then(setAgents).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Our Agents</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
            Meet the professionals behind our success
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-neutral-200 p-6">
                <div className="mx-auto h-24 w-24 rounded-full bg-neutral-200" />
                <div className="mt-4 space-y-2">
                  <div className="mx-auto h-5 w-32 rounded bg-neutral-200" />
                  <div className="mx-auto h-4 w-24 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
                <img
                  src={agent.photo_url || "/brand/logo.jpeg"}
                  alt={agent.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-neutral-900">{agent.name}</h3>
                <p className="mt-1 text-sm text-primary">{agent.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">{agent.bio}</p>
                <div className="mt-4 flex flex-col gap-2">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      <Phone className="h-4 w-4" /> {agent.phone}
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a
                      href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#20bd5a]"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
