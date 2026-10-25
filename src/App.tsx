import { useEffect, useRef, useState } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

const MAPPEDIN_OPTIONS = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c',
};

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedSpaceInfo, setSelectedSpaceInfo] = useState<{ name: string; id: string } | null>(null);

  useEffect(() => {
    let mapViewInstance: any = null;

    async function renderMap() {
      if (!mapRef.current) return;
      try {
        const mapData = await getMapData(MAPPEDIN_OPTIONS);
        
        // Cargar el mapa
        mapViewInstance = await show3dMap(mapRef.current, mapData);

        // Habilitar selección al hacer clic sobre cualquier coordenada del mapa
        mapViewInstance.on('click', (event: any) => {
          console.log('Evento de clic:', event);

          // Buscar en espacios o lugares
          const clickedSpace = event.spaces?.[0];
          
          if (clickedSpace) {
            // Obtener el nombre desde las ubicaciones asociadas al espacio
            const locationName = clickedSpace.locations?.[0]?.name || clickedSpace.name || `Espacio ${clickedSpace.id}`;
            
            setSelectedSpaceInfo({
              name: locationName,
              id: clickedSpace.id
            });

            // Resaltar el espacio seleccionado en el mapa 3D (Mappedin v6 State API)
            try {
              mapViewInstance.setState(clickedSpace, {
                color: '#38bdf8',
                opacity: 0.8
              });
            } catch (err) {
              console.log('No se pudo aplicar estilo al espacio:', err);
            }
          } else {
            // Si hace clic fuera de una tienda/espacio, limpiar seleccion
            setSelectedSpaceInfo(null);
          }
        });

      } catch (error) {
        console.error('Error al cargar el mapa de Mappedin:', error);
      }
    }

    renderMap();

    return () => {
      if (mapViewInstance) {
        mapViewInstance.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Indicador de ayuda superior */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        color: '#f8fafc',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '13px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: 9999,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        pointerEvents: 'none'
      }}>
        💡 HAZ CLIC SOBRE LOS LOCALES INTERIORES O MESAS PARA SELECCIONARLOS
      </div>

      {/* Tarjeta flotante interactiva */}
      {selectedSpaceInfo && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '18px 24px',
          borderRadius: '14px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 9999,
          border: '1px solid #1e293b',
          minWidth: '240px'
        }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            Ubicación Seleccionada
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: '#f8fafc' }}>
            {selectedSpaceInfo.name}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            ID: {selectedSpaceInfo.id}
          </div>
        </div>
      )}
    </div>
  );
}
