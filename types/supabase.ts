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
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string;
          start_time: string;
          end_time: string;
          duration: number;
          status: "pending" | "active" | "completed" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id: string;
          start_time: string;
          end_time: string;
          duration: number;
          status: "pending" | "active" | "completed" | "cancelled";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_id?: string;
          start_time?: string;
          end_time?: string;
          duration?: number;
          status?: "pending" | "active" | "completed" | "cancelled";
          created_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          model: string;
          manufacturer: string;
          year: number;
          category: string;
          location: string;
          status: string;
          features: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          model: string;
          manufacturer: string;
          year: number;
          category: string;
          location: string;
          status?: string;
          features?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          model?: string;
          manufacturer?: string;
          year?: number;
          category?: string;
          location?: string;
          status?: string;
          features?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
