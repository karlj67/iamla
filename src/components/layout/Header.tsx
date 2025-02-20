import React from 'react';
import { 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem 
} from '@mui/material';
import { AccountCircle, Notifications } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        IAMLA Dashboard
      </Typography>

      {/* Notifications */}
      <IconButton color="inherit">
        <Notifications />
      </IconButton>

      {/* Profil utilisateur */}
      <IconButton
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {user?.first_name?.[0]}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Mon Profil</MenuItem>
        <MenuItem onClick={logout}>Déconnexion</MenuItem>
      </Menu>
    </Toolbar>
  );
} 