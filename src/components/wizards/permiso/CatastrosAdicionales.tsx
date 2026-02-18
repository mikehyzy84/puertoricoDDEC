"use client";

import { Map } from "lucide-react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MUNICIPIOS } from "@/constants/municipios";

interface CatastrosAdicionalesProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

const CABIDA_UNIDADES = [
  { value: "metros_cuadrados", label: "Metros cuadrados (m²)" },
  { value: "cuerdas", label: "Cuerdas" },
  { value: "acres", label: "Acres" },
  { value: "pies_cuadrados", label: "Pies cuadrados (ft²)" },
] as const;

export default function CatastrosAdicionales({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: CatastrosAdicionalesProps) {
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
        <Map className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Catastros Adicionales
        </h2>
      </div>

      <div className="space-y-6">
        {/* Cabida de la propiedad según escritura */}
        <div>
          <Label htmlFor="cabidaPropiedad" className="text-gray-700">
            Cabida de la propiedad según escritura
          </Label>
          <div className="mt-1.5 flex gap-3">
            <div className="flex-1">
              <Input
                id="cabidaPropiedad"
                value={formData.cabidaPropiedad}
                onChange={(e) =>
                  updateField("cabidaPropiedad", e.target.value)
                }
                placeholder="Ej. 500"
              />
            </div>
            <select
              id="cabidaUnidad"
              value={formData.cabidaUnidad}
              onChange={(e) => updateField("cabidaUnidad", e.target.value)}
              className={cn(
                "flex h-9 w-52 shrink-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                !formData.cabidaUnidad && "text-muted-foreground"
              )}
            >
              <option value="" disabled>
                Unidad
              </option>
              {CABIDA_UNIDADES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Municipio */}
        <div>
          <Label htmlFor="municipioAdicional" className="text-gray-700">
            Municipio
          </Label>
          <select
            id="municipioAdicional"
            value={formData.municipioAdicional}
            onChange={(e) =>
              updateField("municipioAdicional", e.target.value)
            }
            className={cn(
              "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              !formData.municipioAdicional && "text-muted-foreground"
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

        {/* Dirección Física (read-only, populated from catastro) */}
        <div>
          <Label htmlFor="direccionFisica" className="text-gray-700">
            Dirección Física
          </Label>
          <Input
            id="direccionFisica"
            value={formData.direccionFisica}
            readOnly
            className="mt-1.5 bg-gray-50 text-gray-600"
            placeholder="Se completará automáticamente desde el catastro"
          />
        </div>

        {/* Tipo de Dirección */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">
            Tipo de Dirección
          </legend>
          <div className="mt-2 flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="tipoDireccion"
                value="urbana"
                checked={formData.tipoDireccion === "urbana"}
                onChange={() => updateField("tipoDireccion", "urbana")}
                className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
              />
              <span className="text-gray-700">Urbana</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="tipoDireccion"
                value="rural"
                checked={formData.tipoDireccion === "rural"}
                onChange={() => updateField("tipoDireccion", "rural")}
                className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
              />
              <span className="text-gray-700">Rural</span>
            </label>
          </div>
        </fieldset>

        {/* Código postal */}
        <div>
          <Label htmlFor="codigoPostal" className="text-gray-700">
            Código Postal
          </Label>
          <Input
            id="codigoPostal"
            value={formData.codigoPostal}
            onChange={(e) => updateField("codigoPostal", e.target.value)}
            placeholder="00000"
            maxLength={10}
            className="mt-1.5"
          />
        </div>

        {/* Estado (read-only, default Puerto Rico) */}
        <div>
          <Label htmlFor="estado" className="text-gray-700">
            Estado
          </Label>
          <Input
            id="estado"
            value={formData.estado}
            readOnly
            className="mt-1.5 bg-gray-50 text-gray-600"
          />
        </div>

        {/* Punto de referencia */}
        <div>
          <Label htmlFor="puntoReferencia" className="text-gray-700">
            Punto de referencia de cómo llegar
          </Label>
          <Textarea
            id="puntoReferencia"
            value={formData.puntoReferencia}
            onChange={(e) => updateField("puntoReferencia", e.target.value)}
            placeholder="Describa cómo llegar a la propiedad"
            rows={3}
            className="mt-1.5"
          />
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
