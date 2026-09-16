// Supabase generated types — placeholder until `supabase gen types` is run.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          slug: string;
          price: number;
          listing_type: string;
          property_type: string | null;
          beds: number | null;
          baths: number | null;
          size_sqm: number | null;
          address: string | null;
          city_area: string | null;
          city: string;
          description: string | null;
          features: string[];
          images: string[];
          is_featured: boolean;
          status: string;
          lat: number | null;
          lng: number | null;
          agent_id: string | null;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          price: number;
          listing_type: string;
          property_type?: string | null;
          beds?: number | null;
          baths?: number | null;
          size_sqm?: number | null;
          address?: string | null;
          city_area?: string | null;
          city?: string;
          description?: string | null;
          features?: string[];
          images?: string[];
          is_featured?: boolean;
          status?: string;
          lat?: number | null;
          lng?: number | null;
          agent_id?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          price?: number;
          listing_type?: string;
          property_type?: string | null;
          beds?: number | null;
          baths?: number | null;
          size_sqm?: number | null;
          address?: string | null;
          city_area?: string | null;
          city?: string;
          description?: string | null;
          features?: string[];
          images?: string[];
          is_featured?: boolean;
          status?: string;
          lat?: number | null;
          lng?: number | null;
          agent_id?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          property_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          message: string | null;
          source: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string;
          status?: string;
          created_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          photo_url: string | null;
          bio: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          text: string;
          rating: number;
          property_ref: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          text: string;
          rating?: number;
          property_ref?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          text?: string;
          rating?: number;
          property_ref?: string | null;
          approved?: boolean;
          created_at?: string;
        };
      };
    };
    Enums: Record<string, never>;
  };
}
