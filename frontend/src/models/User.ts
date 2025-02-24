import { supabase } from '../config/database';
import { User, UserRole } from '../types/business';

interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  team_id?: number;
}

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  team_id?: number;
  password?: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findByRole(role: UserRole): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)')
      .eq('role', role);
    
    if (error) throw error;
    return data || [];
  }

  static async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*, teams(*)');
    
    if (error) throw error;
    return data || [];
  }

  static async create(userData: CreateUserData): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: userData.role
        }
      }
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
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

  static async update(id: string, userData: UpdateUserData): Promise<User> {
    const updates: any = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      team_id: userData.team_id
    };

    // Supprimer les propriétés undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (userData.password) {
      const { error: authError } = await supabase.auth.updateUser({
        password: userData.password
      });
      if (authError) throw authError;
    }

    return data;
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

export default UserModel; 
