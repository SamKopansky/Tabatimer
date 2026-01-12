export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          equipment: Database["public"]["Enums"]["equipment"]
          form_tips: string | null
          id: string
          image_url: string | null
          instructions: string
          muscle_groups: string[]
          name: string
        }
        Insert: {
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty"]
          equipment: Database["public"]["Enums"]["equipment"]
          form_tips?: string | null
          id?: string
          image_url?: string | null
          instructions: string
          muscle_groups: string[]
          name: string
        }
        Update: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty"]
          equipment?: Database["public"]["Enums"]["equipment"]
          form_tips?: string | null
          id?: string
          image_url?: string | null
          instructions?: string
          muscle_groups?: string[]
          name?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          audio_enabled: boolean
          default_rest_duration: number
          default_work_duration: number
          id: string
          preferred_equipment: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_enabled?: boolean
          default_rest_duration?: number
          default_work_duration?: number
          id?: string
          preferred_equipment?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_enabled?: boolean
          default_rest_duration?: number
          default_work_duration?: number
          id?: string
          preferred_equipment?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      workout_history: {
        Row: {
          completed_at: string
          duration_seconds: number
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["workout_status"]
          user_id: string
          workout_id: string | null
          workout_snapshot: Json
        }
        Insert: {
          completed_at?: string
          duration_seconds: number
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["workout_status"]
          user_id: string
          workout_id?: string | null
          workout_snapshot: Json
        }
        Update: {
          completed_at?: string
          duration_seconds?: number
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["workout_status"]
          user_id?: string
          workout_id?: string | null
          workout_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "workout_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_history_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          duration: number
          exercises: Json
          generated_by: Database["public"]["Enums"]["workout_generation_source"]
          id: string
          name: string
          prompt: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          duration: number
          exercises: Json
          generated_by: Database["public"]["Enums"]["workout_generation_source"]
          id?: string
          name: string
          prompt?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          duration?: number
          exercises?: Json
          generated_by?: Database["public"]["Enums"]["workout_generation_source"]
          id?: string
          name?: string
          prompt?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty: "beginner" | "intermediate" | "advanced"
      equipment:
        | "bodyweight"
        | "dumbbells"
        | "kettlebell"
        | "barbell"
        | "bands"
        | "pull_up_bar"
        | "bench"
        | "trx"
        | "medicine_ball"
        | "box"
        | "none"
      workout_generation_source: "ai" | "template" | "manual"
      workout_status: "completed" | "abandoned"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      difficulty: ["beginner", "intermediate", "advanced"],
      equipment: [
        "bodyweight",
        "dumbbells",
        "kettlebell",
        "barbell",
        "bands",
        "pull_up_bar",
        "bench",
        "trx",
        "medicine_ball",
        "box",
        "none",
      ],
      workout_generation_source: ["ai", "template", "manual"],
      workout_status: ["completed", "abandoned"],
    },
  },
} as const

