import { supabase } from '../config/database';
import type { Team, CreateTeamData, UpdateTeamData, User } from '../types/business';

export const TeamModel = {
  async getAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*');
    if (error) throw error;
    return data;
  },

  async create(teamData: CreateTeamData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, teamData: UpdateTeamData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMembers(teamId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return data;
  }
}; 
