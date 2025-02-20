import React from 'react';
import { 
  Box, Grid, Paper, Typography,
  Card, CardContent 
} from '@mui/material';
import { useQuery } from 'react-query';
import { getAdminStats } from '../../api/stats';
import TeamsList from '../../components/admin/TeamsList';
import VisitorsMap from '../../components/admin/VisitorsMap';
import GlobalPerformanceChart from '../../components/admin/GlobalPerformanceChart';

export default function AdminDashboard() {
  const { data: stats } = useQuery('adminStats', getAdminStats);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord administrateur
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques globales */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Visiteurs</Typography>
              <Typography variant="h3" color="primary">
                {stats?.total_visitors || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Visites ce mois</Typography>
              <Typography variant="h3" color="primary">
                {stats?.monthly_visits || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Équipes actives</Typography>
              <Typography variant="h3" color="primary">
                {stats?.active_teams || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte des visiteurs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Localisation des visiteurs
            </Typography>
            <VisitorsMap />
          </Paper>
        </Grid>

        {/* Liste des équipes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Performance des équipes
            </Typography>
            <TeamsList />
          </Paper>
        </Grid>

        {/* Graphique de performance globale */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance globale
            </Typography>
            <GlobalPerformanceChart data={stats?.performance || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 