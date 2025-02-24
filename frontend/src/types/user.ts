export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'supervisor' | 'medical_visitor';
  team_id?: number;
  team?: Team;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  laboratory_name: string;
  supervisor_id: number;
  created_at: string;
  supervisor?: User;
  members?: User[];
} 