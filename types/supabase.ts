export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          user_id: string
          is_responder_active: boolean
          message_template: string
        }
        Insert: {
          user_id: string
          is_responder_active?: boolean
          message_template?: string
        }
        Update: {
          user_id?: string
          is_responder_active?: boolean
          message_template?: string
        }
      }
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          username: string
          photo_url: string
        }
        Insert: {
          id: string
          first_name: string
          last_name?: string
          username?: string
          photo_url?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          username?: string
          photo_url?: string
        }
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
  }
}