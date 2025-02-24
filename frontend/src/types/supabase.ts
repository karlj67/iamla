export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: number
          name: string
          laboratory_name: string
          supervisor_id: number
          created_at: string
        }
        Insert: {
          name: string
          laboratory_name: string
          supervisor_id: number
        }
        Update: {
          name?: string
          laboratory_name?: string
          supervisor_id?: number
        }
      }
      users: {
        Row: {
          id: number
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'supervisor' | 'medical_visitor'
          team_id: number | null
        }
      }
    }
  }
} 