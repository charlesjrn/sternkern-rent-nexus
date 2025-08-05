export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      inventory: {
        Row: {
          condition: string | null
          created_at: string | null
          house_number: string | null
          id: number
          item_category: string
          item_name: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          quantity: number
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          house_number?: string | null
          id?: number
          item_category: string
          item_name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          house_number?: string | null
          id?: number
          item_category?: string
          item_name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          quantity?: number
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          billing_month: string | null
          date_generated: string | null
          electricity: number | null
          garbage: number | null
          house_number: string | null
          id: number
          invoice_id: string | null
          other_utilities: number | null
          payment_status: string | null
          rent_amount: number | null
          tenant_name: string | null
          total_due: number | null
          water: number | null
        }
        Insert: {
          billing_month?: string | null
          date_generated?: string | null
          electricity?: number | null
          garbage?: number | null
          house_number?: string | null
          id?: number
          invoice_id?: string | null
          other_utilities?: number | null
          payment_status?: string | null
          rent_amount?: number | null
          tenant_name?: string | null
          total_due?: number | null
          water?: number | null
        }
        Update: {
          billing_month?: string | null
          date_generated?: string | null
          electricity?: number | null
          garbage?: number | null
          house_number?: string | null
          id?: number
          invoice_id?: string | null
          other_utilities?: number | null
          payment_status?: string | null
          rent_amount?: number | null
          tenant_name?: string | null
          total_due?: number | null
          water?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
        ]
      }
      maintenance: {
        Row: {
          contractor_name: string | null
          cost: number | null
          date_of_maintenance: string | null
          description: string | null
          house_number: string | null
          id: number
          status: string | null
        }
        Insert: {
          contractor_name?: string | null
          cost?: number | null
          date_of_maintenance?: string | null
          description?: string | null
          house_number?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          contractor_name?: string | null
          cost?: number | null
          date_of_maintenance?: string | null
          description?: string | null
          house_number?: string | null
          id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
        ]
      }
      payments: {
        Row: {
          amount_paid: number | null
          house_number: string | null
          id: number
          invoice_id: string | null
          payment_date: string | null
          payment_method: string | null
          tenant_name: string | null
        }
        Insert: {
          amount_paid?: number | null
          house_number?: string | null
          id?: number
          invoice_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          tenant_name?: string | null
        }
        Update: {
          amount_paid?: number | null
          house_number?: string | null
          id?: number
          invoice_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          tenant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      tenants: {
        Row: {
          arrears: number | null
          contact_number: string | null
          email: string | null
          house_number: string | null
          id: number
          tenant_name: string | null
        }
        Insert: {
          arrears?: number | null
          contact_number?: string | null
          email?: string | null
          house_number?: string | null
          id?: number
          tenant_name?: string | null
        }
        Update: {
          arrears?: number | null
          contact_number?: string | null
          email?: string | null
          house_number?: string | null
          id?: number
          tenant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
        ]
      }
      units: {
        Row: {
          bedrooms: number
          deposit_amount: number | null
          house_number: string
          id: number
          occupancy_status: string | null
          rent_amount: number | null
        }
        Insert: {
          bedrooms: number
          deposit_amount?: number | null
          house_number: string
          id?: number
          occupancy_status?: string | null
          rent_amount?: number | null
        }
        Update: {
          bedrooms?: number
          deposit_amount?: number | null
          house_number?: string
          id?: number
          occupancy_status?: string | null
          rent_amount?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          contact: string | null
          created_at: string | null
          id: number
          password: string
          role: string
          username: string
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          id?: number
          password: string
          role: string
          username: string
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          id?: number
          password?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      utilities: {
        Row: {
          billing_month: string | null
          electricity: number | null
          garbage: number | null
          house_number: string | null
          id: number
          other_utilities: number | null
          tenant_name: string | null
          water: number | null
        }
        Insert: {
          billing_month?: string | null
          electricity?: number | null
          garbage?: number | null
          house_number?: string | null
          id?: number
          other_utilities?: number | null
          tenant_name?: string | null
          water?: number | null
        }
        Update: {
          billing_month?: string | null
          electricity?: number | null
          garbage?: number | null
          house_number?: string | null
          id?: number
          other_utilities?: number | null
          tenant_name?: string | null
          water?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "utilities_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
        ]
      }
    }
    Views: {
      arrears_summary: {
        Row: {
          arrears: number | null
          house_number: string | null
          tenant_name: string | null
        }
        Insert: {
          arrears?: number | null
          house_number?: string | null
          tenant_name?: string | null
        }
        Update: {
          arrears?: number | null
          house_number?: string | null
          tenant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_house_number_fkey"
            columns: ["house_number"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["house_number"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
