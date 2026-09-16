import { Link } from "react-router-dom";
import { COMPANY, CONTACT, SOCIALS } from "@/lib/utils/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Our Agents", href: "/agents" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Property Sales",
  "Property Lettings",
  "Interior Design",
  "Property Management",
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="mb-3 flex items-center gap-2">
            <img
              src="/brand/logo.jpeg"
              alt={COMPANY.shortName}
              width={36}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-90"
            />
            <span className="text-sm font-bold text-white">{COMPANY.shortName}</span>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            {COMPANY.description.slice(0, 120)}...
          </p>
          <p className="mt-3 text-xs text-neutral-500">{COMPANY.rc}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-sm text-neutral-400 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Services</h4>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s} className="text-sm text-neutral-400">{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact Us</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>{CONTACT.phone}</li>
            <li>{CONTACT.email}</li>
            <li>{CONTACT.addressFull}</li>
          </ul>
          <div className="mt-4 flex gap-3">
            {Object.entries(SOCIALS).map(([name, url]) => {
              const Icon = socialIcons[name];
              return (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary hover:text-white"
                  aria-label={name}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : name[0].toUpperCase()}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-4 text-center text-xs text-neutral-500 sm:px-6">
        {new Date().getFullYear()} {COMPANY.name}. All rights reserved. {COMPANY.rc}
      </div>
    </footer>
  );
}
