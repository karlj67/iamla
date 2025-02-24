import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { People, Assignment, CheckCircle, Schedule } from '@mui/icons-material';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Visites',
      value: stats?.visits?.total_visits || 0,
      icon: Assignment,
      color: '#1976d2'
    },
    {
      title: 'Visites Exécutées',
      value: stats?.visits?.executed_visits || 0,
      icon: CheckCircle,
      color: '#2e7d32'
    },
    {
      title: 'Visites Planifiées',
      value: stats?.visits?.planned_visits || 0,
      icon: Schedule,
      color: '#ed6c02'
    },
    {
      title: 'Total Prescripteurs',
      value: stats?.prescribers?.total_prescribers || 0,
      icon: People,
      color: '#9c27b0'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <card.icon sx={{ fontSize: 40, color: card.color }} />
            <Typography variant="h4">{card.value}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {card.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
} 
