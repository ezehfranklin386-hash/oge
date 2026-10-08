import { Link } from "react-router-dom";
import { Heart, Lock, PackageCheck, Scale, Shield, Star, Wallet } from "lucide-react";
import { COMPANY } from "@/lib/utils/constants";
import Stats from "@/components/home/Stats";
import PageHeader from "@/components/layout/PageHeader";

export default function About() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="Building Value. Creating Homes. — quality housing, honest service and value for money"
      />

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-neutral-900">Our Story</h2>
          <p className="text-neutral-600 leading-relaxed">
            {COMPANY.name} was established in 2015 by Egbuleze Godwin. We began with interior
            designing and expanded into housing development and related property services —
            driven by one goal: to give clients real value for their money and to help solve
            Nigeria&apos;s housing and accommodation problem.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Today we combine interior finishing with housing and property services for clients
            across Lagos and Nigerians in the diaspora. Over three years we have delivered more
            than 35 housing project units, including an 18-unit housing project completed in one
            year and three months. Our long-term target is to deliver more than 200 housing units
            in under three years, with planned expansion into Abuja and Port Harcourt — helping
            more Nigerians become homeowners.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Our Mission</h3>
            <p className="mt-2 text-neutral-600 leading-relaxed">
              To deliver affordable housing units.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Our Vision</h3>
            <p className="mt-2 text-neutral-600 leading-relaxed">
              To create value for the people.
            </p>
          </div>
        </div>

        {/* Brand promise */}
        <blockquote className="mt-10 border-l-4 border-primary pl-6">
          <p className="text-xl italic leading-relaxed text-neutral-700">
            &ldquo;We believe a property is more than a structure. It is a place to live, a
            long-term investment and a reflection of the value a client expects to receive. Our
            work is guided by honesty, integrity, quality and delivery.&rdquo;
          </p>
          <cite className="mt-3 block text-sm not-italic text-neutral-500">
            — {COMPANY.shortName}
          </cite>
        </blockquote>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900">Our Values</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-500">
            The principles behind every project we take on.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Honesty", desc: "Clear, honest communication at every stage — no exaggerated claims, no surprises.", icon: Shield },
              { title: "Integrity", desc: "We keep our word. Written agreements, due diligence and transparency guide every deal.", icon: Scale },
              { title: "Quality", desc: "High-quality building structures and finishing — the standard behind every project we deliver.", icon: Star },
              { title: "Value for Money", desc: "Quality structures and finishing that make every naira count.", icon: Wallet },
              { title: "Client Satisfaction", desc: "Our measure of service — your confidence in the outcome matters most.", icon: Heart },
              { title: "Trust", desc: "Earned through visible evidence of work and honest, precise guidance.", icon: Lock },
              { title: "Delivery", desc: "We deliver what we promise, on the scope and timeline agreed.", icon: PackageCheck },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
                <v.icon className="mx-auto h-9 w-9 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{v.desc}</p>
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
