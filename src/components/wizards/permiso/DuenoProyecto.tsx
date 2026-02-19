"use client";

import { useState } from "react";
import { Search, Plus, User, Building2, Users } from "lucide-react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DuenoProyectoProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

const CIUDADANIAS = [
  "Ciudadano Americano",
  "Residente Permanente",
  "Extranjero no Residente",
] as const;

const TIPOS_IDENTIFICACION = [
  { value: "ssn", label: "Número de Seguro Social" },
  { value: "ein", label: "Número de Identificación Patronal (EIN)" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "otro", label: "Otro" },
] as const;

const PLACEHOLDER_NAME = "Juan A. Del Pueblo";

export default function DuenoProyecto({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: DuenoProyectoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (formData.tipoDueno === "otra_persona") {
      if (!formData.ciudadania) {
        newErrors.ciudadania = "Este campo es requerido";
      }
      if (!formData.busquedaPersona.trim()) {
        newErrors.busquedaPersona = "Ingrese un número de identificación para buscar";
      }
    }

    if (formData.tipoDueno === "compania") {
      if (!formData.companiaSeleccionada) {
        newErrors.companiaSeleccionada = "Seleccione o agregue una compañía";
      }
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
        <User className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Dueño del Proyecto
        </h2>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Seleccione quién es el dueño del proyecto.
      </p>

      {/* Owner type radio options */}
      <div className="space-y-4">
        {/* Option 1: Usted */}
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors",
            formData.tipoDueno === "usted"
              ? "border-[#2A9D8F] bg-[#2A9D8F]/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <input
            type="radio"
            name="tipoDueno"
            value="usted"
            checked={formData.tipoDueno === "usted"}
            onChange={() => updateField("tipoDueno", "usted")}
            className="mt-0.5 h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#2A9D8F]" />
              <span className="text-sm font-medium text-gray-900">Usted</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Los datos se completarán automáticamente desde su perfil.
            </p>

            {/* Auto-filled display when selected */}
            {formData.tipoDueno === "usted" && (
              <div className="mt-3 rounded-md bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">
                  Nombre y Apellido del dueño del Proyecto
                </p>
                <p className="mt-1 text-sm font-medium text-[#1B4332]">
                  {PLACEHOLDER_NAME}
                </p>
              </div>
            )}
          </div>
        </label>

        {/* Option 2: De otra persona */}
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors",
            formData.tipoDueno === "otra_persona"
              ? "border-[#2A9D8F] bg-[#2A9D8F]/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <input
            type="radio"
            name="tipoDueno"
            value="otra_persona"
            checked={formData.tipoDueno === "otra_persona"}
            onChange={() => updateField("tipoDueno", "otra_persona")}
            className="mt-0.5 h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2A9D8F]" />
              <span className="text-sm font-medium text-gray-900">
                De otra persona
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Busque al dueño del proyecto por su número de identificación.
            </p>
          </div>
        </label>

        {/* Expanded fields for "De otra persona" */}
        {formData.tipoDueno === "otra_persona" && (
          <div className="ml-7 space-y-4 rounded-md border border-gray-100 bg-gray-50/50 p-4">
            {/* Ciudadanía */}
            <div>
              <Label htmlFor="ciudadania" className="text-gray-700">
                Ciudadanía <span className="text-red-500">*</span>
              </Label>
              <select
                id="ciudadania"
                value={formData.ciudadania}
                onChange={(e) => updateField("ciudadania", e.target.value)}
                className={cn(
                  "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  !formData.ciudadania && "text-muted-foreground",
                  errors.ciudadania &&
                    "border-red-400 focus-visible:ring-red-400"
                )}
                aria-required="true"
                aria-invalid={!!errors.ciudadania}
              >
                <option value="" disabled>
                  Seleccione ciudadanía
                </option>
                {CIUDADANIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.ciudadania && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.ciudadania}
                </p>
              )}
            </div>

            {/* Tipo de Identificación */}
            <div>
              <Label htmlFor="tipoIdentificacion" className="text-gray-700">
                Tipo de Identificación
              </Label>
              <select
                id="tipoIdentificacion"
                value={formData.tipoIdentificacion}
                onChange={(e) =>
                  updateField("tipoIdentificacion", e.target.value)
                }
                className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {TIPOS_IDENTIFICACION.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search field */}
            <div>
              <Label htmlFor="busquedaPersona" className="text-gray-700">
                Buscar Persona <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="busquedaPersona"
                  value={formData.busquedaPersona}
                  onChange={(e) =>
                    updateField("busquedaPersona", e.target.value)
                  }
                  placeholder="Ingrese número de identificación"
                  className={cn(
                    "pr-10",
                    errors.busquedaPersona &&
                      "border-red-400 focus-visible:ring-red-400"
                  )}
                  aria-required="true"
                  aria-invalid={!!errors.busquedaPersona}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-r-md text-gray-400 transition-colors hover:text-[#2A9D8F]"
                  aria-label="Buscar persona"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              {errors.busquedaPersona && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.busquedaPersona}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Option 3: De una compañía */}
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors",
            formData.tipoDueno === "compania"
              ? "border-[#2A9D8F] bg-[#2A9D8F]/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <input
            type="radio"
            name="tipoDueno"
            value="compania"
            checked={formData.tipoDueno === "compania"}
            onChange={() => updateField("tipoDueno", "compania")}
            className="mt-0.5 h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#2A9D8F]" />
              <span className="text-sm font-medium text-gray-900">
                De una compañía
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Seleccione una compañía existente o agregue una nueva.
            </p>
          </div>
        </label>

        {/* Expanded fields for "De una compañía" */}
        {formData.tipoDueno === "compania" && (
          <div className="ml-7 space-y-4 rounded-md border border-gray-100 bg-gray-50/50 p-4">
            {/* Compañía dropdown + agregar button */}
            <div>
              <Label htmlFor="companiaSeleccionada" className="text-gray-700">
                Compañías <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5 flex gap-2">
                <select
                  id="companiaSeleccionada"
                  value={formData.companiaSeleccionada}
                  onChange={(e) =>
                    updateField("companiaSeleccionada", e.target.value)
                  }
                  className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    !formData.companiaSeleccionada && "text-muted-foreground",
                    errors.companiaSeleccionada &&
                      "border-red-400 focus-visible:ring-red-400"
                  )}
                  aria-required="true"
                  aria-invalid={!!errors.companiaSeleccionada}
                >
                  <option value="" disabled>
                    Seleccione una compañía
                  </option>
                  {/* Populated dynamically in future */}
                </select>
                <button
                  type="button"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#2A9D8F] px-3 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar Compañías
                </button>
              </div>
              {errors.companiaSeleccionada && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.companiaSeleccionada}
                </p>
              )}
            </div>

            {/* Decreto question */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                ¿Cuenta la empresa con Decreto otorgado por el Gobierno de
                Puerto Rico?
              </legend>
              <div className="mt-2 flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tieneDecreto"
                    value="si"
                    checked={formData.tieneDecreto === "si"}
                    onChange={() => updateField("tieneDecreto", "si")}
                    className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                  />
                  <span className="text-gray-700">Sí</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tieneDecreto"
                    value="no"
                    checked={formData.tieneDecreto === "no"}
                    onChange={() => updateField("tieneDecreto", "no")}
                    className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </fieldset>
          </div>
        )}
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
          onClick={handleNext}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
