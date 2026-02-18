"use client";

import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MUNICIPIOS } from "@/constants/municipios";
import type { SolicitudFormData } from "@/app/solicitudes/[tipo]/page";

interface MunicipioProps {
  formData: SolicitudFormData;
  updateField: <K extends keyof SolicitudFormData>(
    field: K,
    value: SolicitudFormData[K]
  ) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function Municipio({
  formData,
  updateField,
  onNext,
  onCancel,
}: MunicipioProps) {
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
        <h2 className="text-lg font-semibold text-[#1B4332]">Municipio</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="municipio" className="text-gray-700">
            En qué municipio se solicita el trámite{" "}
            <span className="text-red-500">*</span>
          </Label>
          <select
            id="municipio"
            value={formData.municipio}
            onChange={(e) => updateField("municipio", e.target.value)}
            className={cn(
              "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              !formData.municipio && "text-muted-foreground"
            )}
          >
            <option value="" disabled>
              Seleccione un municipio
            </option>
            {MUNICIPIOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-6">
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
