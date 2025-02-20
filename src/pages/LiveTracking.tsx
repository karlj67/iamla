import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from 'react-query';
import { getCurrentLocations } from '../api/locations';
import { useAuth } from '../contexts/AuthContext';

export default function LiveTracking() {
  const { user } = useAuth();
  const { data: locations, refetch } = useQuery(
    ['currentLocations', user.team_id],
    () => getCurrentLocations(user.team_id),
    { refetchInterval: 60000 } // Rafraîchir toutes les minutes
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Suivi en temps réel
      </Typography>

      <Paper sx={{ height: 'calc(100vh - 200px)', p: 2 }}>
        <MapContainer
          center={[5.3484, -4.0305]} // Abidjan
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {locations?.map((location) => (
            <Marker
              key={location.user_id}
              position={[location.latitude, location.longitude]}
            >
              <Popup>
                <Typography variant="subtitle2">
                  {location.first_name} {location.last_name}
                </Typography>
                <Typography variant="body2">
                  Dernière mise à jour: {new Date(location.timestamp).toLocaleTimeString()}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
} 