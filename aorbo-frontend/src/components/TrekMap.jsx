import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

/**
 * TrekMap Component - ENHANCED
 * 
 * Renders an OpenStreetMap using Leaflet with trek markers and OSM location results.
 * Features:
 * - Displays markers for trek results
 * - Displays markers for OpenStreetMap Nominatim results
 * - Zoom to searched location
 * - Interactive popups with trek info or location info
 * - Sync with trek cards via callbacks
 * - Different marker colors for trek vs OSM results
 * 
 * Props:
 * - treks (array): Array of trek objects with coordinates (database results)
 * - osmResults (array): Array of OpenStreetMap results (Nominatim API results)
 * - searchedLocation (string): Location being searched (for zooming)
 * - onMarkerClick (function): Callback when marker is clicked
 * - highlightedTrekId (string): Trek ID to highlight on map
 */
export default function TrekMap({ 
  treks = [], 
  osmResults = [],
  searchedLocation = null, 
  onMarkerClick = null, 
  highlightedTrekId = null 
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});

  // 🗺️ India center coordinates (default view)
  const INDIA_CENTER = [20.5937, 78.9629];
  const DEFAULT_ZOOM = 4;
  const SEARCH_ZOOM = 10;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map if not already done
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(INDIA_CENTER, DEFAULT_ZOOM);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // ========== ADD TREK MARKERS ==========
    treks.forEach((trek) => {
      if (trek.latitude && trek.longitude) {
        const isHighlighted = trek.id === highlightedTrekId;
        const markerColor = isHighlighted ? '#FF6B35' : '#ECC258'; // Orange if highlighted, gold otherwise

        const markerIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${markerColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.2s;
              font-weight: bold;
              color: white;
              font-size: 16px;
            ">
              🏔️
            </div>
          `,
          className: 'trek-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker(
          [trek.latitude, trek.longitude],
          { icon: markerIcon }
        ).addTo(map.current);

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 250px;">
            <div style="background: #ECC258; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: #111827;">
              🏔️ TREK PACKAGE
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="font-size: 16px; color: #111827;">${trek.name}</strong>
            </div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">
              📍 ${trek.state}
            </div>
            ${trek.images && trek.images[0] && trek.images[0].image_url ? `
              <img src="${trek.images[0].image_url}" alt="${trek.name}" 
                   style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            ` : ''}
            <div style="font-size: 13px; color: #111827; margin-bottom: 8px; line-height: 1.5;">
              <div>🕒 ${trek.duration_days || 'N/A'}</div>
              <div>💰 From ₹${trek.price_start || 'N/A'}</div>
            </div>
            <a href="/treks/${trek.id}" style="
              display: inline-block;
              background-color: #111827;
              color: #ECC258;
              padding: 6px 14px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              font-size: 12px;
              cursor: pointer;
            ">
              View Trek Package →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: 'trek-popup',
        });

        marker.on('click', () => {
          marker.openPopup();
          if (onMarkerClick) {
            onMarkerClick(trek);
          }
        });

        if (isHighlighted) {
          marker.openPopup();
        }

        markersRef.current[trek.id] = marker;
      }
    });

    // ========== ADD OSM LOCATION MARKERS ==========
    osmResults.forEach((result) => {
      if (result.lat && result.lon) {
        const markerIcon = L.divIcon({
          html: `
            <div style="
              background-color: #3B82F6;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
              cursor: pointer;
              transition: all 0.2s;
              font-weight: bold;
              color: white;
              font-size: 16px;
            ">
              📍
            </div>
          `,
          className: 'osm-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker(
          [result.lat, result.lon],
          { icon: markerIcon }
        ).addTo(map.current);

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 250px;">
            <div style="background: #3B82F6; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: white;">
              📍 LOCATION
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="font-size: 16px; color: #111827;">${result.name}</strong>
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px; line-height: 1.5;">
              ${result.display_name}
            </div>
            <div style="font-size: 11px; color: #9ca3af; padding: 8px; background: #f3f4f6; border-radius: 4px; margin-bottom: 8px;">
              📡 Lat: ${result.lat.toFixed(4)}, Lon: ${result.lon.toFixed(4)}
            </div>
            <div style="font-size: 12px; color: #ECC258; padding: 8px; background: #fef9c3; border-radius: 4px;">
              ⚠️ No trek packages currently available for this location. Showing map results from OpenStreetMap.
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: 'osm-popup',
        });

        marker.on('click', () => {
          marker.openPopup();
        });

        markersRef.current[result.id] = marker;
      }
    });

    // ========== ZOOM TO LOCATION ==========
    if (searchedLocation) {
      // Prefer trek locations first
      if (treks.length > 0) {
        const firstValidTrek = treks.find(t => t.latitude && t.longitude);
        if (firstValidTrek) {
          map.current.setView(
            [firstValidTrek.latitude, firstValidTrek.longitude],
            SEARCH_ZOOM,
            { animate: true, duration: 0.8 }
          );
          return;
        }
      }

      // Otherwise use OSM result
      if (osmResults.length > 0) {
        const firstResult = osmResults[0];
        map.current.setView(
          [firstResult.lat, firstResult.lon],
          SEARCH_ZOOM,
          { animate: true, duration: 0.8 }
        );
      }
    } else if (treks.length === 0 && osmResults.length === 0) {
      // Reset to India view when search is cleared
      map.current.setView(INDIA_CENTER, DEFAULT_ZOOM, { animate: true, duration: 0.8 });
    }

  }, [treks, osmResults, searchedLocation, highlightedTrekId, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
      }}
    />
  );
}
