import { Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Agent } from "@/lib/supabase/queries";

export default function HomeAgents({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Meet Our Agents
          </h2>
          <p className="mt-3 text-lg text-neutral-500">
            The professionals behind our success
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
            >
              <img
                src={agent.photo_url || "/brand/logo.jpeg"}
                alt={agent.name}
                className="mx-auto h-24 w-24 rounded-full object-cover"
              />
              <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                {agent.name}
              </h3>
              <p className="mt-1 text-sm text-primary">{agent.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500 line-clamp-3">
                {agent.bio}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
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

        <div className="mt-10 text-center">
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary/90 px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/10"
          >
            View All Agents
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
