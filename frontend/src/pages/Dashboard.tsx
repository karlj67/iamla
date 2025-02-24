import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Typography variant="body1">
        Bienvenue, {user?.first_name} {user?.last_name}
      </Typography>
    </Box>
  );
} 
