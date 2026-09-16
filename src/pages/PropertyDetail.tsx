import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { getPropertyBySlug } from "@/lib/supabase/queries";
import { SEED_PROPERTIES } from "@/lib/supabase/seed-data";
import { formatNGN } from "@/lib/utils/currency";
import { whatsappLink } from "@/lib/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/forms/LeadForm";
import PropertyMapWrapper from "@/components/properties/PropertyMapWrapper";
import ImageGallery from "@/components/properties/ImageGallery";
import SimilarProperties from "@/components/properties/SimilarProperties";
import type { Property } from "@/lib/supabase/queries";

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    getPropertyBySlug(slug)
      .then(setProperty)
      .catch(() => {
        // Try seed data
        const found = SEED_PROPERTIES.find((p) => p.slug === slug);
        if (found) {
          setProperty({
            ...found,
            id: `seed-${found.slug}`,
            views: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            agents: null,
          } as Property);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-neutral-200" />
          <div className="aspect-[16/9] rounded-xl bg-neutral-200" />
          <div className="h-6 w-48 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Property Not Found</h1>
        <p className="mt-3 text-neutral-500">The property you are looking for does not exist.</p>
        <Link to="/properties" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          ← Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/properties" className="hover:text-primary">Properties</Link>
        <span>/</span>
        <span className="text-neutral-900">{property.title}</span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="relative">
            <ImageGallery images={property.images || []} title={property.title} />
            <div className="absolute left-4 top-4 z-10">
              <Badge variant="primary">
                {property.listing_type === "sale" ? "For Sale" : property.listing_type === "rent" ? "For Rent" : "For Lease"}
              </Badge>
            </div>
          </div>

          {/* Key facts */}
          <div className="mt-6 flex flex-wrap gap-4">
            {property.beds != null && property.beds > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-2 text-sm">
                <span className="font-semibold">{property.beds}</span> Beds
              </div>
            )}
            {property.baths != null && property.baths > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-2 text-sm">
                <span className="font-semibold">{property.baths}</span> Baths
              </div>
            )}
            {property.size_sqm && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-2 text-sm">
                <span className="font-semibold">{property.size_sqm}</span> m²
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-neutral-900">Description</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-neutral-900">Features</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.features.map((f) => (
                  <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mini map */}
          {property.lat && property.lng && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-neutral-900">Location</h2>
              <div className="mt-3">
                <PropertyMapWrapper properties={[property]} height="300px" />
              </div>
            </div>
          )}

          {/* Lead form */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-neutral-900">Enquire About This Property</h2>
            <div className="mt-4 rounded-xl border border-neutral-200 p-6">
              <LeadForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </div>

          {/* Similar properties */}
          <SimilarProperties
            currentSlug={property.slug}
            cityArea={property.city_area}
            propertyType={property.property_type}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price card */}
          <div className="sticky top-24 rounded-xl border border-neutral-200 p-6">
            <p className="text-2xl font-bold text-primary">
              {formatNGN(property.price)}
              {property.listing_type === "rent" && (
                <span className="text-sm font-normal text-neutral-500"> /year</span>
              )}
            </p>
            <h1 className="mt-2 text-xl font-semibold text-neutral-900">{property.title}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {property.address && `${property.address}, `}
              {property.city_area}, {property.city}
            </p>

            {/* Agent card */}
            {property.agents && (
              <div className="mt-6 border-t border-neutral-200 pt-6">
                <h3 className="text-sm font-semibold text-neutral-900">Your Agent</h3>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={property.agents.photo_url || "/brand/logo.jpeg"}
                    alt={property.agents.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">{property.agents.name}</p>
                    <p className="text-xs text-neutral-500">{property.agents.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {property.agents.phone && (
                    <a href={`tel:${property.agents.phone}`} className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      <Phone className="h-4 w-4" /> {property.agents.phone}
                    </a>
                  )}
                  {property.agents.whatsapp && (
                    <a
                      href={`https://wa.me/${property.agents.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#20bd5a]"
                    >
                      <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-6 flex flex-col gap-2">
              <a href={whatsappLink(property.title)} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Share on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
