import axios from 'axios';
import axiosInstance from './axios';
import { supabase } from '../config/database';
import { AdminStats } from '../types/stats';

const API_URL = import.meta.env.VITE_API_URL;

export const getMonthlyStats = async () => {
  const response = await axios.get(`${API_URL}/api/stats/monthly`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const getTeamStats = async () => {
  const response = await axios.get(`${API_URL}/api/stats/teams`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const setMonthlyObjectives = async (
  teamId: string, 
  objectives: {
    visit_objective: number;
    financial_objective: number;
    month: Date;
  }
) => {
  const response = await axios.post(
    `${API_URL}/api/stats/objectives/${teamId}`,
    objectives
  );
  return response.data;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    // Récupérer le nombre total de visiteurs
    const { count: total_visitors } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'medical_visitor');

    // Récupérer le nombre de visites du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: monthly_visits } = await supabase
      .from('visits')
      .select('*', { count: 'exact' })
      .gte('planned_date', startOfMonth.toISOString());

    // Calculer le taux de réalisation
    const { data: visits } = await supabase
      .from('visits')
      .select('status')
      .gte('planned_date', startOfMonth.toISOString());

    const executed = visits?.filter(v => v.status === 'executed').length || 0;
    const total = visits?.length || 0;
    const completion_rate = total ? Math.round((executed / total) * 100) : 0;

    return {
      total_visitors: total_visitors || 0,
      monthly_visits: monthly_visits || 0,
      completion_rate,
      recent_activities: [],
      active_teams: 0,
      performance: []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des stats admin:', error);
    throw error;
  }
};

export const getSupervisorStats = async () => {
  const response = await axiosInstance.get('/api/stats/supervisor');
  return response.data;
};

export const getVisitorStats = async () => {
  const response = await axiosInstance.get('/api/stats/visitor');
  return response.data;
}; 
