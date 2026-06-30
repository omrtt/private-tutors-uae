import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UAE_CENTER = [24.4539, 54.3773];

export default function MapView({ emirate }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView(UAE_CENTER, 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    L.marker(UAE_CENTER).addTo(mapInstance.current).bindPopup('الإمارات');

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapRef} className="h-[300px] rounded-2xl overflow-hidden" />;
}
