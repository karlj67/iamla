import React, { useState } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createTeam, updateTeam } from '../../api/teams';
import { getUsers } from '../../api/users';

interface TeamFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function TeamForm({ onClose, initialData }: TeamFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData || {
    name: '',
    laboratory_name: '',
    supervisor_id: ''
  });

  const { data: supervisors } = useQuery('supervisors', () => 
    getUsers({ role: 'supervisor' })
  );

  const mutation = useMutation(
    (data) => initialData 
      ? updateTeam(initialData.id, data)
      : createTeam(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teams');
        onClose();
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de l'équipe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Laboratoire"
              value={formData.laboratory_name}
              onChange={(e) => setFormData({ ...formData, laboratory_name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Superviseur</InputLabel>
              <Select
                value={formData.supervisor_id}
                onChange={(e) => setFormData({ ...formData, supervisor_id: e.target.value })}
                required
              >
                {supervisors?.map((supervisor) => (
                  <MenuItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.first_name} {supervisor.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button type="submit" variant="contained">
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </form>
  );
} 