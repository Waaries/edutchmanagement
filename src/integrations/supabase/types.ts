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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      address_requests: {
        Row: {
          additional_services: string[] | null
          admin_notes: string | null
          business_type: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          expected_mail_volume: string
          id: string
          ip_address: string | null
          phone: string
          preferred_address_type: string
          special_requirements: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_services?: string[] | null
          admin_notes?: string | null
          business_type: string
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          expected_mail_volume: string
          id?: string
          ip_address?: string | null
          phone: string
          preferred_address_type: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_services?: string[] | null
          admin_notes?: string | null
          business_type?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          expected_mail_volume?: string
          id?: string
          ip_address?: string | null
          phone?: string
          preferred_address_type?: string
          special_requirements?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_access_logs: {
        Row: {
          access_token: string | null
          attempted_at: string
          error_reason: string | null
          id: string
          ip_address: unknown
          success: boolean
          user_agent: string | null
        }
        Insert: {
          access_token?: string | null
          attempted_at?: string
          error_reason?: string | null
          id?: string
          ip_address?: unknown
          success: boolean
          user_agent?: string | null
        }
        Update: {
          access_token?: string | null
          attempted_at?: string
          error_reason?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      contract_template_fields: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_options: string[] | null
          field_type: Database["public"]["Enums"]["field_type"]
          id: string
          is_required: boolean
          placeholder: string | null
          sort_order: number
          template_id: string
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_options?: string[] | null
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          is_required?: boolean
          placeholder?: string | null
          sort_order?: number
          template_id: string
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_options?: string[] | null
          field_type?: Database["public"]["Enums"]["field_type"]
          id?: string
          is_required?: boolean
          placeholder?: string | null
          sort_order?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["contract_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      filled_contracts: {
        Row: {
          access_count: number | null
          access_token: string
          client_email: string
          client_name: string | null
          completed_at: string | null
          created_at: string
          expires_at: string | null
          filled_data: Json
          id: string
          is_token_used: boolean | null
          last_accessed_at: string | null
          metadata: Json | null
          status: string
          template_id: string
          token_created_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number | null
          access_token: string
          client_email: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          filled_data?: Json
          id?: string
          is_token_used?: boolean | null
          last_accessed_at?: string | null
          metadata?: Json | null
          status?: string
          template_id: string
          token_created_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number | null
          access_token?: string
          client_email?: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          filled_data?: Json
          id?: string
          is_token_used?: boolean | null
          last_accessed_at?: string | null
          metadata?: Json | null
          status?: string
          template_id?: string
          token_created_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filled_contracts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      login_logs: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          error_message: string | null
          event_type: string
          id: string
          ip_address: unknown
          session_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile_access_log: {
        Row: {
          accessed_profile_id: string
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          success: boolean | null
          user_id: string
        }
        Insert: {
          accessed_profile_id: string
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id: string
        }
        Update: {
          accessed_profile_id?: string
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_address: string | null
          company_name: string | null
          created_at: string | null
          first_name: string | null
          id: string
          kvk_number: string | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_address?: string | null
          company_name?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          kvk_number?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_address?: string | null
          company_name?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          kvk_number?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          table_name?: string
        }
        Relationships: []
      }
      rate_limiting: {
        Row: {
          action_type: string
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          first_attempt_at: string | null
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          last_attempt_at: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          last_attempt_at?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          first_attempt_at?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          encrypted_ip_hash: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity: string
          session_metadata: Json | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          encrypted_ip_hash?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          session_metadata?: Json | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          encrypted_ip_hash?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          session_metadata?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_admin_role: { Args: { user_id_param: string }; Returns: undefined }
      check_rate_limit: {
        Args: {
          action_name: string
          client_ip: unknown
          max_attempts?: number
          time_window?: string
        }
        Returns: boolean
      }
      check_submission_rate_limit: {
        Args: { tbl_name: string; user_ip: string }
        Returns: boolean
      }
      check_suspicious_activity: { Args: never; Returns: undefined }
      cleanup_expired_sessions: { Args: never; Returns: undefined }
      cleanup_expired_sessions_secure: { Args: never; Returns: undefined }
      cleanup_old_access_logs: { Args: never; Returns: undefined }
      cleanup_rate_limit_tracking: { Args: never; Returns: undefined }
      cleanup_security_logs: { Args: never; Returns: undefined }
      detect_session_anomalies: { Args: never; Returns: undefined }
      detect_suspicious_activity: {
        Args: never
        Returns: {
          description: string
          detection_time: string
          ip_addresses: string[]
          threat_level: string
        }[]
      }
      get_contract_by_token_secure: {
        Args: { token_param: string }
        Returns: {
          client_email: string
          client_name: string
          completed_at: string
          created_at: string
          filled_data: Json
          id: string
          status: string
          template_content: string
          template_description: string
          template_id: string
          template_title: string
          updated_at: string
        }[]
      }
      get_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
          raw_app_meta_data: Json
        }[]
      }
      has_role:
        | {
            Args: { requested_role: Database["public"]["Enums"]["user_role"] }
            Returns: boolean
          }
        | { Args: { role_name: string }; Returns: boolean }
        | { Args: { role_name: string; user_id: number }; Returns: boolean }
      hash_ip_address: { Args: { ip_address: unknown }; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_admin_user: { Args: { user_id_param: string }; Returns: boolean }
      log_auth_event: {
        Args: {
          p_email: string
          p_error_message?: string
          p_event_type: string
          p_ip_address?: unknown
          p_success?: boolean
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      manage_user_session: {
        Args: {
          p_action?: string
          p_ip_address?: unknown
          p_session_token: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      pg_get_coldef: {
        Args: {
          in_column: string
          in_schema: string
          in_table: string
          oldway?: boolean
        }
        Returns: string
      }
      pg_get_tabledef: {
        Args: {
          _verbose: boolean
          arr?: string[]
          in_schema: string
          in_table: string
        }
        Returns: string
      }
      remove_admin_role: { Args: { user_id_param: string }; Returns: undefined }
      security_maintenance: { Args: never; Returns: undefined }
      security_maintenance_hardened: { Args: never; Returns: undefined }
      update_contract_by_token: {
        Args: {
          filled_data_param: Json
          status_param?: string
          token_param: string
        }
        Returns: boolean
      }
      validate_contract_token: {
        Args: { token_param: string }
        Returns: string
      }
      validate_contract_token_secure: {
        Args: { token_param: string }
        Returns: string
      }
    }
    Enums: {
      contract_status: "draft" | "active" | "inactive" | "archived"
      field_type:
        | "text"
        | "textarea"
        | "number"
        | "date"
        | "email"
        | "phone"
        | "select"
        | "checkbox"
      user_role: "user" | "admin"
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
    Enums: {
      contract_status: ["draft", "active", "inactive", "archived"],
      field_type: [
        "text",
        "textarea",
        "number",
        "date",
        "email",
        "phone",
        "select",
        "checkbox",
      ],
      user_role: ["user", "admin"],
    },
  },
} as const
