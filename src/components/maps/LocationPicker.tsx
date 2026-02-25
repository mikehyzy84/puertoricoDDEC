"use client";

import { useState, useCallback } from "react";
import CatastroMap from "./CatastroMap";
import { useCatastroLookup } from "@/hooks/useCatastroLookup";
import type { CatastroResult } from "@/types/catastro";

interface LocationPickerProps {
  /** Called when a catastro result is found (from any search method) */
  onResult: (result: CatastroResult) => void;
  /** Current catastro number value (controlled) */
  numeroCatastro?: string;
  /** Current coordinate values (controlled) */
  latitud?: string;
  longitud?: string;
  lambertX?: string;
  lambertY?: string;
  /** Called when search input values change */
  onInputChange?: (field: string, value: string) => void;
}

const inputStyle: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #ccc",
  borderRadius: "3px",
  fontSize: "13px",
  fontFamily: "Arial, Helvetica, sans-serif",
  outline: "none",
};

const searchBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  backgroundColor: "#2b8a7a",
  color: "#fff",
  border: "none",
  borderRadius: "3px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "Arial, Helvetica, sans-serif",
  whiteSpace: "nowrap",
};

export default function LocationPicker({
  onResult,
  numeroCatastro = "",
  latitud = "",
  longitud = "",
  lambertX = "",
  lambertY = "",
  onInputChange,
}: LocationPickerProps) {
  const { loading, error, search } = useCatastroLookup();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>();

  const [localCatastro, setLocalCatastro] = useState(numeroCatastro);
  const [localLat, setLocalLat] = useState(latitud);
  const [localLng, setLocalLng] = useState(longitud);
  const [localLambertX, setLocalLambertX] = useState(lambertX);
  const [localLambertY, setLocalLambertY] = useState(lambertY);

  const handleResult = useCallback(
    (result: CatastroResult) => {
      onResult(result);
      // If result has coordinates, center the map
      if (result.coordenadas) {
        const parts = result.coordenadas.split(",").map((s) => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          setMapCenter({ lat: parts[0], lng: parts[1] });
        }
      }
    },
    [onResult]
  );

  const searchByCatastro = useCallback(async () => {
    if (!localCatastro.trim()) return;
    const result = await search({ numeroCatastro: localCatastro.trim() });
    if (result) handleResult(result);
  }, [localCatastro, search, handleResult]);

  const searchByCoords = useCallback(async () => {
    if (!localLat.trim() || !localLng.trim()) return;
    const result = await search({ latitud: localLat.trim(), longitud: localLng.trim() });
    if (result) handleResult(result);
    // Also center map on the searched coords
    const lat = parseFloat(localLat);
    const lng = parseFloat(localLng);
    if (!isNaN(lat) && !isNaN(lng)) setMapCenter({ lat, lng });
  }, [localLat, localLng, search, handleResult]);

  const searchByLambert = useCallback(async () => {
    if (!localLambertX.trim() || !localLambertY.trim()) return;
    const result = await search({ lambertX: localLambertX.trim(), lambertY: localLambertY.trim() });
    if (result) handleResult(result);
  }, [localLambertX, localLambertY, search, handleResult]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setLocalLat(lat.toFixed(6));
      setLocalLng(lng.toFixed(6));
      onInputChange?.("latitud", lat.toFixed(6));
      onInputChange?.("longitud", lng.toFixed(6));
      setMapCenter({ lat, lng });
      const result = await search({ latitud: lat.toString(), longitud: lng.toString() });
      if (result) handleResult(result);
    },
    [search, handleResult, onInputChange]
  );

  const updateField = (setter: (v: string) => void, field: string, value: string) => {
    setter(value);
    onInputChange?.(field, value);
  };

  return (
    <div>
      {/* Info box */}
      <div
        style={{
          backgroundColor: "#e8f5e9",
          border: "1px solid #a5d6a7",
          borderRadius: "4px",
          padding: "12px 16px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#333" }}>
          Identifique la localización con una (1) de las siguientes opciones:
        </div>
        <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px", color: "#555", lineHeight: 1.6 }}>
          <li>Número de catastro</li>
          <li>Coordenadas Geográficas o las coordenadas Lambert</li>
          <li>Seleccionando la ubicación o parcela en el mapa a continuación (buscar sobre el mapa)</li>
        </ul>
      </div>

      {/* Search by Catastro Number */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Número Catastro:</span>
        <input
          type="text"
          placeholder="000-000-000-00"
          style={{ ...inputStyle, flex: 1 }}
          value={localCatastro}
          onChange={(e) => updateField(setLocalCatastro, "numeroCatastro", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchByCatastro()}
        />
        <button type="button" style={searchBtnStyle} onClick={searchByCatastro} disabled={loading}>
          Buscar
        </button>
      </div>

      {/* Search by Geographic Coordinates */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Coordenadas Geográficas:</span>
        <span style={{ fontSize: "12px", color: "#666" }}>Latitud:</span>
        <input
          type="text"
          placeholder="18.2208"
          style={{ ...inputStyle, width: "120px" }}
          value={localLat}
          onChange={(e) => updateField(setLocalLat, "latitud", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchByCoords()}
        />
        <span style={{ fontSize: "12px", color: "#666" }}>Longitud:</span>
        <input
          type="text"
          placeholder="-66.5901"
          style={{ ...inputStyle, width: "120px" }}
          value={localLng}
          onChange={(e) => updateField(setLocalLng, "longitud", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchByCoords()}
        />
        <button type="button" style={searchBtnStyle} onClick={searchByCoords} disabled={loading}>
          Buscar
        </button>
      </div>

      {/* Search by Lambert Coordinates */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Coordenadas Lambert:</span>
        <span style={{ fontSize: "12px", color: "#666" }}>X:</span>
        <input
          type="text"
          placeholder="0"
          style={{ ...inputStyle, width: "120px" }}
          value={localLambertX}
          onChange={(e) => updateField(setLocalLambertX, "lambertX", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchByLambert()}
        />
        <span style={{ fontSize: "12px", color: "#666" }}>Y:</span>
        <input
          type="text"
          placeholder="0"
          style={{ ...inputStyle, width: "120px" }}
          value={localLambertY}
          onChange={(e) => updateField(setLocalLambertY, "lambertY", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchByLambert()}
        />
        <button type="button" style={searchBtnStyle} onClick={searchByLambert} disabled={loading}>
          Buscar
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            padding: "8px 12px",
            marginBottom: "12px",
            fontSize: "12px",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* Map */}
      <CatastroMap onMapClick={handleMapClick} center={mapCenter} loading={loading} />
    </div>
  );
}
