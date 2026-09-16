import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NoImagePlaceholder from "@/components/ui/NoImagePlaceholder";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return <NoImagePlaceholder className="aspect-[16/9] rounded-xl" />;
  }

  const allImages = images;

  function prev() {
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  }
  function next() {
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={allImages[current]}
            alt={`${title} — photo ${current + 1}`}
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {current + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                i === current
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
