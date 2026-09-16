import { Link } from "react-router-dom";
import { Shield, Star, Building2 } from "lucide-react";
import { COMPANY } from "@/lib/utils/constants";
import Stats from "@/components/home/Stats";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">About Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
            Building trust in Lagos real estate since 2016
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900">Our Story</h2>
          <p className="text-neutral-600 leading-relaxed">
            {COMPANY.name} was founded with a clear mission: to make property transactions in Lagos
            transparent, efficient, and accessible. Over the years, we have grown from a small advisory
            firm into a full-service real estate and interior design company, serving hundreds of happy
            clients across Lagos.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Our team combines deep local market knowledge with international standards of service.
            Whether you are looking for a luxury villa in Ikoyi, a serviced apartment in Lekki, or a
            commercial space on Victoria Island, we have the expertise and network to help you find the
            perfect property.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900">Our Values</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { title: "Integrity", desc: "Every transaction is built on honesty and transparency. We put our clients' interests first, always.", icon: Shield },
              { title: "Excellence", desc: "We deliver the highest standard of service, from property search to final handover and beyond.", icon: Star },
              { title: "Community", desc: "We believe in building lasting relationships, not just closing deals. Our clients become part of our family.", icon: Building2 },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
                <v.icon className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* CTA */}
      <section className="bg-neutral-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Work With Us?</h2>
          <p className="mt-4 text-lg text-neutral-400">Let our team help you find your perfect property.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/properties" className="rounded-lg bg-primary/90 px-6 py-3 text-base font-medium text-white hover:bg-primary">
              Browse Properties
            </Link>
            <Link to="/contact" className="rounded-lg border-2 border-white/30 px-6 py-3 text-base font-medium text-white hover:border-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
