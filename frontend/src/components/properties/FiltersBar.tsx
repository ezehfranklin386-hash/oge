import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { LISTING_TYPES, LAGOS_AREAS, SORT_OPTIONS } from "@/lib/utils/constants";

export default function FiltersBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const get = (key: string) => searchParams.get(key) || "";

  const [q, setQ] = useState(get("q"));
  const [type, setType] = useState(get("type"));
  const [minPrice, setMinPrice] = useState(get("min_price"));
  const [maxPrice, setMaxPrice] = useState(get("max_price"));
  const [beds, setBeds] = useState(get("beds"));
  const [cityArea, setCityArea] = useState(get("city_area"));
  const [sort, setSort] = useState(get("sort") || "newest");
  const [mobileOpen, setMobileOpen] = useState(false);

  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const all = { q, type, min_price: minPrice, max_price: maxPrice, beds, city_area: cityArea, sort, ...overrides };
      for (const [k, v] of Object.entries(all)) {
        if (v && k !== "sort" && k !== "q") params.set(k, v);
        else if (k === "q" && v.trim()) params.set(k, v.trim());
        else if (k === "sort" && v !== "newest") params.set(k, v);
      }
      params.delete("page");
      navigate(`/properties?${params.toString()}`, { replace: true });
    },
    [q, type, minPrice, maxPrice, beds, cityArea, sort, navigate]
  );

  const hasFilters = q || type || minPrice || maxPrice || beds || cityArea;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* Desktop */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-8">
        <input
          type="text"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pushParams({ q })}
          className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select value={type} onChange={(e) => { setType(e.target.value); pushParams({ type: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">All Types</option>
          {LISTING_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={beds} onChange={(e) => { setBeds(e.target.value); pushParams({ beds: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
        <select value={minPrice} onChange={(e) => { setMinPrice(e.target.value); pushParams({ min_price: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">Min Price</option>
          <option value="5000000">₦5M</option>
          <option value="10000000">₦10M</option>
          <option value="20000000">₦20M</option>
          <option value="50000000">₦50M</option>
          <option value="100000000">₦100M</option>
        </select>
        <select value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); pushParams({ max_price: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">Max Price</option>
          <option value="10000000">₦10M</option>
          <option value="20000000">₦20M</option>
          <option value="50000000">₦50M</option>
          <option value="100000000">₦100M</option>
          <option value="200000000">₦200M</option>
        </select>
        <select value={cityArea} onChange={(e) => { setCityArea(e.target.value); pushParams({ city_area: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">All Areas</option>
          {LAGOS_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); pushParams({ sort: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Mobile toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <span className="text-sm font-medium text-neutral-700">Filters</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-sm text-primary">
          {mobileOpen ? "Hide" : "Show"} Filters
        </button>
      </div>

      {/* Mobile filters */}
      {mobileOpen && (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
          <input type="text" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && pushParams({ q })} className="col-span-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <select value={type} onChange={(e) => { setType(e.target.value); pushParams({ type: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">All Types</option>
            {LISTING_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={beds} onChange={(e) => { setBeds(e.target.value); pushParams({ beds: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">Beds</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <select value={minPrice} onChange={(e) => { setMinPrice(e.target.value); pushParams({ min_price: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">Min Price</option>
            <option value="5000000">₦5M</option>
            <option value="10000000">₦10M</option>
            <option value="20000000">₦20M</option>
            <option value="50000000">₦50M</option>
          </select>
          <select value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); pushParams({ max_price: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">Max Price</option>
            <option value="10000000">₦10M</option>
            <option value="20000000">₦20M</option>
            <option value="50000000">₦50M</option>
            <option value="100000000">₦100M</option>
          </select>
          <select value={cityArea} onChange={(e) => { setCityArea(e.target.value); pushParams({ city_area: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="">All Areas</option>
            {LAGOS_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); pushParams({ sort: e.target.value }); }} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      {hasFilters && (
        <div className="mt-3 text-right">
          <a href="/properties" className="text-sm text-primary hover:underline">Clear all filters</a>
        </div>
      )}
    </div>
  );
}
