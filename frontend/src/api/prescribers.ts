import { supabase } from '../config/database';

export const getPrescribers = async () => {
  const { data, error } = await supabase
    .from('prescribers')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data;
};

export const createPrescriber = async (prescriberData: any) => {
  const { data, error } = await supabase
    .from('prescribers')
    .insert(prescriberData)
    .single();

  if (error) throw error;
  return data;
};

export const updatePrescriber = async (id: number, prescriberData: any) => {
  const { data, error } = await supabase
    .from('prescribers')
    .update(prescriberData)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const deletePrescriber = async (id: number) => {
  const { error } = await supabase
    .from('prescribers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}; 
