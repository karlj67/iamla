import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function LocationMap() {
  return (
    <MapContainer center={[5.3599, -4.0083]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[5.3599, -4.0083]}>
        <Popup>Siège RycaPharma</Popup>
      </Marker>
    </MapContainer>
  );
} 
