import { useEffect, useState } from 'react';
import supabase from '../config/database';

export default function DataStatus() {
  const [stats, setStats] = useState({
    users: 0,
    visits: 0,
    prescribers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { count: users } = await supabase
        .from('users')
        .select('*', { count: 'exact' });
      
      const { count: visits } = await supabase
        .from('visits')
        .select('*', { count: 'exact' });

      const { count: prescribers } = await supabase
        .from('prescribers')
        .select('*', { count: 'exact' });

      setStats({
        users: users || 0,
        visits: visits || 0,
        prescribers: prescribers || 0
      });
    };

    fetchData();
  }, []);

  return (
    <div className="data-status">
      <h3>Statistiques en direct :</h3>
      <p>Utilisateurs: {stats.users}</p>
      <p>Visites: {stats.visits}</p>
      <p>Prescripteurs: {stats.prescribers}</p>
    </div>
  );
} 
