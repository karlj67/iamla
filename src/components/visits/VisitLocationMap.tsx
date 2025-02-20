import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface VisitLocationMapProps {
  visit: {
    prescriber: {
      first_name: string;
      last_name: string;
      address: string;
    };
    latitude: number;
    longitude: number;
  };
  onClose?: () => void;
}

export default function VisitLocationMap({ visit, onClose }: VisitLocationMapProps) {
  if (!visit) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Localisation - {visit.prescriber.first_name} {visit.prescriber.last_name}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <MapContainer
          center={[visit.latitude, visit.longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[visit.latitude, visit.longitude]}>
            <Popup>
              <Typography variant="body2">
                {visit.prescriber.first_name} {visit.prescriber.last_name}
                <br />
                {visit.prescriber.address}
              </Typography>
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
} 