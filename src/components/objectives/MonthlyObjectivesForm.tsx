import React, { useState } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useMutation, useQueryClient } from 'react-query';
import { setMonthlyObjectives } from '../../api/stats';

interface MonthlyObjectivesFormProps {
  teamId: number;
  onClose: () => void;
  currentObjectives?: any;
}

export default function MonthlyObjectivesForm({ 
  teamId, 
  onClose, 
  currentObjectives 
}: MonthlyObjectivesFormProps) {
  const [formData, setFormData] = useState(currentObjectives || {
    month: new Date(),
    visit_objective: '',
    financial_objective: ''
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data) => setMonthlyObjectives(teamId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['teamStats', teamId]);
        onClose();
      }
    }
  );

  return (
    <>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Définir les objectifs mensuels
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DatePicker
              label="Mois"
              views={['year', 'month']}
              value={formData.month}
              onChange={(newValue) => setFormData({ ...formData, month: newValue })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objectif de visites"
              type="number"
              value={formData.visit_objective}
              onChange={(e) => setFormData({ 
                ...formData, 
                visit_objective: parseInt(e.target.value) 
              })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objectif financier"
              type="number"
              value={formData.financial_objective}
              onChange={(e) => setFormData({ 
                ...formData, 
                financial_objective: parseInt(e.target.value) 
              })}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={() => mutation.mutate(formData)}
          variant="contained"
        >
          Enregistrer
        </Button>
      </DialogActions>
    </>
  );
} 