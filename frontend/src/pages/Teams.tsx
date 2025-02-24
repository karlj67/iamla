import React from 'react';
import { 
  Box, Typography, Paper, Button, 
  Table, TableBody, TableCell, TableHead, TableRow 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getTeams, getAllTeams, getTeam } from '../api/teams';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedAccess from '../../components/common/RoleBasedAccess';

export default function Teams() {
  const { user } = useAuth();
  const { data: teams } = useQuery(['teams', user.role], () => 
    // Les admins voient toutes les équipes, les superviseurs uniquement la leur
    user.role === 'admin' ? getAllTeams() : getTeam(user.team_id)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion des Équipes</Typography>
        <RoleBasedAccess roles={['admin']}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Nouvelle Équipe
          </Button>
        </RoleBasedAccess>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Laboratoire</TableCell>
              <TableCell>Superviseur</TableCell>
              <TableCell>Membres</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams?.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.laboratory_name}</TableCell>
                <TableCell>
                  {team.supervisor?.first_name} {team.supervisor?.last_name}
                </TableCell>
                <TableCell>{team.member_count} VM</TableCell>
                <TableCell>
                  <RoleBasedAccess roles={['admin']}>
                    <Button size="small" color="primary">Détails</Button>
                    <Button size="small" color="secondary">Modifier</Button>
                  </RoleBasedAccess>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
} 
