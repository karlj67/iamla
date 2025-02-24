import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getVisitors = async () => {
  const response = await axios.get(`${API_URL}/api/users?role=medical_visitor`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const createVisitor = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users`, {
    ...userData,
    role: 'medical_visitor'
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/api/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
}; 
