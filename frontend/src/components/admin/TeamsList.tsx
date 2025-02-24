import React from 'react';
import { 
  List, ListItem, ListItemText, 
  ListItemSecondaryAction, 
  Typography 
} from '@mui/material';
import { useQuery } from 'react-query';
import { getTeams } from '../../api/teams';

export default function TeamsList() {
  const { data: teams } = useQuery('teams', getTeams);

  return (
    <List>
      {teams?.map((team) => (
        <ListItem key={team.id}>
          <ListItemText
            primary={team.name}
            secondary={`${team.member_count} visiteurs`}
          />
          <ListItemSecondaryAction>
            <Typography variant="body2" color="primary">
              {team.completion_rate}%
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
} 
