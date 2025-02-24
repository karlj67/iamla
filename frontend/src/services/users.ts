import { supabase } from '../config/database';

export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)');
    if (error) throw error;
    return data;
  },

  async getByRole(role: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)')
      .eq('role', role);
    if (error) throw error;
    return data;
  },

  async create(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: number, userData: any) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}; 