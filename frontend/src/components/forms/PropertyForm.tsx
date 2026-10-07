import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LISTING_TYPES, LAGOS_AREAS } from "@/lib/utils/constants";
import type { Property } from "@/lib/supabase/queries";
import { uploadImage, uploadVideo, isStorageUrl, deleteImagesByUrls } from "@/lib/supabase/storage";
import { getYouTubeId, getVimeoId } from "@/lib/utils/video";

interface PropertyFormProps {
  property?: Property | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Property>) => Promise<void>;
}

const EMPTY: Partial<Property> = {
  title: "",
  slug: "",
  price: 0,
  listing_type: "sale",
  property_type: "house",
  beds: 0,
  baths: 0,
  size_sqm: 0,
  address: "",
  city_area: "",
  city: "Lagos",
  description: "",
  features: [],
  images: [],
  video_url: null,
  is_featured: false,
  status: "available",
  lat: null,
  lng: null,
};

export default function PropertyForm({ property, open, onClose, onSave }: PropertyFormProps) {
  const [form, setForm] = useState<Partial<Property>>(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUrlDraft, setVideoUrlDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const originalImagesRef = useRef<string[]>([]);
  const originalVideoRef = useRef<string | null>(null);

  useEffect(() => {
    if (property) {
      setForm({ ...property });
      setFeaturesText((property.features || []).join("\n"));
      originalImagesRef.current = property.images || [];
      originalVideoRef.current = property.video_url ?? null;
    } else {
      setForm({ ...EMPTY });
      setFeaturesText("");
      originalImagesRef.current = [];
      originalVideoRef.current = null;
    }
    setUrlDraft("");
    setVideoUrlDraft("");
    setError("");
  }, [property, open]);

  function set<K extends keyof Property>(key: K, value: Property[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function makeSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: (f.images || []).filter((_, i) => i !== index) }));
  }

  function addImageUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
    setUrlDraft("");
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];
    const failures: string[] = [];
    // Sequential uploads — gentler on phone connections.
    for (const file of files) {
      try {
        uploaded.push(await uploadImage(file, "properties"));
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }
    if (uploaded.length) setForm((f) => ({ ...f, images: [...(f.images || []), ...uploaded] }));
    if (failures.length) setError(`${failures.length} of ${files.length} image(s) failed — ${failures[0]}`);
    setUploading(false);
  }

  async function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploadingVideo(true);
    setError("");
    try {
      set("video_url", await uploadVideo(file, "properties"));
      setVideoUrlDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  }

  function addVideoUrl() {
    const url = videoUrlDraft.trim();
    if (!url) return;
    set("video_url", url);
    setVideoUrlDraft("");
  }

  function removeVideo() {
    set("video_url", null);
  }

  function requestClose() {
    if (uploading || uploadingVideo) return;
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = {
        ...form,
        slug: form.slug || makeSlug(form.title || ""),
        features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
        images: (form.images || []).filter(Boolean),
        video_url: (form.video_url || "").trim() || null,
        price: Number(form.price) || 0,
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        size_sqm: Number(form.size_sqm) || 0,
      };
      await onSave(data);
      // Best-effort cleanup of storage objects removed from this property.
      // Only storage-owned URLs — pasted external URLs are never touched.
      const newImages: string[] = data.images || [];
      const removed = originalImagesRef.current.filter((u) => isStorageUrl(u) && !newImages.includes(u));
      if (removed.length) void deleteImagesByUrls(removed);
      // Same for a replaced/removed video — storage-owned URLs only.
      const newVideo = data.video_url ?? null;
      const oldVideo = originalVideoRef.current;
      if (oldVideo && oldVideo !== newVideo && isStorageUrl(oldVideo)) {
        void deleteImagesByUrls([oldVideo]);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const images = form.images || [];
  const videoUrl = form.video_url || null;
  const videoYouTubeId = videoUrl ? getYouTubeId(videoUrl) : null;
  const videoVimeoId = videoUrl && !videoYouTubeId ? getVimeoId(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={requestClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            {property ? "Edit Property" : "Add Property"}
          </h2>
          <button onClick={requestClose} className="text-neutral-400 hover:text-neutral-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Title *</label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Luxury 4-Bedroom Duplex"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Price (₦) *</label>
              <input
                type="number"
                required
                value={form.price || ""}
                onChange={(e) => set("price", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Status</label>
              <select
                value={form.status || "available"}
                onChange={(e) => set("status", e.target.value as Property["status"])}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Listing Type</label>
              <select
                value={form.listing_type || "sale"}
                onChange={(e) => set("listing_type", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Property Type</label>
              <select
                value={form.property_type || "house"}
                onChange={(e) => set("property_type", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Beds</label>
              <input
                type="number"
                min="0"
                value={form.beds || ""}
                onChange={(e) => set("beds", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Baths</label>
              <input
                type="number"
                min="0"
                value={form.baths || ""}
                onChange={(e) => set("baths", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Size (m²)</label>
              <input
                type="number"
                min="0"
                value={form.size_sqm || ""}
                onChange={(e) => set("size_sqm", Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Area</label>
              <select
                value={form.city_area || ""}
                onChange={(e) => set("city_area", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select area</option>
                {LAGOS_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Address</label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => set("address", e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Plot 12, Admiralty Way"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Describe the property..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Photos</label>

            {images.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200">
                    <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={uploading}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                      aria-label={`Remove photo ${i + 1}`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-primary hover:text-primary ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {uploading ? "Uploading..." : "Upload photos"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={uploading}
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="url"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="...or paste an image URL"
                />
                <Button type="button" variant="outline" onClick={addImageUrl} disabled={!urlDraft.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Video</label>

            {videoUrl && (
              <div className="relative mb-3 overflow-hidden rounded-lg border border-neutral-200">
                {videoYouTubeId || videoVimeoId ? (
                  <div className="flex items-center gap-2 bg-neutral-50 px-3 py-6 text-sm text-neutral-600">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span className="truncate">
                      {videoYouTubeId ? "YouTube" : "Vimeo"} video link — plays on the property page
                    </span>
                  </div>
                ) : (
                  <video src={videoUrl} controls preload="metadata" className="max-h-48 w-full bg-black" />
                )}
                <button
                  type="button"
                  onClick={removeVideo}
                  disabled={uploading || uploadingVideo}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                  aria-label="Remove video"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-primary hover:text-primary ${uploading || uploadingVideo ? "pointer-events-none opacity-60" : ""}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {uploadingVideo ? "Uploading..." : "Upload video"}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={uploading || uploadingVideo}
                  onChange={handleVideoFile}
                  className="hidden"
                />
              </label>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  type="url"
                  value={videoUrlDraft}
                  onChange={(e) => setVideoUrlDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addVideoUrl();
                    }
                  }}
                  className="w-full min-w-0 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="...or paste a YouTube or video URL"
                />
                <Button type="button" variant="outline" onClick={addVideoUrl} disabled={!videoUrlDraft.trim()}>
                  Add
                </Button>
              </div>
            </div>

            <p className="mt-1.5 text-xs text-neutral-500">
              MP4, WebM or MOV up to 50MB — or paste a YouTube/Vimeo link.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Features (one per line)</label>
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Swimming Pool&#10;24/7 Security&#10;Smart Home"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_featured || false}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-neutral-700">Featured property</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={requestClose} disabled={uploading || uploadingVideo}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading || uploadingVideo}>
              {saving ? "Saving..." : property ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
