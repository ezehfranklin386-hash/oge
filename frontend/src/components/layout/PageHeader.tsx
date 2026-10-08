interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Shared page banner: estate photo background + dark overlay, white heading on
 * top. Mirrors the layering used by the homepage hero (HeroSearch). The
 * bg-[#0a0a1a] base keeps the banner dark if the image ever fails to load.
 */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a1a] py-20">
      <img
        src="/brand/estate-header.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      />
      {/* Dark overlays for text readability */}
      <div className="absolute inset-0 z-[2] bg-black/40" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a0a1a]/70 via-transparent to-transparent" />

      <div className="relative z-[3] mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
