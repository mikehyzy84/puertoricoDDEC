"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DuenoSolarProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

const PAISES = [
  { value: "US", label: "United States" },
  { value: "PR", label: "Puerto Rico" },
  { value: "MX", label: "México" },
  { value: "DO", label: "República Dominicana" },
  { value: "ES", label: "España" },
  { value: "CO", label: "Colombia" },
  { value: "VE", label: "Venezuela" },
  { value: "AR", label: "Argentina" },
  { value: "CU", label: "Cuba" },
  { value: "PE", label: "Perú" },
  { value: "CL", label: "Chile" },
  { value: "BR", label: "Brasil" },
  { value: "CA", label: "Canadá" },
  { value: "GB", label: "United Kingdom" },
  { value: "FR", label: "Francia" },
  { value: "DE", label: "Alemania" },
] as const;

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "PR", label: "Puerto Rico" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "VI", label: "Virgin Islands" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const;

type FieldKey =
  | "duenoNombre"
  | "duenoApellido"
  | "duenoTelefono"
  | "duenoEmail"
  | "duenoDireccionLinea1"
  | "duenoPais"
  | "duenoEstado"
  | "duenoCiudad"
  | "duenoCodigoPostal";

const REQUIRED_FIELDS: FieldKey[] = [
  "duenoNombre",
  "duenoApellido",
  "duenoTelefono",
  "duenoEmail",
  "duenoDireccionLinea1",
  "duenoPais",
  "duenoEstado",
  "duenoCiudad",
  "duenoCodigoPostal",
];

