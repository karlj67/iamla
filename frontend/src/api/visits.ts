import axios from 'axios';
import { supabase } from '../config/database';

const API_URL = import.meta.env.VITE_API_URL;

export const getVisits = async () => {
  const response = await axios.get(`${API_URL}/api/visits`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const getUpcomingVisits = async () => {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      prescriber:prescribers(*)
    `)
    .gte('planned_date', new Date().toISOString())
    .order('planned_date', { ascending: true })
    .limit(10);

  if (error) throw error;
  return data;
};

export async function createVisit(visitData) {
  const response = await axios.post(`${API_URL}/api/visits`, visitData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
}

export const updateVisitLocation = async (visitId, locationData) => {
  const response = await axios.put(
    `${API_URL}/api/visits/${visitId}/location`,
    locationData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
}; 
