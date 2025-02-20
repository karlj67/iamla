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
  MenuItem,
  Alert
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createVisitor, updateUser } from '../../api/users';
import { getTeams } from '../../api/teams';

interface VisitorFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function VisitorForm({ onClose, initialData }: VisitorFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData || {
    email: '',
    first_name: '',
    last_name: '',
    team_id: '',
    password: '' // Uniquement pour la création
  });

  const { data: teams } = useQuery('teams', getTeams);
  const [error, setError] = useState('');

  const mutation = useMutation(
    (data) => initialData 
      ? updateUser(initialData.id, data)
      : createVisitor(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('visitors');
        onClose();
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Une erreur est survenue');
      }
    }
  );

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Grid>

          {!initialData && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Équipe</InputLabel>
              <Select
                value={formData.team_id}
                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                required
              >
                {teams?.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name} - {team.laboratory_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={() => mutation.mutate(formData)}
          variant="contained"
          disabled={mutation.isLoading}
        >
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </>
  );
} 