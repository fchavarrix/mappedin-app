import { useEffect, useRef } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

const MAPPEDIN_OPTIONS = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c',
};

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function renderMap() {
      if (!mapRef.current) return;
      try {
        const mapData = await getMapData(MAPPEDIN_OPTIONS);
        await show3dMap(mapRef.current, mapData);
      } catch (error) {
        console.error('Error al cargar el mapa de Mappedin:', error);
      }
    }

    renderMap();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
