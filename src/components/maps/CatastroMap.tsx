"use client";

import { useRef, useEffect, useCallback } from "react";

interface CatastroMapProps {
  /** Called when user clicks on the map with the lat/lng of the click point */
  onMapClick?: (lat: number, lng: number) => void;
  /** Center map on these coordinates (WGS84) */
  center?: { lat: number; lng: number };
  /** Whether the map is currently loading a search */
  loading?: boolean;
}

// Puerto Rico center coordinates
const PR_CENTER = { lat: 18.2208, lng: -66.5901 };
const PR_ZOOM = 9;

export default function CatastroMap({ onMapClick, center, loading }: CatastroMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerLayerRef = useRef<any>(null);

  const stableOnMapClick = useRef(onMapClick);
  stableOnMapClick.current = onMapClick;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    let destroyed = false;

    async function initMap() {
      const [
        { default: Map },
        { default: MapView },
        { default: TileLayer },
        { default: GraphicsLayer },
        { default: Graphic },
        { default: Point },
      ] = await Promise.all([
        import("@arcgis/core/Map"),
        import("@arcgis/core/views/MapView"),
        import("@arcgis/core/layers/TileLayer"),
        import("@arcgis/core/layers/GraphicsLayer"),
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Point"),
      ]);

      if (destroyed) return;

      // PR Catastro parcels tile layer (public ArcGIS service)
      const catastroLayer = new TileLayer({
        url: "https://gis.jp.pr.gov/ArcGIS/rest/services/Catastro/Catastro_parcelas/MapServer",
        opacity: 0.6,
      });

      const graphicsLayer = new GraphicsLayer();
      markerLayerRef.current = { GraphicsLayer: graphicsLayer, Graphic, Point };

      const map = new Map({
        basemap: "topo-vector",
        layers: [catastroLayer, graphicsLayer],
      });

      const view = new MapView({
        container: mapRef.current!,
        map,
        center: [PR_CENTER.lng, PR_CENTER.lat],
        zoom: PR_ZOOM,
        constraints: {
          minZoom: 7,
          maxZoom: 20,
        },
      });

      viewRef.current = view;

      view.on("click", (event) => {
        const lat = event.mapPoint?.latitude;
        const lng = event.mapPoint?.longitude;
        if (stableOnMapClick.current && lat != null && lng != null) {
          stableOnMapClick.current(lat, lng);
        }
      });
    }

    initMap();

    return () => {
      destroyed = true;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  // Update map center when center prop changes
  const goToCenter = useCallback(async (lat: number, lng: number) => {
    const view = viewRef.current;
    if (!view) return;

    try {
      await view.goTo({ center: [lng, lat], zoom: 17 }, { duration: 800 });

      // Add/update marker
      const refs = markerLayerRef.current;
      if (refs) {
        const { GraphicsLayer: layer, Graphic, Point: PointClass } = refs;
        layer.removeAll();
        const point = new PointClass({ latitude: lat, longitude: lng });
        const marker = new Graphic({
          geometry: point,
          symbol: {
            type: "simple-marker",
            color: [45, 106, 79, 0.8], // #2D6A4F
            outline: { color: [255, 255, 255], width: 2 },
            size: "14px",
          },
        });
        layer.add(marker);
      }
    } catch {
      // View may not be ready yet
    }
  }, []);

  useEffect(() => {
    if (center) {
      goToCenter(center.lat, center.lng);
    }
  }, [center, goToCenter]);

  return (
    <div style={{ position: "relative", width: "100%", height: "300px" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "13px", color: "#555", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="10" fill="none" stroke="#2D6A4F" strokeWidth="3" strokeDasharray="31.4 31.4" />
            </svg>
            Buscando parcela...
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
