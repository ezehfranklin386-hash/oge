import { lazy, Suspense } from "react";
import type { Property } from "@/lib/supabase/queries";

const PropertyMap = lazy(() => import("./PropertyMap"));

export default function PropertyMapWrapper({ properties, height }: { properties: Property[]; height?: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[300px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
          <p className="text-sm text-neutral-500">Loading map...</p>
        </div>
      }
    >
      <PropertyMap properties={properties} height={height} />
    </Suspense>
  );
}
