import React from 'react';
import { 
  Box, Grid, Paper, Typography,
  Card, CardContent 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../../api/stats';
import { People, Assignment, TrendingUp } from '@mui/icons-material';

export default function AdminDashboard() {
  const { data: stats } = useQuery('adminStats', getAdminStats);

  const dashboardCards = [
    {
      title: 'Total Visiteurs',
      value: stats?.total_visitors || 0,
      icon: <People fontSize="large" color="primary" />,
    },
    {
      title: 'Visites ce mois',
      value: stats?.monthly_visits || 0,
      icon: <Assignment fontSize="large" color="primary" />,
    },
    {
      title: 'Taux de réalisation',
      value: `${stats?.completion_rate || 0}%`,
      icon: <TrendingUp fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Administrateur
      </Typography>

      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                {card.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" color="primary">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activité récente
            </Typography>
            {/* Ajouter ici un tableau ou une liste d'activités récentes */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
