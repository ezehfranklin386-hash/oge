import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let _client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
  }
  if (!_client) {
    _client = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }
  return _client;
}
