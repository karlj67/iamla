import React from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { getCurrentLocations } from '../../api/locations';

export default function TeamVisitorsMap() {
  const { data: visitors } = useQuery(['teamLocations'], getCurrentLocations);

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={[5.3484, -4.0305]} // Abidjan
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {visitors?.map((visitor) => (
          <Marker
            key={visitor.id}
            position={[visitor.latitude, visitor.longitude]}
          >
            <Popup>
              <Typography variant="body2">
                {visitor.first_name} {visitor.last_name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Dernière mise à jour: {new Date(visitor.last_update).toLocaleTimeString()}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
} 