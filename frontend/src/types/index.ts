export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'supervisor' | 'medical_visitor';
  team_id?: number;
  profile_photo?: string;
}

export interface Team {
  id: number;
  name: string;
  laboratory_name: string;
  supervisor_id: number;
  supervisor?: User;
  member_count?: number;
}

export interface Visit {
  id: number;
  visitor_id: number;
  prescriber_id: number;
  planned_date: string;
  status: 'planned' | 'executed' | 'cancelled';
  notes?: string;
  latitude?: number;
  longitude?: number;
  visitor: User;
  prescriber: Prescriber;
}

export interface Prescriber {
  id: number;
  type_id: number;
  first_name: string;
  last_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
}

export interface MonthlyObjectives {
  id: number;
  team_id: number;
  month: Date;
  visit_objective: number;
  financial_objective: number;
}

export interface TeamStats {
  team_name: string;
  planned_visits: number;
  executed_visits: number;
  visit_completion: number;
  financial_completion: number;
} 
