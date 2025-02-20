import React from 'react';
import { 
  Box, Grid, Paper, Typography,
  Card, CardContent, CardActions,
  Button 
} from '@mui/material';
import { useQuery } from 'react-query';
import { getVisitorStats } from '../../api/stats';
import { useAuth } from '../../contexts/AuthContext';
import VisitCalendar from '../../components/visitor/VisitCalendar';
import PerformanceChart from '../../components/visitor/PerformanceChart';

export default function VisitorDashboard() {
  const { user } = useAuth();
  const { data: stats } = useQuery(['visitorStats', user.id], () => 
    getVisitorStats(user.id)
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Tableau de bord - {user.first_name} {user.last_name}
      </Typography>

      <Grid container spacing={3}>
        {/* Statistiques rapides */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Visites du mois</Typography>
              <Typography variant="h3" color="primary">
                {stats?.monthly_visits || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Objectif: {stats?.monthly_objective || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendrier des visites */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prochaines visites
            </Typography>
            <VisitCalendar />
          </Paper>
        </Grid>

        {/* Graphique de performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance mensuelle
            </Typography>
            <PerformanceChart data={stats?.performance || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 