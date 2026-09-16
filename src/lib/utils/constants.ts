export const COMPANY = {
  name: "G Interior and Property Service Ltd",
  shortName: "G Interior",
  rc: "RC: 1324580",
  tagline: "Property Sales, Lettings & Interior Design in Lagos",
  description:
    "G Interior and Property Service Ltd is a trusted real estate and interior design company based in Lagos, Nigeria. We help clients buy, sell, rent and transform residential and commercial properties.",
} as const;

export const CONTACT = {
  phone: "+234 000 000 0000",
  phoneRaw: "2340000000000",
  whatsapp: "+234 000 000 0000",
  whatsappRaw: "2340000000000",
  email: "hello@ginterior.com",
  address: "Lagos, Nigeria",
  addressFull: "Lagos, Nigeria",
} as const;

export const SOCIALS = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  twitter: "https://x.com/",
  linkedin: "https://linkedin.com/",
} as const;

export const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:3000";

export function whatsappLink(propertyTitle?: string, propertyUrl?: string): string {
  const base = `https://wa.me/${CONTACT.whatsappRaw}`;
  const text = propertyTitle
    ? `Hi, I'm interested in "${propertyTitle}" ${propertyUrl || ""}`
    : "Hi, I'd like to enquire about your services.";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export const LISTING_TYPES = ["sale", "rent", "lease"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const PROPERTY_TYPES = [
  "flat",
  "apartment",
  "duplex",
  "terrace",
  "detached",
  "semi-detached",
  "bungalow",
  "land",
  "commercial",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export const LAGOS_AREAS = [
  "Lekki",
  "Ikoyi",
  "Victoria Island",
  "Ikeja",
  "Yaba",
  "Surulere",
  "Ajah",
  "Gbagada",
  "Lekki Phase 1",
  "Ikota",
  "Chevron",
  "Osapa",
] as const;
