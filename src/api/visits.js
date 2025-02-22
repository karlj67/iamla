import supabase from '../config/database';

export const getVisits = async () => {
  const { data, error } = await supabase
    .from('visits')
    .select('*');
  
  if (error) throw error;
  return data;
}; 