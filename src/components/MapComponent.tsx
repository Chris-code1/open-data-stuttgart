import React from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJsonObject } from 'geojson';
import geojsonData from '../data/updated_STGT_STADTTEILE.json';
import L from 'leaflet';
import { useEffect } from 'react';

const MapComponent: React.FC = () => {
  // Color scale function
  const getColor = (d: number) => {
    return d > 30 ? '#0000FF' :  // Blue
           d > 25 ? '#0033FF' :  // Lighter Blue
           d > 20 ? '#0066FF' :  // Even Lighter Blue
           d > 15 ? '#0099FF' :  // Light Blue
           d > 10 ? '#00CCFF' :  // Lighter Blue
           d > 5  ? '#00FFFF' :  // Very Light Blue
           d > 0 ? '#CCFFFF' :  // Very Light Pale Blue
             d == 0 ? '#FFFFFF' : '#FFFFFF';   // White
  };

  const style = (feature: any) => {
    const value = String(feature.properties.AntSozmietwohnungen_am_Wohnungsbestand).replace(',', '.');
    return {
      fillColor: getColor(parseFloat(value)),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const { STADTTEILNAME } = feature.properties;
    const { STADTBEZIRKNAME } = feature.properties;
    const { AntSozmietwohnungen_am_Wohnungsbestand } = feature.properties;
    const { Anz_Sozialmietwohnungen } = feature.properties;
    const popupContent = `
    <strong>${STADTTEILNAME}</strong><br>
    Stadtbezirk: ${STADTBEZIRKNAME}<br>
    AntSozmietwohnungen_am_Wohnungsbestand: ${AntSozmietwohnungen_am_Wohnungsbestand}<br>
    Anz_Sozialmietwohnungen: ${Anz_Sozialmietwohnungen}`;
  
    layer.on('mouseover', function () {
      layer.bindPopup(popupContent).openPopup();
    });
  
    layer.on('mouseout', function () {
      layer.closePopup();
    });
  };

  const Legend = () => {
    const map = useMap();

    useEffect(() => {
      const legend = new L.Control({ position: 'bottomright' });
      const title = new L.Control({ position: 'topright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 5, 10, 15, 20, 25, 30];
      
        div.style.color = 'white'; // Set font color to white
      
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
      
        return div;
      };

      title.onAdd = () => {
        const div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '<h2>Sozialwohnungen in %</h2>';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        return div;
      };
      
      title.addTo(map);
      legend.addTo(map);

      return () => {
        legend.remove();
        title.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <MapContainer center={[48.7758, 9.1829]} zoom={11} style={{ height: '500px', width: '50%' }} scrollWheelZoom={false} dragging={false}>
      <Legend />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" />
      <GeoJSON data={geojsonData as GeoJsonObject} style={style} onEachFeature={onEachFeature}/> 
  </MapContainer>
  );
};

export default MapComponent;