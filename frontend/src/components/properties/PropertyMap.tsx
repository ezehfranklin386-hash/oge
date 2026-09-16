import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { formatNGN } from "@/lib/utils/currency";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/lib/supabase/queries";

function fixLeafletIcon() {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = (window as any).L;
  if (L?.Icon?.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }
}

export default function PropertyMap({ properties, height = "400px" }: { properties: Property[]; height?: string }) {
  if (properties.length === 0) return null;

  const center: [number, number] = [properties[0].lat ?? 6.5244, properties[0].lng ?? 3.3792];

  if (typeof window !== "undefined") fixLeafletIcon();

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-neutral-200">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {properties.map((p) =>
          p.lat && p.lng ? (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="min-w-[180px] text-sm">
                  <Link to={`/properties/${p.slug}`} className="font-semibold text-primary hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-1 font-bold">{formatNGN(p.price)}</p>
                  <p className="text-neutral-500">{p.city_area}, {p.city}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
