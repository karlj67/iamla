import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSupervisorStats } from '../../api/stats';

export default function SupervisorDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['supervisor-stats'],
    queryFn: getSupervisorStats
  });

  return (
    <div>
      <h1>Tableau de bord superviseur</h1>
      {/* Afficher les stats */}
    </div>
  );
} 