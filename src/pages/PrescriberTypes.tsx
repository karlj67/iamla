import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, Table, 
  TableBody, TableCell, TableHead, TableRow,
  Dialog
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { getPrescriberTypes } from '../api/prescriberTypes';
import PrescriberTypeForm from '../components/prescribers/PrescriberTypeForm';

export default function PrescriberTypes() {
  const [openForm, setOpenForm] = useState(false);
  const { data: types } = useQuery('prescriberTypes', getPrescriberTypes);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Types de Prescripteurs</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nouveau Type
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types?.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">Modifier</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <PrescriberTypeForm onClose={() => setOpenForm(false)} />
      </Dialog>
    </Box>
  );
} 