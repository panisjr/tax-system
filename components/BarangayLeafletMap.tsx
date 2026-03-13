'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

type LatLngTuple = [number, number];

type BarangayLeafletMapProps = {
  barangayName: string;
  center: LatLngTuple;
  zoom?: number;
};

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type RecenterMapProps = {
  center: LatLngTuple;
  zoom: number;
};

function RecenterMap({ center, zoom }: RecenterMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);

  return null;
}

export default function BarangayLeafletMap({ barangayName, center, zoom = 15 }: BarangayLeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-48 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={center} zoom={zoom} />
      <Marker position={center} icon={defaultIcon}>
        <Popup>
          Barangay {barangayName}
        </Popup>
      </Marker>
      <Circle
        center={center}
        radius={380}
        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.12 }}
      />
    </MapContainer>
  );
}
