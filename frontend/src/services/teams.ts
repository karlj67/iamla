import { supabase } from '../config/database';
import { Team, User } from '../types/user';

export const teamService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        supervisor:users!supervisor_id(*),
        members:users(*)
      `);
    if (error) throw error;
    return data;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        supervisor:users!supervisor_id(*),
        members:users(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(teamData: Partial<Team>) {
    // Vérifier qu'un superviseur n'est pas déjà assigné à une autre équipe
    const { data: existingTeam } = await supabase
      .from('teams')
      .select()
      .eq('supervisor_id', teamData.supervisor_id)
      .single();

    if (existingTeam) {
      throw new Error('Ce superviseur est déjà assigné à une autre équipe');
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, teamData: any) {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addMember(teamId: number, userId: number) {
    // Vérifier que l'utilisateur est bien un visiteur médical
    const { data: user } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (user?.role !== 'medical_visitor') {
      throw new Error('Seuls les visiteurs médicaux peuvent être ajoutés à une équipe');
    }

    const { error } = await supabase
      .from('users')
      .update({ team_id: teamId })
      .eq('id', userId);

    if (error) throw error;
  }
}; 