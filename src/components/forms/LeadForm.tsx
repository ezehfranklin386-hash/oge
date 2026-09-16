import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitLead } from "@/lib/supabase/queries";

export default function LeadForm({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitLead({ property_id: propertyId, name, phone, email, message, source: "property" });
      setStatus("success");
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <svg className="mx-auto h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-3 font-semibold text-green-800">Inquiry Sent!</p>
        <p className="mt-1 text-sm text-green-700">We will get back to you about &ldquo;{propertyTitle}&rdquo; shortly.</p>
        <button onClick={() => setStatus("idle")} className="mt-3 text-sm font-medium text-green-800 underline">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Name *</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your full name" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Phone *</label>
        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+234..." />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="you@email.com" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Message</label>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="I'm interested in this property..." />
      </div>
      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
