import { useQuery } from 'react-query';
import { getAdminStats } from '../api/stats';

export function useAdminStats() {
  return useQuery('adminStats', getAdminStats, {
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
    staleTime: 60 * 1000, // Considérer les données comme périmées après 1 minute
  });
} 