export default function DuenoSolar({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: DuenoSolarProps) {
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<FieldKey, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es requerido";
      }
    }

    if (
      formData.duenoEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.duenoEmail)
    ) {
      newErrors.duenoEmail = "Ingrese un correo electrónico válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBlur(field: FieldKey) {
    if (REQUIRED_FIELDS.includes(field) && !formData[field].trim()) {
      setErrors((prev) => ({ ...prev, [field]: "Este campo es requerido" }));
    } else if (
      field === "duenoEmail" &&
      formData.duenoEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.duenoEmail)
    ) {
      setErrors((prev) => ({
        ...prev,
        duenoEmail: "Ingrese un correo electrónico válido",
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
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

  function handleNext() {
    if (validate()) {
      onNext();
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      {/* Section title */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
        <Users className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Dueño del Solar
        </h2>
      </div>

      <div className="space-y-6">
        {/* Row: Nombre / Inicial / Apellido */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Nombre */}
          <div>
            <Label htmlFor="duenoNombre" className="text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoNombre"
              value={formData.duenoNombre}
              onChange={(e) => updateField("duenoNombre", e.target.value)}
              onBlur={() => handleBlur("duenoNombre")}
              placeholder="Nombre"
              className={cn("mt-1.5", errors.duenoNombre && "border-red-500")}
            />
            {errors.duenoNombre && (
              <p className="mt-1 text-xs text-red-500">{errors.duenoNombre}</p>
            )}
          </div>

          {/* Inicial */}
          <div>
            <Label htmlFor="duenoInicial" className="text-gray-700">
              Inicial
            </Label>
            <Input
              id="duenoInicial"
              value={formData.duenoInicial}
              onChange={(e) => updateField("duenoInicial", e.target.value)}
              placeholder="Inicial"
              maxLength={1}
              className="mt-1.5"
            />
          </div>

          {/* Apellido */}
          <div>
            <Label htmlFor="duenoApellido" className="text-gray-700">
              Apellido <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoApellido"
              value={formData.duenoApellido}
              onChange={(e) => updateField("duenoApellido", e.target.value)}
              onBlur={() => handleBlur("duenoApellido")}
              placeholder="Apellido"
              className={cn(
                "mt-1.5",
                errors.duenoApellido && "border-red-500"
              )}
            />
            {errors.duenoApellido && (
              <p className="mt-1 text-xs text-red-500">
                {errors.duenoApellido}
              </p>
            )}
          </div>
        </div>

        {/* Row: Teléfono / Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Teléfono */}
          <div>
            <Label htmlFor="duenoTelefono" className="text-gray-700">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoTelefono"
              type="tel"
              value={formData.duenoTelefono}
              onChange={(e) => updateField("duenoTelefono", e.target.value)}
              onBlur={() => handleBlur("duenoTelefono")}
              placeholder="(787) 000-0000"
              className={cn(
                "mt-1.5",
                errors.duenoTelefono && "border-red-500"
              )}
            />
            {errors.duenoTelefono && (
              <p className="mt-1 text-xs text-red-500">
                {errors.duenoTelefono}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="duenoEmail" className="text-gray-700">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoEmail"
              type="email"
              value={formData.duenoEmail}
              onChange={(e) => updateField("duenoEmail", e.target.value)}
              onBlur={() => handleBlur("duenoEmail")}
              placeholder="correo@ejemplo.com"
              className={cn("mt-1.5", errors.duenoEmail && "border-red-500")}
            />
            {errors.duenoEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.duenoEmail}</p>
            )}
          </div>
        </div>

        {/* Dirección Línea 1 */}
        <div>
          <Label htmlFor="duenoDireccionLinea1" className="text-gray-700">
            Dirección Línea 1 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duenoDireccionLinea1"
            value={formData.duenoDireccionLinea1}
            onChange={(e) =>
              updateField("duenoDireccionLinea1", e.target.value)
            }
            onBlur={() => handleBlur("duenoDireccionLinea1")}
            placeholder="Dirección postal"
            className={cn(
              "mt-1.5",
              errors.duenoDireccionLinea1 && "border-red-500"
            )}
          />
          {errors.duenoDireccionLinea1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.duenoDireccionLinea1}
            </p>
          )}
        </div>

        {/* Dirección Línea 2 */}
        <div>
          <Label htmlFor="duenoDireccionLinea2" className="text-gray-700">
            Dirección Línea 2
          </Label>
          <Input
            id="duenoDireccionLinea2"
            value={formData.duenoDireccionLinea2}
            onChange={(e) =>
              updateField("duenoDireccionLinea2", e.target.value)
            }
            placeholder="Apt, Suite, Unidad, etc. (opcional)"
            className="mt-1.5"
          />
        </div>

        {/* Row: País / Estado */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* País */}
          <div>
            <Label htmlFor="duenoPais" className="text-gray-700">
              País <span className="text-red-500">*</span>
            </Label>
            <select
              id="duenoPais"
              value={formData.duenoPais}
              onChange={(e) => {
                updateField("duenoPais", e.target.value);
                // Reset state when country changes
                updateField("duenoEstado", "");
              }}
              onBlur={() => handleBlur("duenoPais")}
              className={cn(
                "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.duenoPais && "border-red-500",
                !formData.duenoPais && "text-muted-foreground"
              )}
            >
              <option value="" disabled>
                Seleccione un país
              </option>
              {PAISES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.duenoPais && (
              <p className="mt-1 text-xs text-red-500">{errors.duenoPais}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="duenoEstado" className="text-gray-700">
              Estado <span className="text-red-500">*</span>
            </Label>
            {formData.duenoPais === "US" || formData.duenoPais === "PR" ? (
              <select
                id="duenoEstado"
                value={formData.duenoEstado}
                onChange={(e) => updateField("duenoEstado", e.target.value)}
                onBlur={() => handleBlur("duenoEstado")}
                className={cn(
                  "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  errors.duenoEstado && "border-red-500",
                  !formData.duenoEstado && "text-muted-foreground"
                )}
              >
                <option value="" disabled>
                  Seleccione un estado
                </option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="duenoEstado"
                value={formData.duenoEstado}
                onChange={(e) => updateField("duenoEstado", e.target.value)}
                onBlur={() => handleBlur("duenoEstado")}
                placeholder="Estado o provincia"
                className={cn(
                  "mt-1.5",
                  errors.duenoEstado && "border-red-500"
                )}
              />
            )}
            {errors.duenoEstado && (
              <p className="mt-1 text-xs text-red-500">{errors.duenoEstado}</p>
            )}
          </div>
        </div>

        {/* Row: Ciudad / Código Postal */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Ciudad */}
          <div>
            <Label htmlFor="duenoCiudad" className="text-gray-700">
              Ciudad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoCiudad"
              value={formData.duenoCiudad}
              onChange={(e) => updateField("duenoCiudad", e.target.value)}
              onBlur={() => handleBlur("duenoCiudad")}
              placeholder="Ciudad"
              className={cn("mt-1.5", errors.duenoCiudad && "border-red-500")}
            />
            {errors.duenoCiudad && (
              <p className="mt-1 text-xs text-red-500">{errors.duenoCiudad}</p>
            )}
          </div>

          {/* Código Postal */}
          <div>
            <Label htmlFor="duenoCodigoPostal" className="text-gray-700">
              Código Postal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duenoCodigoPostal"
              value={formData.duenoCodigoPostal}
              onChange={(e) =>
                updateField("duenoCodigoPostal", e.target.value)
              }
              onBlur={() => handleBlur("duenoCodigoPostal")}
              placeholder="00000"
              maxLength={10}
              className={cn(
                "mt-1.5",
                errors.duenoCodigoPostal && "border-red-500"
              )}
            />
            {errors.duenoCodigoPostal && (
              <p className="mt-1 text-xs text-red-500">
                {errors.duenoCodigoPostal}
              </p>
            )}
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
          onClick={handleNext}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
