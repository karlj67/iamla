import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Grid
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPrescribers } from '../../api/prescribers';
import { createVisit } from '../../api/visits';

interface VisitFormProps {
  onClose: () => void;
}

export default function VisitForm({ onClose }: VisitFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    prescriber_id: '',
    planned_date: null,
    notes: ''
  });

  const { data: prescribers } = useQuery('prescribers', getPrescribers);

  const createVisitMutation = useMutation(createVisit, {
    onSuccess: () => {
      queryClient.invalidateQueries('visits');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVisitMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Nouvelle Visite
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Prescripteur</InputLabel>
              <Select
                value={formData.prescriber_id}
                onChange={(e) => setFormData({
                  ...formData,
                  prescriber_id: e.target.value
                })}
                required
              >
                {prescribers?.map((prescriber) => (
                  <MenuItem key={prescriber.id} value={prescriber.id}>
                    {prescriber.first_name} {prescriber.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <DateTimePicker
              label="Date et heure prévues"
              value={formData.planned_date}
              onChange={(newValue) => setFormData({
                ...formData,
                planned_date: newValue
              })}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              rows={4}
              fullWidth
              value={formData.notes}
              onChange={(e) => setFormData({
                ...formData,
                notes: e.target.value
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={createVisitMutation.isLoading}
        >
          Créer
        </Button>
      </DialogActions>
    </form>
  );
} 
