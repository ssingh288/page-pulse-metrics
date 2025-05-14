export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          applied_at: string | null
          content: string
          created_at: string
          id: string
          page_id: string
          status: string
          suggestion_type: string
        }
        Insert: {
          applied_at?: string | null
          content: string
          created_at?: string
          id?: string
          page_id: string
          status?: string
          suggestion_type: string
        }
        Update: {
          applied_at?: string | null
          content?: string
          created_at?: string
          id?: string
          page_id?: string
          status?: string
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          cpc: number | null
          created_at: string
          id: string
          keyword: string
          page_id: string
          performance_score: number | null
          updated_at: string
          volume: number | null
        }
        Insert: {
          cpc?: number | null
          created_at?: string
          id?: string
          keyword: string
          page_id: string
          performance_score?: number | null
          updated_at?: string
          volume?: number | null
        }
        Update: {
          cpc?: number | null
          created_at?: string
          id?: string
          keyword?: string
          page_id?: string
          performance_score?: number | null
          updated_at?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "keywords_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          audience: string
          campaign_type: string
          created_at: string
          generated_content: string | null
          html_content: string | null
          id: string
          industry: string
          initial_keywords: string[]
          is_draft: boolean
          metadata: string | null
          published_at: string | null
          published_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audience: string
          campaign_type: string
          created_at?: string
          generated_content?: string | null
          html_content?: string | null
          id?: string
          industry: string
          initial_keywords: string[]
          is_draft?: boolean
          metadata?: string | null
          published_at?: string | null
          published_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audience?: string
          campaign_type?: string
          created_at?: string
          generated_content?: string | null
          html_content?: string | null
          id?: string
          industry?: string
          initial_keywords?: string[]
          is_draft?: boolean
          metadata?: string | null
          published_at?: string | null
          published_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          associated_page_id: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string
          size: number
          url: string
          user_id: string
        }
        Insert: {
          associated_page_id?: string | null
          created_at?: string
          filename: string
          id?: string
          mime_type: string
          size: number
          url: string
          user_id: string
        }
        Update: {
          associated_page_id?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string
          size?: number
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_associated_page_id_fkey"
            columns: ["associated_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_metrics: {
        Row: {
          avg_time: number
          bounce_rate: number
          clicks: number
          created_at: string
          date: string
          id: string
          page_id: string
          scroll_depth: number
          visitors: number
        }
        Insert: {
          avg_time?: number
          bounce_rate?: number
          clicks?: number
          created_at?: string
          date?: string
          id?: string
          page_id: string
          scroll_depth?: number
          visitors?: number
        }
        Update: {
          avg_time?: number
          bounce_rate?: number
          clicks?: number
          created_at?: string
          date?: string
          id?: string
          page_id?: string
          scroll_depth?: number
          visitors?: number
        }
        Relationships: [
          {
            foreignKeyName: "page_metrics_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          ai_response: string | null
          created_at: string | null
          id: string
          user_input: string
        }
        Insert: {
          ai_response?: string | null
          created_at?: string | null
          id: string
          user_input: string
        }
        Update: {
          ai_response?: string | null
          created_at?: string | null
          id?: string
          user_input?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
