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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_leads: {
        Row: {
          assigned_to: string | null
          city: string | null
          client_first_name: string
          client_last_name: string
          contact_type: Database["public"]["Enums"]["contact_type"]
          county: string
          created_at: string
          email: string | null
          home_address: string | null
          id: string
          initial_need: Database["public"]["Enums"]["initial_need"]
          insurance_status: Database["public"]["Enums"]["insurance_status"]
          lead_status: Database["public"]["Enums"]["lead_status"]
          notes: string | null
          phone_number: string
          referral_source: Database["public"]["Enums"]["referral_source"]
          referral_source_notes: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          assigned_to?: string | null
          city?: string | null
          client_first_name: string
          client_last_name: string
          contact_type?: Database["public"]["Enums"]["contact_type"]
          county: string
          created_at?: string
          email?: string | null
          home_address?: string | null
          id?: string
          initial_need?: Database["public"]["Enums"]["initial_need"]
          insurance_status?: Database["public"]["Enums"]["insurance_status"]
          lead_status?: Database["public"]["Enums"]["lead_status"]
          notes?: string | null
          phone_number: string
          referral_source?: Database["public"]["Enums"]["referral_source"]
          referral_source_notes?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          assigned_to?: string | null
          city?: string | null
          client_first_name?: string
          client_last_name?: string
          contact_type?: Database["public"]["Enums"]["contact_type"]
          county?: string
          created_at?: string
          email?: string | null
          home_address?: string | null
          id?: string
          initial_need?: Database["public"]["Enums"]["initial_need"]
          insurance_status?: Database["public"]["Enums"]["insurance_status"]
          lead_status?: Database["public"]["Enums"]["lead_status"]
          notes?: string | null
          phone_number?: string
          referral_source?: Database["public"]["Enums"]["referral_source"]
          referral_source_notes?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      enrollment_pipeline: {
        Row: {
          approved_services: string | null
          carehero_start_date: string | null
          cicoa_confirmation_number: string | null
          cicoa_referral_submitted: boolean
          cicoa_submission_date: string | null
          client_lead_id: string
          consent_date: string | null
          consent_signed: boolean
          created_at: string
          id: string
          loc_outcome: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required: boolean
          maximus_completed_date: string | null
          maximus_scheduled_date: string | null
          mce_assigned: Database["public"]["Enums"]["mce_assigned"] | null
          medicaid_effective_date: string | null
          updated_at: string
        }
        Insert: {
          approved_services?: string | null
          carehero_start_date?: string | null
          cicoa_confirmation_number?: string | null
          cicoa_referral_submitted?: boolean
          cicoa_submission_date?: string | null
          client_lead_id: string
          consent_date?: string | null
          consent_signed?: boolean
          created_at?: string
          id?: string
          loc_outcome?: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required?: boolean
          maximus_completed_date?: string | null
          maximus_scheduled_date?: string | null
          mce_assigned?: Database["public"]["Enums"]["mce_assigned"] | null
          medicaid_effective_date?: string | null
          updated_at?: string
        }
        Update: {
          approved_services?: string | null
          carehero_start_date?: string | null
          cicoa_confirmation_number?: string | null
          cicoa_referral_submitted?: boolean
          cicoa_submission_date?: string | null
          client_lead_id?: string
          consent_date?: string | null
          consent_signed?: boolean
          created_at?: string
          id?: string
          loc_outcome?: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required?: boolean
          maximus_completed_date?: string | null
          maximus_scheduled_date?: string | null
          mce_assigned?: Database["public"]["Enums"]["mce_assigned"] | null
          medicaid_effective_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_pipeline_client_lead_id_fkey"
            columns: ["client_lead_id"]
            isOneToOne: false
            referencedRelation: "client_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_tasks: {
        Row: {
          assigned_to: string | null
          client_lead_id: string
          completed_date: string | null
          created_at: string
          due_date: string
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          task_description: string
          task_type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_lead_id: string
          completed_date?: string | null
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          task_description: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_lead_id?: string
          completed_date?: string | null
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          task_description?: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_tasks_client_lead_id_fkey"
            columns: ["client_lead_id"]
            isOneToOne: false
            referencedRelation: "client_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_referral_tracking: {
        Row: {
          assessment_scheduled_date: string | null
          client_lead_id: string | null
          client_name: string
          client_selected_carehero: string | null
          confirmation_number_or_notes: string | null
          county: string
          created_at: string
          created_by: string | null
          date_referral_submitted: string
          estimated_service_start_date: string | null
          id: string
          internal_notes: string | null
          loc_status: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required: boolean
          referral_submitted_online: boolean
          referral_submitted_to: string
          screenshot_url: string | null
          updated_at: string
        }
        Insert: {
          assessment_scheduled_date?: string | null
          client_lead_id?: string | null
          client_name: string
          client_selected_carehero?: string | null
          confirmation_number_or_notes?: string | null
          county: string
          created_at?: string
          created_by?: string | null
          date_referral_submitted: string
          estimated_service_start_date?: string | null
          id?: string
          internal_notes?: string | null
          loc_status?: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required?: boolean
          referral_submitted_online?: boolean
          referral_submitted_to?: string
          screenshot_url?: string | null
          updated_at?: string
        }
        Update: {
          assessment_scheduled_date?: string | null
          client_lead_id?: string | null
          client_name?: string
          client_selected_carehero?: string | null
          confirmation_number_or_notes?: string | null
          county?: string
          created_at?: string
          created_by?: string | null
          date_referral_submitted?: string
          estimated_service_start_date?: string | null
          id?: string
          internal_notes?: string | null
          loc_status?: Database["public"]["Enums"]["loc_outcome"] | null
          maximus_assessment_required?: boolean
          referral_submitted_online?: boolean
          referral_submitted_to?: string
          screenshot_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_referral_tracking_client_lead_id_fkey"
            columns: ["client_lead_id"]
            isOneToOne: false
            referencedRelation: "client_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          availability: string | null
          created_at: string
          email: string
          experience: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_settings: {
        Row: {
          created_at: string
          events: string[]
          id: string
          is_active: boolean
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_modify_data: { Args: { _user_id: string }; Returns: boolean }
      has_portal_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "enrollment_staff" | "read_only"
      contact_type: "client" | "family_member" | "caregiver" | "referral_source"
      initial_need: "personal_care" | "attendant_care" | "respite" | "unsure"
      insurance_status:
        | "medicaid"
        | "medicare"
        | "medicaid_medicare"
        | "private_pay"
        | "unknown"
      lead_status:
        | "new_inquiry"
        | "contacted"
        | "education_provided"
        | "consent_pending"
        | "consent_received"
        | "referral_submitted"
        | "assessment_scheduled"
        | "approved"
        | "denied"
        | "service_started"
        | "lost_not_eligible"
      loc_outcome: "approved" | "denied" | "pending"
      mce_assigned: "anthem" | "humana" | "unitedhealthcare"
      referral_source:
        | "website"
        | "cicoa"
        | "hospital"
        | "word_of_mouth"
        | "caregiver_referral"
        | "event_outreach"
        | "other"
      task_priority: "high" | "medium" | "low"
      task_status: "pending" | "completed" | "escalated"
      task_type: "call" | "email" | "portal_follow_up" | "document_request"
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
      app_role: ["admin", "enrollment_staff", "read_only"],
      contact_type: ["client", "family_member", "caregiver", "referral_source"],
      initial_need: ["personal_care", "attendant_care", "respite", "unsure"],
      insurance_status: [
        "medicaid",
        "medicare",
        "medicaid_medicare",
        "private_pay",
        "unknown",
      ],
      lead_status: [
        "new_inquiry",
        "contacted",
        "education_provided",
        "consent_pending",
        "consent_received",
        "referral_submitted",
        "assessment_scheduled",
        "approved",
        "denied",
        "service_started",
        "lost_not_eligible",
      ],
      loc_outcome: ["approved", "denied", "pending"],
      mce_assigned: ["anthem", "humana", "unitedhealthcare"],
      referral_source: [
        "website",
        "cicoa",
        "hospital",
        "word_of_mouth",
        "caregiver_referral",
        "event_outreach",
        "other",
      ],
      task_priority: ["high", "medium", "low"],
      task_status: ["pending", "completed", "escalated"],
      task_type: ["call", "email", "portal_follow_up", "document_request"],
    },
  },
} as const
