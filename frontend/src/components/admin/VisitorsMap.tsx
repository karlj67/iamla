import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from 'react-query';
import { getCurrentLocations } from '../../api/locations';

export default function VisitorsMap() {
  const { data: locations } = useQuery('currentLocations', getCurrentLocations);

  return (
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
            <div>
              <strong>{location.user_name}</strong>
              <br />
              Dernière mise à jour: {new Date(location.timestamp).toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 
