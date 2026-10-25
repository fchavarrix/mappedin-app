import { useEffect, useRef, useState } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

const MAPPEDIN_OPTIONS = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c',
};

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  useEffect(() => {
    async function renderMap() {
      if (!mapRef.current) return;
      try {
        const mapData = await getMapData(MAPPEDIN_OPTIONS);
        const mapView = await show3dMap(mapRef.current, mapData);

        // Escuchar el evento de clic en el mapa 3D
        mapView.on('click', (event) => {
          if (event.polygons && event.polygons.length > 0) {
            const polygon = event.polygons[0];
            const spaceName = polygon.hasLocations && polygon.locations.length > 0
              ? polygon.locations[0].name
              : polygon.id;
            
            setSelectedSpace(spaceName);
          } else {
            setSelectedSpace(null);
          }
        });
      } catch (error) {
        console.error('Error al cargar el mapa de Mappedin:', error);
      }
    }

    renderMap();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Card flotante de informacion */}
      {selectedSpace && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontFamily: 'sans-serif',
          zIndex: 1000
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>Espacio Seleccionado</h3>
          <p style={{ margin: 0, color: '#4b5563', fontWeight: 'bold' }}>{selectedSpace}</p>
        </div>
      )}
    </div>
  );
}
