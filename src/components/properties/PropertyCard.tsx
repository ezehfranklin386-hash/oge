import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/lib/utils/currency";
import NoImagePlaceholder from "@/components/ui/NoImagePlaceholder";
import type { Property } from "@/lib/supabase/queries";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute left-3 top-3">
          <Badge variant="primary">
            {property.listing_type === "sale" ? "For Sale" : property.listing_type === "rent" ? "For Rent" : "For Lease"}
          </Badge>
        </div>
        {property.is_featured && (
          <div className="absolute right-3 top-3">
            <Badge variant="warning">Featured</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-primary">
          {formatNGN(property.price)}
          {property.listing_type === "rent" && <span className="text-sm font-normal text-neutral-500"> /year</span>}
        </p>
        <h3 className="mt-1 text-base font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary">{property.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{property.city_area}, {property.city}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-neutral-600">
          {property.beds != null && property.beds > 0 && <span>{property.beds} Beds</span>}
          {property.baths != null && property.baths > 0 && <span>{property.baths} Baths</span>}
          {property.size_sqm && <span>{property.size_sqm}m²</span>}
        </div>
      </div>
    </Link>
  );
}
