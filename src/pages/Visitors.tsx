import React from 'react';
import { 
  Box, Typography, Paper, Button, 
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { getVisitors } from '../api/users';

export default function Visitors() {
  const { data: visitors, isLoading } = useQuery('visitors', getVisitors);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Visiteurs Médicaux</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
        >
          Nouveau Visiteur
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Équipe</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Visites (Mois)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors?.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell>
                  {visitor.first_name} {visitor.last_name}
                </TableCell>
                <TableCell>{visitor.email}</TableCell>
                <TableCell>{visitor.team?.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={visitor.is_active ? "Actif" : "Inactif"}
                    color={visitor.is_active ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{visitor.monthly_visits_count}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">Profil</Button>
                  <Button size="small" color="secondary">Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
} 