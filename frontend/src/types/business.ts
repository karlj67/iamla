export type UserRole = 'admin' | 'supervisor' | 'medical_visitor';

export type VisitStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  team_id?: number;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  team_id?: number;
  password?: string;
  profile_photo?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  team_id?: number;
  profile_photo?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  laboratory_name: string;
  supervisor_id: string;
  created_at: string;
}

export interface Visit {
  id: number;
  visitor_id: string;
  prescriber_id: number;
  planned_date: string;
  completion_date?: string;
  status: VisitStatus;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  created_at: string;
}

export interface VisitStats {
  total_planned: number;
  total_completed: number;
  completion_rate: number;
  monthly_target: number;
  monthly_achieved: number;
}

export interface CreateTeamData {
  name: string;
  laboratory_name: string;
  supervisor_id: string;
}

export interface UpdateTeamData {
  name?: string;
  laboratory_name?: string;
  supervisor_id?: string;
}

export interface AdminStats {
  total_visitors: number;
  monthly_visits: number;
  completion_rate: number;
  recent_activities: Array<any>;
} 