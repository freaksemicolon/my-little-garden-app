export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          emoji: string | null
          id: string
          plant_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          emoji?: string | null
          id?: string
          plant_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          emoji?: string | null
          id?: string
          plant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "user_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          diagnosis_result: Json | null
          id: string
          message_type: string
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          diagnosis_result?: Json | null
          id?: string
          message_type?: string
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          diagnosis_result?: Json | null
          id?: string
          message_type?: string
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          bond_level: number
          created_at: string
          id: string
          inner_state: Json
          plant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bond_level?: number
          created_at?: string
          id?: string
          inner_state?: Json
          plant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bond_level?: number
          created_at?: string
          id?: string
          inner_state?: Json
          plant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "user_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_records: {
        Row: {
          cause: string
          created_at: string
          detail: string | null
          id: string
          plant_id: string
          problem: string
          severity: number
          solution: string
          user_id: string
        }
        Insert: {
          cause: string
          created_at?: string
          detail?: string | null
          id?: string
          plant_id: string
          problem: string
          severity?: number
          solution: string
          user_id: string
        }
        Update: {
          cause?: string
          created_at?: string
          detail?: string | null
          id?: string
          plant_id?: string
          problem?: string
          severity?: number
          solution?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_records_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "user_plants"
            referencedColumns: ["id"]
          },
        ]
      }
      family_groups: {
        Row: {
          created_at: string
          id: string
          invite_code: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code?: string
          name?: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      proactive_messages: {
        Row: {
          created_at: string
          id: string
          message_type: string
          plant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_type: string
          plant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_type?: string
          plant_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          nickname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          nickname?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          nickname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plants: {
        Row: {
          adoption_date: string | null
          bond_level: number
          created_at: string
          health_status: string
          id: string
          image_url: string | null
          last_watered: string | null
          memo: string | null
          nickname: string
          persona: string
          plant_type: string
          species: string
          speech_style: string
          updated_at: string
          user_id: string
          watering_cycle: number
          watering_unit: string
        }
        Insert: {
          adoption_date?: string | null
          bond_level?: number
          created_at?: string
          health_status?: string
          id?: string
          image_url?: string | null
          last_watered?: string | null
          memo?: string | null
          nickname: string
          persona?: string
          plant_type?: string
          species?: string
          speech_style?: string
          updated_at?: string
          user_id: string
          watering_cycle?: number
          watering_unit?: string
        }
        Update: {
          adoption_date?: string | null
          bond_level?: number
          created_at?: string
          health_status?: string
          id?: string
          image_url?: string | null
          last_watered?: string | null
          memo?: string | null
          nickname?: string
          persona?: string
          plant_type?: string
          species?: string
          speech_style?: string
          updated_at?: string
          user_id?: string
          watering_cycle?: number
          watering_unit?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_family_member: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      join_family_by_code: { Args: { p_invite_code: string }; Returns: string }
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
