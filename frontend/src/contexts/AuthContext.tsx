import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** True when the signed-in user has a row in the public.admins table. */
  isAdmin: boolean;
  /** True while the is_admin() RPC check is in flight. */
  adminLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  signIn: async () => ({}),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setAdminLoading(false);
      return;
    }

    const supabase = getSupabase();

    // Check admin status for a user. SECURITY DEFINER RPC — RLS still enforces writes.
    async function checkAdmin(currentUser: User | null) {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc("is_admin");
        setIsAdmin(error ? false : Boolean(data));
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      void checkAdmin(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // Reset the flag immediately on auth changes, then re-check.
      if (!currentUser) {
        setIsAdmin(false);
        setAdminLoading(false);
      } else {
        setAdminLoading(true);
        void checkAdmin(currentUser);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) return { error: "Supabase not configured" };
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setAdminLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
