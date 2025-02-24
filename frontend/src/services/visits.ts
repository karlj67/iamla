import { supabase } from '../config/database';

export const visitService = {
  async create(visitData: any) {
    // Vérifier les contraintes métier
    const { data: existingVisit } = await supabase
      .from('visits')
      .select()
      .eq('visitor_id', visitData.visitor_id)
      .eq('planned_date', visitData.planned_date)
      .maybeSingle();

    if (existingVisit) {
      throw new Error('Le visiteur a déjà une visite planifiée à cette date');
    }

    const { data, error } = await supabase
      .from('visits')
      .insert(visitData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async complete(visitId: number, completionData: any) {
    const { data: visit } = await supabase
      .from('visits')
      .select()
      .eq('id', visitId)
      .single();

    if (visit?.status === 'completed') {
      throw new Error('Cette visite est déjà complétée');
    }

    const { data, error } = await supabase
      .from('visits')
      .update({
        status: 'completed',
        completion_date: new Date().toISOString(),
        ...completionData
      })
      .eq('id', visitId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 