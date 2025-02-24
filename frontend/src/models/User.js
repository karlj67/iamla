import { supabase } from '../config/database.js';

class User {
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findByRole(role) {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)')
      .eq('role', role);
    
    if (error) throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)');
    
    if (error) throw error;
    return data;
  }

  static async create(userData) {
    // Créer d'abord l'authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (authError) throw authError;

    // Puis créer le profil utilisateur
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        team_id: userData.team_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, userData) {
    // Mise à jour du profil
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        team_id: userData.team_id
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Si le mot de passe doit être mis à jour
    if (userData.password) {
      const { error: authError } = await supabase.auth.updateUser({
        password: userData.password
      });
      if (authError) throw authError;
    }

    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*, teams(*)')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      return data;
    }
    return null;
  }
}

export default User;
