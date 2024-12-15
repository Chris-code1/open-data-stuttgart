import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geojsonData from '../data/Stgt_Stadtteile.json';
import { GeoJsonObject } from 'geojson';

const MapComponent: React.FC = () => {
  // const position = [51.505, -0.09]
  console.log('GeoJSON Data:', geojsonData); // Debugging line


  const onEachFeature = (feature: any, layer: any) => {
    const { STADTTEILNAME } = feature.properties;
    const { STADTBEZIRKNAME } = feature.properties;
    const popupContent = `<strong>${STADTTEILNAME}</strong><br>Stadtbezirk: ${STADTBEZIRKNAME}`;
  
    layer.on('mouseover', function () {
      layer.bindPopup(popupContent).openPopup();
    });
  
    layer.on('mouseout', function () {
      layer.closePopup();
    });
  };

  return (
    <MapContainer center={[48.7758, 9.1829]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
       <GeoJSON data={geojsonData as GeoJsonObject} onEachFeature={onEachFeature}/> 
  </MapContainer>
  );
};

export default MapComponent;