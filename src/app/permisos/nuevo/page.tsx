"use client";

import { useState } from "react";
import Stepper, { type StepDefinition } from "@/components/wizards/Stepper";
import {
  ClipboardList,
  User,
  MapPin,
  Map,
  Users,
  UserCheck,
  FileText,
  CheckCircle,
} from "lucide-react";
import ProyectoActividad from "@/components/wizards/permiso/ProyectoActividad";
import DuenoProyecto from "@/components/wizards/permiso/DuenoProyecto";

const PERMISO_STEPS: StepDefinition[] = [
  { label: "Proyecto o Actividad", icon: ClipboardList },
  { label: "Dueño del Proyecto", icon: User },
  { label: "Localización", icon: MapPin },
  { label: "Catastros Adicionales", icon: Map },
  { label: "Dueño del Solar", icon: Users },
  { label: "Arrendatario", icon: UserCheck },
  { label: "Documentos", icon: FileText },
  { label: "Finalizar", icon: CheckCircle },
];

export interface PermisoFormData {
  // Step 1 – Proyecto o Actividad
  nombre: string;
  tipoZona: string;
  tipoProyecto: string;
  fondosFederales: string;
  designacion: string;
  descripcion: string;

  // Step 2 – Dueño del Proyecto
  tipoDueno: "usted" | "otra_persona" | "compania";
  // otra_persona fields
  ciudadania: string;
  tipoIdentificacion: string;
  busquedaPersona: string;
  // compania fields
  companiaSeleccionada: string;
  tieneDecreto: string;
}

const INITIAL_FORM_DATA: PermisoFormData = {
  nombre: "",
  tipoZona: "",
  tipoProyecto: "",
  fondosFederales: "no_aplica",
  designacion: "no_aplica",
  descripcion: "",

  tipoDueno: "usted",
  ciudadania: "",
  tipoIdentificacion: "ssn",
  busquedaPersona: "",
  companiaSeleccionada: "",
  tieneDecreto: "no",
};

export default function NuevoPermisoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PermisoFormData>(INITIAL_FORM_DATA);

  function updateField<K extends keyof PermisoFormData>(
    field: K,
    value: PermisoFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (currentStep < PERMISO_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <h1 className="mb-2 text-2xl font-bold text-[#1B4332]">
          Radicar Permiso
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Complete los pasos a continuación para crear un nuevo proyecto y radicar su permiso.
        </p>

        {/* Stepper */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <Stepper steps={PERMISO_STEPS} currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="mt-6">
          {currentStep === 0 && (
            <ProyectoActividad
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onCancel={() => window.history.back()}
            />
          )}

          {currentStep === 1 && (
            <DuenoProyecto
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={() => window.history.back()}
            />
          )}

          {currentStep > 1 && (
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <p className="text-center text-gray-400">
                Paso {currentStep + 1} — {PERMISO_STEPS[currentStep].label} — próximamente
              </p>

              {/* Placeholder navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#245a42] transition-colors"
                >
                  Paso Anterior
                </button>
                {currentStep < PERMISO_STEPS.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#238577] transition-colors"
                  >
                    Siguiente Paso
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
