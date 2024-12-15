import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geojsonData from '../data/Stgt_Stadtteile.geojson';

const MapComponent: React.FC = () => {
  // const position = [51.505, -0.09]

  const onEachFeature = (feature: any, layer: any) => {
    const { STADTTEILNAME } = feature.properties;
    layer.bindPopup(`<strong>${STADTTEILNAME}</strong>`);
  };

  return (
    <MapContainer center={[48.7758, 9.1829]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geojsonData} onEachFeature={onEachFeature} />
  </MapContainer>
  );
};

export default MapComponent;