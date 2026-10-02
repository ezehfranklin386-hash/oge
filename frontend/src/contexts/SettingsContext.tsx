import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

export interface Socials {
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
}

type SiteSettings = {
  phone: string;
  phoneRaw: string;
  phone2?: string;
  phone2Raw?: string;
  whatsapp: string;
  whatsappRaw: string;
  email: string;
  address: string;
  addressFull: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
};

const DEFAULT_SOCIALS: Socials = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  twitter: "https://x.com/",
  linkedin: "https://linkedin.com/",
  tiktok: "",
};

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+234 000 000 0000",
  phoneRaw: "2340000000000",
  phone2: "",
  phone2Raw: "",
  whatsapp: "+234 000 000 0000",
  whatsappRaw: "2340000000000",
  email: "hello@ginterior.com",
  address: "Lagos, Nigeria",
  addressFull: "Lagos, Nigeria",
  ...DEFAULT_SOCIALS,
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  saveSettings: (data: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  saveSettings: async () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("234")) {
      return `+234 ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    }
    if (digits.startsWith("0")) {
      return `+234 ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
    }
    return raw;
  }

  function normalizePhoneRaw(raw: string): string {
    return raw.replace(/\D/g, "");
  }

  function rowToSettings(row: SiteSettingsRow): SiteSettings {
    return {
      phone: row.phone || DEFAULT_SETTINGS.phone,
      phoneRaw: row.phone_raw || DEFAULT_SETTINGS.phoneRaw,
      phone2: row.phone2 || DEFAULT_SETTINGS.phone2,
      phone2Raw: row.phone2_raw || DEFAULT_SETTINGS.phone2Raw,
      whatsapp: row.whatsapp || DEFAULT_SETTINGS.whatsapp,
      whatsappRaw: row.whatsapp_raw || DEFAULT_SETTINGS.whatsappRaw,
      email: row.email || DEFAULT_SETTINGS.email,
      address: row.address || DEFAULT_SETTINGS.address,
      addressFull: row.address_full || DEFAULT_SETTINGS.addressFull,
      instagram: row.instagram || DEFAULT_SETTINGS.instagram,
      facebook: row.facebook || DEFAULT_SETTINGS.facebook,
      twitter: row.twitter || DEFAULT_SETTINGS.twitter,
      linkedin: row.linkedin || DEFAULT_SETTINGS.linkedin,
      tiktok: row.tiktok || DEFAULT_SETTINGS.tiktok,
    };
  }

  function readLocalSettings(): SiteSettings {
    const stored = localStorage.getItem("site-settings");
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }

  async function loadSettings() {
    if (!isSupabaseConfigured) {
      setSettings(readLocalSettings());
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings(rowToSettings(data));
      }
    } catch {
      setSettings(readLocalSettings());
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(data: Partial<SiteSettings>) {
    const newSettings: SiteSettings = {
      ...settings,
      ...data,
      phoneRaw: data.phone ? normalizePhoneRaw(data.phone) : settings.phoneRaw,
      phone2Raw: data.phone2 ? normalizePhoneRaw(data.phone2) : settings.phone2Raw,
      whatsappRaw: data.whatsapp ? normalizePhoneRaw(data.whatsapp) : settings.whatsappRaw,
      addressFull: data.address || settings.addressFull,
    };
    setSettings(newSettings);

    if (!isSupabaseConfigured) {
      localStorage.setItem("site-settings", JSON.stringify(newSettings));
      return;
    }

    try {
      const supabase = getSupabase();
      // updated_at is owned by the DB trigger — not sent from the client.
      const { error } = await supabase.from("site_settings").upsert({
        id: "main",
        phone: newSettings.phone,
        phone_raw: newSettings.phoneRaw,
        phone2: newSettings.phone2 || null,
        phone2_raw: newSettings.phone2Raw || null,
        whatsapp: newSettings.whatsapp,
        whatsapp_raw: newSettings.whatsappRaw,
        email: newSettings.email,
        address: newSettings.address,
        address_full: newSettings.addressFull,
        instagram: newSettings.instagram || null,
        facebook: newSettings.facebook || null,
        twitter: newSettings.twitter || null,
        linkedin: newSettings.linkedin || null,
        tiktok: newSettings.tiktok || null,
      });
      if (error) throw error;
    } catch {
      localStorage.setItem("site-settings", JSON.stringify(newSettings));
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function getWhatsappLink(settings: SiteSettings, propertyTitle?: string, propertyUrl?: string): string {
  const base = `https://wa.me/${settings.whatsappRaw}`;
  const text = propertyTitle
    ? `Hi, I'm interested in "${propertyTitle}" ${propertyUrl || ""}`
    : "Hi, I'd like to enquire about your services.";
  return `${base}?text=${encodeURIComponent(text)}`;
}
