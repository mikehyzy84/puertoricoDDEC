"use client";

import { UserCheck } from "lucide-react";
import type { PermisoFormData } from "@/app/permisos/nuevo/page";

interface ArrendatarioProps {
  formData: PermisoFormData;
  updateField: <K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
}

export default function Arrendatario({
  formData,
  updateField,
  onNext,
  onPrevious,
  onCancel,
}: ArrendatarioProps) {
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
        <UserCheck className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">Arrendatario</h2>
      </div>

      {/* Instruction lines */}
      <div className="mb-8 space-y-2 rounded-md bg-gray-50 p-4">
        <p className="text-sm font-bold text-gray-700">
          Si usted está gestionando un trámite para otra persona, debe contestar Sí
        </p>
        <p className="text-sm font-bold text-gray-700">
          Si usted está arrendando/alquilando un local o el solar, debe contestar Sí
        </p>
        <p className="text-sm font-bold text-gray-700">
          Si es el Dueño del Proyecto del Local, marque No
        </p>
      </div>

      {/* Question with radio buttons */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700">
          ¿Su proyecto tiene Arrendatario?
        </legend>
        <div className="mt-3 flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="tieneArrendatario"
              value="si"
              checked={formData.tieneArrendatario === "si"}
              onChange={() => updateField("tieneArrendatario", "si")}
              className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
            />
            <span className="text-gray-700">Sí</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="tieneArrendatario"
              value="no"
              checked={formData.tieneArrendatario === "no"}
              onChange={() => updateField("tieneArrendatario", "no")}
              className="h-4 w-4 border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </fieldset>

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
