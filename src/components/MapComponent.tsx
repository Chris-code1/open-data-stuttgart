import React from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJsonObject } from 'geojson';
import geojsonData from '../data/updated_STGT_STADTTEILE.json';
import L from 'leaflet';
import { useEffect } from 'react';

interface MapComponentProps {
  variableName: string;
  title: string;
  max: number;
}

const getColor = (d: number, max: number) => {
  const slice = max / 8;
  return d > 7 * slice ? '#b10026' :  // Blue
         d > 6 * slice ? '#e31a1c' :  // Lighter Blue
         d > 5 * slice ? '#fc4e2a' :  // Even Lighter Blue
         d > 4 * slice ? '#fd8d3c' :  // Light Blue
         d > 3 * slice ? '#feb24c' :  // Lighter Blue
         d > 2 * slice ? '#fed976' :  // Very Light Blue
         d > 1 * slice ? '#ffeda0' :  // Very Light Pale Blue
         d >= 0 ? '#ffffcc' : '#ffffcc';   // White
};

const MapComponent: React.FC<MapComponentProps> = ({ variableName, title, max }) => {

  const style = (feature: any) => {
    const value = String(feature.properties[variableName]).replace(',', '.');
    return {
      fillColor: getColor(parseFloat(value), max),
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
    Anteil Sozmietwohnungen am Wohnungsbestand: ${AntSozmietwohnungen_am_Wohnungsbestand}<br>
    Anzahl Sozialmietwohnungen: ${Anz_Sozialmietwohnungen}`;
  
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
      const titleControl = new L.Control({ position: 'topright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = Array.from({ length: 8 }, (_, i) => i * (max / 8));
      
        div.style.color = 'white'; // Set font color to white
      
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1, max) + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
      
        return div;
      };

      titleControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = `<h2>${title}</h2>`;
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        return div;
      };
      
      titleControl.addTo(map);
      legend.addTo(map);

      return () => {
        legend.remove();
        titleControl.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <MapContainer center={[48.7758, 9.1829]} zoom={11} style={{ height: '500px', width: '100%' }}>
      <Legend />
      {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" /> */}
      {/* <TileLayer url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png" /> */}
      {/* <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    /> */}
    <TileLayer
      attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png"
    />
      <GeoJSON data={geojsonData as GeoJsonObject} style={style} onEachFeature={onEachFeature}/> 
  </MapContainer>
  );
};

export default MapComponent;