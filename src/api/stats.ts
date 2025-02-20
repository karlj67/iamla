import axios from 'axios';
import axiosInstance from './axios';

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

export const setMonthlyObjectives = async (teamId, objectives) => {
  const response = await axios.post(
    `${API_URL}/api/stats/objectives/${teamId}`,
    objectives,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axiosInstance.get('/api/stats/admin');
  return response.data;
};

export const getSupervisorStats = async () => {
  const response = await axiosInstance.get('/api/stats/supervisor');
  return response.data;
};

export const getVisitorStats = async () => {
  const response = await axiosInstance.get('/api/stats/visitor');
  return response.data;
}; 