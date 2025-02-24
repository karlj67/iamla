import React from 'react';
import { 
  Box, Grid, Paper, Typography,
  Card, CardContent 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getSupervisorStats } from '../../api/stats';
import TeamVisitorsList from '../../components/supervisor/TeamVisitorsList';
import TeamVisitorsMap from '../../components/supervisor/TeamVisitorsMap';
import TeamPerformanceChart from '../../components/supervisor/TeamPerformanceChart';

export default function SupervisorDashboard() {
  const { data: stats } = useQuery('supervisorStats', getSupervisorStats);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord superviseur
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques de l'équipe */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Visiteurs actifs</Typography>
              <Typography variant="h3" color="primary">
                {stats?.active_visitors || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Visites aujourd'hui</Typography>
              <Typography variant="h3" color="primary">
                {stats?.today_visits || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Taux de réalisation</Typography>
              <Typography variant="h3" color="primary">
                {stats?.completion_rate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte des visiteurs de l'équipe */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Localisation de l'équipe
            </Typography>
            <TeamVisitorsMap />
          </Paper>
        </Grid>

        {/* Liste des visiteurs */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Membres de l'équipe
            </Typography>
            <TeamVisitorsList />
          </Paper>
        </Grid>

        {/* Performance de l'équipe */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance mensuelle
            </Typography>
            <TeamPerformanceChart data={stats?.team_performance || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
