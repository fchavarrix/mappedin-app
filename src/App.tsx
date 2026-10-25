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

        // En Mappedin v6, mapView.on('click') recibe un objeto con la propiedad 'polygons'
        mapView.on('click', (e: any) => {
          console.log('Objeto de evento al hacer clic:', e);

          const clickedPolygon = e?.polygons?.[0];

          if (clickedPolygon) {
            // Intentar obtener el nombre del espacio o su id
            const name = clickedPolygon.name || 
                         (clickedPolygon.locations && clickedPolygon.locations[0]?.name) || 
                         `Espacio ID: ${clickedPolygon.id}`;

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

      {/* Tarjeta flotante interactiva */}
      {selectedSpace && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          fontFamily: 'sans-serif',
          zIndex: 9999,
          border: '1px solid #334155'
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
