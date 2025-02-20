import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getTeams = async () => {
  const response = await axios.get(`${API_URL}/api/teams`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await axios.post(`${API_URL}/api/teams`, teamData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const updateTeam = async (id, teamData) => {
  const response = await axios.put(`${API_URL}/api/teams/${id}`, teamData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
}; 