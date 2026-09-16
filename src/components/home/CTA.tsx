import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-neutral-900 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Find Your Next Property?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
          Whether you are buying, selling, renting, or looking to transform a space — our team is ready to help.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/properties" className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary">
            Browse Properties
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-medium text-white transition-colors hover:border-white hover:bg-white/10">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
