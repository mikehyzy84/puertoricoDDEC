"use client";

import { FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SolicitudFormData } from "@/app/solicitudes/[tipo]/page";

interface InformacionGeneralProps {
  formData: SolicitudFormData;
  updateField: <K extends keyof SolicitudFormData>(
    field: K,
    value: SolicitudFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

const PROFESIONES = [
  { value: "arquitecto", label: "Arquitecto/a" },
  { value: "ingeniero", label: "Ingeniero/a" },
] as const;

export default function InformacionGeneral({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: InformacionGeneralProps) {
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
        <FileText className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Información General
        </h2>
      </div>

      {/* Info banner */}
      <div className="mb-8 flex gap-3 rounded-md border border-[#2A9D8F]/30 bg-[#2A9D8F]/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2A9D8F]" />
        <p className="text-sm leading-relaxed text-[#1B4332]">
          La aprobación automática de un <strong>Permiso de Uso Único Automático</strong>{" "}
          le permite al profesional autorizado emitir permisos de uso para
          proyectos que cumplan con los requisitos establecidos por la
          Gerencia de Permisos, agilizando el proceso de radicación.
        </p>
      </div>

      {/* Información Profesional section */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#1B4332]">
        Información Profesional
      </h3>

      <div className="space-y-6">
        {/* Row: Licencia / Profesión */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="licencia" className="text-gray-700">
              Licencia
            </Label>
            <Input
              id="licencia"
              value={formData.licencia}
              onChange={(e) => updateField("licencia", e.target.value)}
              placeholder="Número de licencia"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="profesion" className="text-gray-700">
              Profesión
            </Label>
            <select
              id="profesion"
              value={formData.profesion}
              onChange={(e) => updateField("profesion", e.target.value)}
              className={cn(
                "mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                !formData.profesion && "text-muted-foreground"
              )}
            >
              <option value="" disabled>
                Seleccione una profesión
              </option>
              {PROFESIONES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row: Expedición / Expiración de colegiación */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="expedicionColegiacion" className="text-gray-700">
              Expedición de la colegiación
            </Label>
            <Input
              id="expedicionColegiacion"
              type="date"
              value={formData.expedicionColegiacion}
              onChange={(e) =>
                updateField("expedicionColegiacion", e.target.value)
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="expiracionColegiacion" className="text-gray-700">
              Expiración de la colegiación
            </Label>
            <Input
              id="expiracionColegiacion"
              type="date"
              value={formData.expiracionColegiacion}
              onChange={(e) =>
                updateField("expiracionColegiacion", e.target.value)
              }
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Row: Expedición / Expiración de licencia */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="expedicionLicencia" className="text-gray-700">
              Expedición de la licencia
            </Label>
            <Input
              id="expedicionLicencia"
              type="date"
              value={formData.expedicionLicencia}
              onChange={(e) =>
                updateField("expedicionLicencia", e.target.value)
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="expiracionLicencia" className="text-gray-700">
              Expiración de la licencia
            </Label>
            <Input
              id="expiracionLicencia"
              type="date"
              value={formData.expiracionLicencia}
              onChange={(e) =>
                updateField("expiracionLicencia", e.target.value)
              }
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Email note */}
        <p className="text-xs text-gray-500">
          Nota: Utilice su correo electrónico personal para recibir
          notificaciones relacionadas a este trámite.
        </p>

        {/* Certification checkbox */}
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.certificoInformacion}
            onChange={(e) =>
              updateField("certificoInformacion", e.target.checked)
            }
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
          />
          <span className="text-sm text-gray-700">
            Certifico que la información ingresada es correcta.
          </span>
        </label>
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
