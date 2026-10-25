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

        // Escuchar clics sobre el mapa 3D
        mapView.on('click', (event) => {
          console.log('Evento click detectado:', event);

          // Verificar si el evento hizo contacto con polígonos
          if (event.polygons && event.polygons.length > 0) {
            const polygon = event.polygons[0];
            
            // Extraer el nombre desde las ubicaciones asociadas o usar el ID del polígono
            const name = polygon.locations && polygon.locations.length > 0
              ? polygon.locations[0].name
              : `Espacio ID: ${polygon.id}`;

            setSelectedSpace(name);
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

      {/* Tarjeta flotante visible al seleccionar un espacio */}
      {selectedSpace && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 9999,
          minWidth: '220px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', tracking: '0.05em' }}>
            Ubicación Seleccionada
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px', color: '#1f2937' }}>
            {selectedSpace}
          </div>
        </div>
      )}
    </div>
  );
}
