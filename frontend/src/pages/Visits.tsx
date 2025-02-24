import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, 
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, Dialog
} from '@mui/material';
import { 
  Add as AddIcon, 
  LocationOn as LocationIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getVisits } from '../api/visits';
import VisitLocationMap from '../components/visits/VisitLocationMap';
import VisitForm from '../components/visits/VisitForm';

export default function Visits() {
  const [openMap, setOpenMap] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const { data: visits, isLoading } = useQuery('visits', getVisits);

  const handleLocationClick = (visit) => {
    setSelectedVisit(visit);
    setOpenMap(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion des Visites</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nouvelle Visite
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Visiteur</TableCell>
              <TableCell>Prescripteur</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits?.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>{new Date(visit.planned_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {visit.visitor.first_name} {visit.visitor.last_name}
                </TableCell>
                <TableCell>
                  {visit.prescriber.first_name} {visit.prescriber.last_name}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={visit.status}
                    color={
                      visit.status === 'executed' ? 'success' :
                      visit.status === 'planned' ? 'primary' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleLocationClick(visit)}
                    disabled={!visit.latitude || !visit.longitude}
                  >
                    <LocationIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal Carte */}
      <Dialog 
        open={openMap} 
        onClose={() => setOpenMap(false)}
        maxWidth="md"
        fullWidth
      >
        <VisitLocationMap visit={selectedVisit} />
      </Dialog>

      {/* Modal Formulaire */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <VisitForm onClose={() => setOpenForm(false)} />
      </Dialog>
    </Box>
  );
} 
