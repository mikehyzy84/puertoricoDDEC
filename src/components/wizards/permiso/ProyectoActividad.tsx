"use client";

import { useState } from "react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ProyectoActividadProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onCancel: () => void;
}

const TIPOS_ZONA = ["Rural", "Urbano"] as const;

const TIPOS_PROYECTO = [
  "Privado",
  "Público",
  "Alianza Público-Privada",
  "Público con Contratación Privada",
] as const;

const FONDOS_FEDERALES = [
  { value: "cdbg_dr", label: "Fondos CDBG-DR" },
  { value: "cor3_fema", label: "Fondos COR3/FEMA" },
  { value: "no_aplica", label: "No aplica" },
] as const;

const DESIGNACIONES = [
  { value: "critico", label: "Crítico" },
  { value: "estrategico", label: "Estratégico" },
  { value: "no_aplica", label: "No aplica" },
] as const;

export default function ProyectoActividad({
  formData,
  updateField,
  onNext,
  onCancel,
}: ProyectoActividadProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof PermisoFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PermisoFormData, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "Este campo es requerido";
    }
    if (!formData.tipoZona) {
      newErrors.tipoZona = "Este campo es requerido";
    }
    if (!formData.tipoProyecto) {
      newErrors.tipoProyecto = "Este campo es requerido";
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "Este campo es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) {
      onNext();
    }
  }

  function handleSave() {
    // Save draft — no validation required
  }

  function handleSaveAndContinue() {
    if (validate()) {
      onNext();
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      {/* Section title */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
        <span className="text-lg">🏢</span>
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Proyecto o Actividad
        </h2>
      </div>

      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <Label htmlFor="nombre" className="text-gray-700">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
            placeholder="Ingrese el nombre del proyecto"
            className={cn("mt-1.5", errors.nombre && "border-red-400 focus-visible:ring-red-400")}
            aria-required="true"
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
          )}
        </div>

        {/* Tipo de Zona */}
        <div>
          <Label htmlFor="tipoZona" className="text-gray-700">
            Tipo de Zona <span className="text-red-500">*</span>
          </Label>
          <select
            id="tipoZona"
            value={formData.tipoZona}
            onChange={(e) => updateField("tipoZona", e.target.value)}
            className={cn(
              "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              !formData.tipoZona && "text-muted-foreground",
              errors.tipoZona && "border-red-400 focus-visible:ring-red-400"
            )}
            aria-required="true"
            aria-invalid={!!errors.tipoZona}
          >
            <option value="" disabled>
              Seleccione una zona
            </option>
            {TIPOS_ZONA.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
          {errors.tipoZona && (
            <p className="mt-1 text-xs text-red-500">{errors.tipoZona}</p>
          )}
        </div>

        {/* Tipo de Proyecto */}
        <div>
          <Label htmlFor="tipoProyecto" className="text-gray-700">
            Tipo de Proyecto <span className="text-red-500">*</span>
          </Label>
          <select
            id="tipoProyecto"
            value={formData.tipoProyecto}
            onChange={(e) => updateField("tipoProyecto", e.target.value)}
            className={cn(
              "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              !formData.tipoProyecto && "text-muted-foreground",
              errors.tipoProyecto && "border-red-400 focus-visible:ring-red-400"
            )}
            aria-required="true"
            aria-invalid={!!errors.tipoProyecto}
          >
            <option value="" disabled>
              Seleccione un tipo de proyecto
            </option>
            {TIPOS_PROYECTO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipoProyecto && (
            <p className="mt-1 text-xs text-red-500">{errors.tipoProyecto}</p>
          )}
        </div>

        {/* Fondos Federales — radio group */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">
            Fondos Federales
          </legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {FONDOS_FEDERALES.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="fondosFederales"
                  value={option.value}
                  checked={formData.fondosFederales === option.value}
                  onChange={(e) =>
                    updateField("fondosFederales", e.target.value)
                  }
                  className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Designación — radio group */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">
            Designación
          </legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {DESIGNACIONES.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="designacion"
                  value={option.value}
                  checked={formData.designacion === option.value}
                  onChange={(e) =>
                    updateField("designacion", e.target.value)
                  }
                  className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Descripción */}
        <div>
          <Label htmlFor="descripcion" className="text-gray-700">
            Descripción del Proyecto <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => updateField("descripcion", e.target.value)}
            placeholder="Describa el proyecto o actividad"
            rows={4}
            className={cn(
              "mt-1.5",
              errors.descripcion && "border-red-400 focus-visible:ring-red-400"
            )}
            aria-required="true"
            aria-invalid={!!errors.descripcion}
          />
          {errors.descripcion && (
            <p className="mt-1 text-xs text-red-500">{errors.descripcion}</p>
          )}
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
          onClick={handleNext}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
