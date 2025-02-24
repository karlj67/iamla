import { supabase } from '../config/database';
import type { UserRole } from '../types/business';

export const UserModel = {
  async getByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('team_id', teamId);
    
    if (error) throw error;
    return data;
  }
}; 