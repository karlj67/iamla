import axiosInstance from './axios';

export const getCurrentLocations = async (teamId?: number) => {
  const response = await axiosInstance.get('/api/locations/current', {
    params: { team_id: teamId }
  });
  return response.data;
};

export const getLocationHistory = async (params: {
  userId?: number;
  teamId?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axiosInstance.get('/api/locations/history', { params });
  return response.data;
}; 