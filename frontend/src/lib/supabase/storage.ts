import { getSupabase } from "./client";

export type ImageFolder = "properties" | "agents";

export const IMAGE_BUCKET = "media" as const;

const MAX_DIMENSION = 1600; // px, longest side
const JPEG_QUALITY = 0.8;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB after compression
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// Videos are uploaded raw (no client-side transcoding); 50MB matches the
// Supabase free-tier per-file limit.
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;
const VIDEO_EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const PUBLIC_MARKER = `/storage/v1/object/public/${IMAGE_BUCKET}/`;

/** Decode + resize (aspect preserved, longest side 1600px) + re-encode as JPEG @80%.
 *  Throws Error with a user-facing message on invalid type, decode failure, or oversize. */
export async function compressImage(file: File): Promise<Blob> {
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  }

  // Decode with EXIF orientation applied so phone photos are not sideways.
  let bitmap: ImageBitmap | HTMLImageElement;
  let objectUrl: string | null = null;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Fallback for browsers without createImageBitmap orientation support.
    objectUrl = URL.createObjectURL(file);
    bitmap = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read this image."));
      img.src = objectUrl as string;
    });
  }

  try {
    const width = bitmap.width;
    const height = bitmap.height;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process this image.");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) throw new Error("Could not process this image.");
    if (blob.size > MAX_UPLOAD_BYTES) {
      throw new Error("Image is still larger than 5MB after compression — try a smaller photo.");
    }
    return blob;
  } finally {
    if ("close" in bitmap) bitmap.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

/** Validate → compress → upload to `${folder}/<timestamp>-<uuid>.jpg` → return public URL.
 *  Throws Error with a user-facing message. */
export async function uploadImage(file: File, folder: ImageFolder): Promise<string> {
  const supabase = getSupabase();
  const blob = await compressImage(file);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, {
      contentType: "image/jpeg",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Validate → upload the raw file (no transcoding) to
 *  `${folder}/<timestamp>-<uuid>.<ext>` → return public URL.
 *  Throws Error with a user-facing message on invalid type, oversize,
 *  or upload failure. */
export async function uploadVideo(file: File, folder: ImageFolder): Promise<string> {
  const supabase = getSupabase();
  if (!(ALLOWED_VIDEO_TYPES as readonly string[]).includes(file.type)) {
    throw new Error("Only MP4, WebM, or MOV videos are allowed.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video must be 50MB or smaller — try a shorter or compressed clip.");
  }
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${VIDEO_EXTENSIONS[file.type]}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** True if url points at our public bucket (we own the storage object). */
export function isStorageUrl(url: string): boolean {
  return url.includes(PUBLIC_MARKER);
}

/** Extract "properties/abc.jpg" from a public URL; null if not one of ours. */
export function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;
  const path = decodeURIComponent(url.slice(idx + PUBLIC_MARKER.length).split("?")[0]);
  return path || null;
}

/** Best-effort: remove one storage object by public URL. Never throws (logs on failure). */
export async function deleteImageByUrl(url: string): Promise<void> {
  const path = storagePathFromUrl(url);
  if (!path) return;
  const { error } = await getSupabase().storage.from(IMAGE_BUCKET).remove([path]);
  if (error) console.warn("storage: failed to delete", path, error.message);
}

/** Best-effort: remove many objects by public URL. Never throws. */
export async function deleteImagesByUrls(urls: string[]): Promise<void> {
  const paths = urls.map(storagePathFromUrl).filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  const { error } = await getSupabase().storage.from(IMAGE_BUCKET).remove(paths);
  if (error) console.warn("storage: failed to delete", paths, error.message);
}
