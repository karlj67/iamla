import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import VisitsChart from '../components/dashboard/VisitsChart';
import TeamPerformance from '../components/dashboard/TeamPerformance';
import StatsCards from '../components/dashboard/StatsCards';
import { useQuery } from 'react-query';
import { getStats, getTeamStats } from '../api/stats';

export default function Dashboard() {
  const { data: stats } = useQuery('stats', getStats);
  const { data: teamStats } = useQuery('teamStats', getTeamStats);

  return (
    <Grid container spacing={3}>
      {/* Cartes de statistiques */}
      <Grid item xs={12}>
        <StatsCards stats={stats} />
      </Grid>

      {/* Graphique des visites */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Visites par équipe</Typography>
          <VisitsChart data={teamStats?.visits || []} />
        </Paper>
      </Grid>

      {/* Performance des équipes */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Performance des équipes</Typography>
          <TeamPerformance data={teamStats?.performance || []} />
        </Paper>
      </Grid>
    </Grid>
  );
} 