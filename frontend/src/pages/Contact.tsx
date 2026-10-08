import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useSettings, getWhatsappLink } from "@/contexts/SettingsContext";
import ContactForm from "@/components/forms/ContactForm";
import PageHeader from "@/components/layout/PageHeader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Default to Lagos city center if no specific coordinates
const LAGOS_CENTER = [6.5244, 3.3792] as [number, number];

export default function Contact() {
  const { settings } = useSettings();
  return (
    <>
      <PageHeader title="Contact Us" subtitle="We would love to hear from you" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">Get in Touch</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-6">
                <Phone className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Phone</h3>
                <a href={`tel:${settings.phoneRaw}`} className="mt-1 text-sm text-primary hover:underline">
                  {settings.phone}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">WhatsApp</h3>
                <a href={getWhatsappLink(settings)} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-primary hover:underline">
                  {settings.whatsapp}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Email</h3>
                <a href={`mailto:${settings.email}`} className="mt-1 text-sm text-primary hover:underline">
                  {settings.email}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Address</h3>
                <p className="mt-1 text-sm text-neutral-600">{settings.address}</p>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <MapContainer center={LAGOS_CENTER} zoom={12} className="h-[250px] w-full" scrollWheelZoom={false}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={LAGOS_CENTER} />
              </MapContainer>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Send Us a Message</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Fill out the form below and we will get back to you shortly.
            </p>
            <div className="mt-6 rounded-xl border border-neutral-200 p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
