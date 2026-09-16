import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { CONTACT, whatsappLink } from "@/lib/utils/constants";
import ContactForm from "@/components/forms/ContactForm";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Default to Lagos city center if no specific coordinates
const LAGOS_CENTER = [6.5244, 3.3792] as [number, number];

export default function Contact() {
  return (
    <>
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
            We would love to hear from you
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">Get in Touch</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-6">
                <Phone className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Phone</h3>
                <a href={`tel:${CONTACT.phoneRaw}`} className="mt-1 text-sm text-primary hover:underline">
                  {CONTACT.phone}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">WhatsApp</h3>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-primary hover:underline">
                  {CONTACT.whatsapp}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Email</h3>
                <a href={`mailto:${CONTACT.email}`} className="mt-1 text-sm text-primary hover:underline">
                  {CONTACT.email}
                </a>
              </div>
              <div className="rounded-xl border border-neutral-200 p-6">
                <MapPin className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-neutral-900">Address</h3>
                <p className="mt-1 text-sm text-neutral-600">{CONTACT.addressFull}</p>
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
