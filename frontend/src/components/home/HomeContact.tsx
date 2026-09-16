import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT, whatsappLink } from "@/lib/utils/constants";

export default function HomeContact() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-3 text-lg text-neutral-500">
            We would love to hear from you
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">Phone</h3>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="mt-1 text-sm text-primary hover:underline"
            >
              {CONTACT.phone}
            </a>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">WhatsApp</h3>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-primary hover:underline"
            >
              {CONTACT.whatsapp}
            </a>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <Mail className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">Email</h3>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-1 text-sm text-primary hover:underline"
            >
              {CONTACT.email}
            </a>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">Address</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {CONTACT.addressFull}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Contact Us
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
