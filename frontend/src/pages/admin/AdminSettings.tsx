import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const { settings, saveSettings, loading } = useSettings();
  const [form, setForm] = useState({
    phone: settings.phone,
    phone2: settings.phone2 || "",
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    instagram: settings.instagram || "",
    facebook: settings.facebook || "",
    twitter: settings.twitter || "",
    linkedin: settings.linkedin || "",
    tiktok: settings.tiktok || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      phone: settings.phone,
      phone2: settings.phone2 || "",
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      instagram: settings.instagram || "",
      facebook: settings.facebook || "",
      twitter: settings.twitter || "",
      linkedin: settings.linkedin || "",
      tiktok: settings.tiktok || "",
    });
    setErrors({});
  }, [settings]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.phone.trim()) {
      newErrors.phone = "Primary phone number is required";
    }

    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSaved(false);
    try {
      await saveSettings(form);
      setSaved(true);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Contact Settings</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Update the contact details shown across your website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">Phone Numbers</h2>
          <p className="mt-1 text-sm text-neutral-500">Add up to two public phone numbers.</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Primary Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+234 801 234 5678"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Secondary Phone</label>
              <input
                type="tel"
                value={form.phone2}
                onChange={(e) => update("phone2", e.target.value)}
                placeholder="+234 802 234 5678"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-6">
          <h2 className="text-lg font-semibold text-neutral-900">WhatsApp & Email</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="+234 801 234 5678"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Business Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="info@ginterior.ng"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-6">
          <h2 className="text-lg font-semibold text-neutral-900">Address</h2>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-neutral-700">Public Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Lagos, Nigeria"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-6">
          <h2 className="text-lg font-semibold text-neutral-900">Social Media</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Full profile URLs shown in the site footer. Leave blank to hide a network.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Instagram URL</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="https://instagram.com/ginterior"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Facebook URL</label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => update("facebook", e.target.value)}
                placeholder="https://facebook.com/ginterior"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Twitter / X URL</label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => update("twitter", e.target.value)}
                placeholder="https://x.com/ginterior"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/ginterior"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700">TikTok URL</label>
              <input
                type="url"
                value={form.tiktok}
                onChange={(e) => update("tiktok", e.target.value)}
                placeholder="https://tiktok.com/@ginterior"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </section>

        {saved && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Contact details saved successfully.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
