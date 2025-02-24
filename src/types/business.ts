export type UserRole = 'admin' | 'supervisor' | 'medical_visitor';

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