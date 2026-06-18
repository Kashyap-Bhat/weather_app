import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { omProtocol } from '@openmeteo/weather-map-layer';

export default function WeatherMap({ weather }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    maplibregl.addProtocol('om', omProtocol);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          base: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            ],
            tileSize: 256,
            attribution: '© CARTO, © OpenStreetMap',
          },
        },
        layers: [
          { id: 'base-layer', type: 'raster', source: 'base' },
        ],
      },
      center: [0, 20],
      zoom: 1.5,
      attributionControl: { compact: true },
    });

    map.on('load', () => {
      map.addSource('weather', {
        type: 'raster',
        url: 'om://https://map-tiles.open-meteo.com/data_spatial/dwd_icon/latest.json?variable=temperature_2m&time_step=current_time_1H',
        maxzoom: 12,
      });
      map.addLayer({
        id: 'weather-layer',
        type: 'raster',
        source: 'weather',
        paint: { 'raster-opacity': 0.55 },
      });
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !weather?.latitude || !weather?.longitude) return;
    m.flyTo({ center: [weather.longitude, weather.latitude], zoom: 8, duration: 2000 });
  }, [weather?.latitude, weather?.longitude]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  );
}
