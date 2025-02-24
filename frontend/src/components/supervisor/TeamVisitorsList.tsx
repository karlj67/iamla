import React from 'react';
import { 
  List, ListItem, ListItemText, 
  ListItemAvatar, Avatar,
  ListItemSecondaryAction, 
  Typography 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getTeamMembers } from '../../api/teams';

export default function TeamVisitorsList() {
  const { data: members } = useQuery('teamMembers', getTeamMembers);

  return (
    <List>
      {members?.map((member) => (
        <ListItem key={member.id}>
          <ListItemAvatar>
            <Avatar src={member.profile_photo} />
          </ListItemAvatar>
          <ListItemText
            primary={`${member.first_name} ${member.last_name}`}
            secondary={`${member.visits_today} visites aujourd'hui`}
          />
          <ListItemSecondaryAction>
            <Typography variant="body2" color="primary">
              {member.completion_rate}%
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
} 
