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
    return d > 50 ? '#800026' :
            d > 40 ? '#BD0026' :
            d > 30 ? '#E31A1C' :
            d > 20 ? '#FC4E2A' :
            d > 10 ? '#FD8D3C' :
            d > 5  ? '#FEB24C' :
            d > 0  ? '#FED976' :
                    '#FFEDA0';
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

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 5, 10, 20, 30, 40, 50];
        const labels = [];

        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
      };

      legend.addTo(map);

      return () => {
        legend.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <MapContainer center={[48.7758, 9.1829]} zoom={11} style={{ height: '500px', width: '50%' }}>
      <Legend />
      {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png" /> */}
       <GeoJSON data={geojsonData as GeoJsonObject} style={style} onEachFeature={onEachFeature}/> 
       
  </MapContainer>
  );
};

export default MapComponent;