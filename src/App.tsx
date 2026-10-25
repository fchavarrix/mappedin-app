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
    let mapViewInstance: any = null;

    async function renderMap() {
      if (!mapRef.current) return;
      try {
        const mapData = await getMapData(MAPPEDIN_OPTIONS);
        
        // Destruir mapa previo en caso de re-render de React
        if (mapViewInstance) {
          mapViewInstance.destroy();
        }

        mapViewInstance = await show3dMap(mapRef.current, mapData);

        // Escuchar clics e inspeccionar todas las colecciones posibles del evento
        mapViewInstance.on('click', (e: any) => {
          console.log('Objeto completo de evento clic:', e);

          const space = e.spaces?.[0];
          const polygon = e.polygons?.[0];

          if (space) {
            const name = space.name || (space.locations && space.locations[0]?.name) || `Espacio: ${space.id}`;
            setSelectedSpace(name);
          } else if (polygon) {
            const name = polygon.name || (polygon.locations && polygon.locations[0]?.name) || `Polígono: ${polygon.id}`;
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

    // Limpieza al desmontar el componente React
    return () => {
      if (mapViewInstance) {
        mapViewInstance.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Tarjeta flotante interactiva */}
      {selectedSpace && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 9999,
          border: '1px solid #1e293b'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Ubicación Seleccionada
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: '#38bdf8' }}>
            {selectedSpace}
          </div>
        </div>
      )}
    </div>
  );
}
