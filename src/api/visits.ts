import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getVisits = async () => {
  const response = await axios.get(`${API_URL}/api/visits`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const createVisit = async (visitData) => {
  const response = await axios.post(`${API_URL}/api/visits`, visitData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

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