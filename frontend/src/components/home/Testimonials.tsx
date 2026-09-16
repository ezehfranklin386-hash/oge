import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/supabase/queries";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  if (testimonials.length === 0) return null;

  function prev() {
    setDirection(-1);
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  }
  function next() {
    setDirection(1);
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  }

  const t = testimonials[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">What Our Clients Say</h2>
        <p className="mt-3 text-lg text-neutral-500">Trusted by hundreds of satisfied clients</p>

        <div className="mt-12 overflow-hidden rounded-2xl bg-neutral-50 p-8 sm:p-12">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-5 w-5 ${i < t.rating ? "text-yellow-400" : "text-neutral-300"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-6 text-lg leading-relaxed text-neutral-700 sm:text-xl">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div className="mt-6">
                <p className="font-semibold text-neutral-900">{t.client_name}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={prev} className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-primary hover:text-primary" aria-label="Previous testimonial">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-sm text-neutral-500">{current + 1} / {testimonials.length}</span>
            <button onClick={next} className="rounded-full border border-neutral-300 p-2 text-neutral-500 transition-colors hover:border-primary hover:text-primary" aria-label="Next testimonial">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
