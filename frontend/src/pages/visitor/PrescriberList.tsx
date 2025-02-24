import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, IconButton,
  TextField, InputAdornment
} from '@mui/material';
import { Search, LocationOn, Phone, Email } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { getPrescribers } from '../../api/prescribers';

export default function PrescriberList() {
  const [search, setSearch] = useState('');
  const { data: prescribers } = useQuery('prescribers', getPrescribers);

  const filteredPrescribers = prescribers?.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Prescripteurs
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher un prescripteur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPrescribers?.map((prescriber) => (
              <TableRow key={prescriber.id}>
                <TableCell>
                  {prescriber.first_name} {prescriber.last_name}
                </TableCell>
                <TableCell>{prescriber.type.name}</TableCell>
                <TableCell>{prescriber.address}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => window.location.href = `tel:${prescriber.phone}`}
                  >
                    <Phone fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => window.location.href = `mailto:${prescriber.email}`}
                  >
                    <Email fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => window.open(
                      `https://maps.google.com?q=${prescriber.latitude},${prescriber.longitude}`
                    )}
                  >
                    <LocationOn />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
} 
