import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'primary.main',
        color: 'white',
        p: 3,
        mt: 'auto'
      }}
    >
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} IAMLA - Gestion des Visites Médicales
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        RycaPharma - Tous droits réservés
      </Typography>
    </Box>
  );
} 
