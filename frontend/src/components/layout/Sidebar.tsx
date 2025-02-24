import React from 'react';
import { 
  List, ListItem, ListItemIcon, ListItemText, 
  Divider, Box, Typography 
} from '@mui/material';
import { 
  Dashboard, People, Assessment, Settings,
  Group, CalendarMonth, LocationOn, Category, LocalHospital
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const adminMenuItems = [
    { title: 'Tableau de bord', icon: Dashboard, path: '/', roles: ['admin', 'supervisor'] },
    { title: 'Équipes', icon: Group, path: '/teams', roles: ['admin', 'supervisor'] },
    { title: 'Visiteurs', icon: People, path: '/visitors', roles: ['admin', 'supervisor'] },
    { title: 'Visites', icon: CalendarMonth, path: '/visits', roles: ['admin', 'supervisor'] },
    { title: 'Localisation', icon: LocationOn, path: '/locations', roles: ['admin', 'supervisor'] },
    { title: 'Statistiques', icon: Assessment, path: '/stats', roles: ['admin', 'supervisor'] },
    { title: 'Paramètres', icon: Settings, path: '/settings', roles: ['admin'] }
  ];

  const supervisorMenuItems = [
    { title: 'Tableau de bord', icon: Dashboard, path: '/' },
    { title: 'Équipe', icon: Group, path: '/team' },
    { title: 'Visiteurs', icon: People, path: '/visitors' },
    { title: 'Types de Prescripteurs', icon: Category, path: '/prescriber-types' },
    { title: 'Prescripteurs', icon: LocalHospital, path: '/prescribers' },
    { title: 'Visites', icon: CalendarMonth, path: '/visits' },
    { title: 'Suivi en temps réel', icon: LocationOn, path: '/live-tracking' },
    { title: 'Statistiques', icon: Assessment, path: '/stats' }
  ];

  const menuItems = user?.role === 'supervisor' ? supervisorMenuItems : adminMenuItems;

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" color="primary">
          IAMLA
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          item.roles.includes(user?.role) && (
            <ListItem 
              button 
              key={index}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          )
        ))}
      </List>
    </Box>
  );
} 
