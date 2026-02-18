"use client";

import { MapPin, Search, Info } from "lucide-react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocalizacionProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

const CATASTRO_DETAIL_FIELDS: {
  key: keyof PermisoFormData;
  label: string;
}[] = [
  { key: "numeroCatastro", label: "Número de catastro" },
  { key: "zonaInundable", label: "Zona inundable" },
  { key: "catastroExt", label: "Número de catastro ext" },
  { key: "floodway", label: "Floodway" },
  { key: "areaAproximada", label: "Área aproximada" },
  { key: "calificacion", label: "Calificación" },
  { key: "municipioCatastro", label: "Municipio" },
  { key: "calificacionSobrepuesto", label: "Calificación sobrepuesto" },
  { key: "barrio", label: "Barrio" },
  { key: "clasificacion", label: "Clasificación" },
  { key: "zonaSitioHistorico", label: "Zona o sitio histórico" },
  { key: "coordenadas", label: "Coordenadas" },
  { key: "usosPermiso", label: "Usos de permiso" },
  { key: "coordenadasNad83", label: "Coordenadas Nad83" },
  { key: "sueloGeologico", label: "Suelo geológico" },
  { key: "calificacionesEfectivas", label: "Calificaciones efectivas" },
];

export default function Localizacion({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: LocalizacionProps) {
  function handleSave() {
    // Save draft — no validation required
  }

  function handleSaveAndContinue() {
    onNext();
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      {/* Section title */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
        <MapPin className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">Localización</h2>
      </div>

      {/* Info box */}
      <div className="mb-6 flex gap-3 rounded-md border border-[#2A9D8F]/30 bg-[#2A9D8F]/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2A9D8F]" />
        <div className="text-sm text-[#1B4332]">
          <p className="font-medium">
            Puede buscar la localización del proyecto de tres maneras:
          </p>
          <ol className="mt-1.5 list-inside list-decimal space-y-0.5 text-gray-600">
            <li>
              Por <strong>Número de catastro</strong> (formato: 000-000-000-00)
            </li>
            <li>
              Por <strong>Coordenadas Geográficas</strong> (Latitud / Longitud)
            </li>
            <li>
              Seleccionando directamente en el <strong>mapa</strong>
            </li>
          </ol>
        </div>
      </div>

      {/* Search inputs */}
      <div className="space-y-6">
        {/* Número de Catastro search */}
        <div>
          <Label htmlFor="numeroCatastroSearch" className="text-gray-700">
            Número de Catastro
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="numeroCatastroSearch"
              value={formData.numeroCatastroSearch}
              onChange={(e) =>
                updateField("numeroCatastroSearch", e.target.value)
              }
              placeholder="000-000-000-00"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-r-md bg-[#2A9D8F] text-white transition-colors hover:bg-[#238577]"
              aria-label="Buscar por número de catastro"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Coordenadas Geográficas */}
        <div>
          <p className="text-sm font-medium text-gray-700">
            Coordenadas Geográficas
          </p>
          <div className="mt-1.5 flex gap-3">
            <div className="flex-1">
              <Label htmlFor="latitud" className="text-xs text-gray-500">
                Latitud
              </Label>
              <Input
                id="latitud"
                value={formData.latitud}
                onChange={(e) => updateField("latitud", e.target.value)}
                placeholder="18.2208"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="longitud" className="text-xs text-gray-500">
                Longitud
              </Label>
              <Input
                id="longitud"
                value={formData.longitud}
                onChange={(e) => updateField("longitud", e.target.value)}
                placeholder="-66.5901"
                className="mt-1"
              />
            </div>
            <button
              type="button"
              className="mt-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2A9D8F] text-white transition-colors hover:bg-[#238577]"
              aria-label="Buscar por coordenadas geográficas"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Coordenadas Lambert */}
        <div>
          <p className="text-sm font-medium text-gray-700">
            Coordenadas Lambert
          </p>
          <div className="mt-1.5 flex gap-3">
            <div className="flex-1">
              <Label htmlFor="lambertX" className="text-xs text-gray-500">
                X
              </Label>
              <Input
                id="lambertX"
                value={formData.lambertX}
                onChange={(e) => updateField("lambertX", e.target.value)}
                placeholder="X"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="lambertY" className="text-xs text-gray-500">
                Y
              </Label>
              <Input
                id="lambertY"
                value={formData.lambertY}
                onChange={(e) => updateField("lambertY", e.target.value)}
                placeholder="Y"
                className="mt-1"
              />
            </div>
            <button
              type="button"
              className="mt-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2A9D8F] text-white transition-colors hover:bg-[#238577]"
              aria-label="Buscar por coordenadas Lambert"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Map placeholder */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">
            Mapa de Puerto Rico
          </p>
          <div className="flex h-72 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 sm:h-96">
            <div className="text-center text-gray-400">
              <MapPin className="mx-auto mb-2 h-10 w-10" />
              <p className="text-sm font-medium">Mapa ArcGIS / Esri</p>
              <p className="mt-1 text-xs">
                Haga clic en el mapa para seleccionar una parcela
              </p>
            </div>
          </div>
        </div>

        {/* Detalles del Catastro */}
        <div>
          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
            <h3 className="text-base font-semibold text-[#1B4332]">
              Detalles del Catastro
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {CATASTRO_DETAIL_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="mt-0.5 min-h-[1.75rem] rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                  {(formData[key] as string) || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a42]"
        >
          Paso Anterior
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={handleSaveAndContinue}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Guardar y Continuar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-[#E76F51] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#d45d3f]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
