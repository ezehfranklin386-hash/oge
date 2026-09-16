import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LISTING_TYPES, LAGOS_AREAS } from "@/lib/utils/constants";

export default function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cityArea, setCityArea] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (cityArea) params.set("city_area", cityArea);
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <section className="hero-section relative min-h-[600px] overflow-hidden bg-[#0a0a1a]">
      {/* Animated gradient background (fallback while video loads) */}
      <div className="hero-bg absolute inset-0 z-0" />
      {/* Floating light orbs */}
      <div className="orb absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
      <div className="orb-2 absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]" />
      {/* Drone estate video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      >
        <source src="/homepage.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[2] bg-black/40" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a0a1a]/70 via-transparent to-transparent" />

      <div className="relative z-[3] mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect{" "}
            <span className="text-primary">Home</span> in Lagos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300 sm:mt-6 sm:text-xl">
            Property sales, lettings and interior design — trusted by hundreds
            of clients across Lagos, Nigeria.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-4 shadow-2xl sm:mt-12 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Search</label>
              <input
                type="text"
                placeholder="Lekki, duplex, 3-bed..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All</option>
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Min Price</label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No min</option>
                <option value="5000000">₦5M</option>
                <option value="10000000">₦10M</option>
                <option value="20000000">₦20M</option>
                <option value="50000000">₦50M</option>
                <option value="100000000">₦100M</option>
                <option value="200000000">₦200M</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Max Price</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No max</option>
                <option value="10000000">₦10M</option>
                <option value="20000000">₦20M</option>
                <option value="50000000">₦50M</option>
                <option value="100000000">₦100M</option>
                <option value="200000000">₦200M</option>
                <option value="500000000">₦500M</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Area</label>
              <select
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Areas</option>
                {LAGOS_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search Properties
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
