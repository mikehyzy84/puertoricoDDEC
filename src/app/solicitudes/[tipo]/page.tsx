"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Stepper, { type StepDefinition } from "@/components/wizards/Stepper";
import {
  MapPin,
  FileText,
  Paperclip,
  ClipboardList,
  Send,
} from "lucide-react";
import Municipio from "@/components/wizards/solicitud/Municipio";
import InformacionGeneral from "@/components/wizards/solicitud/InformacionGeneral";

/* ------------------------------------------------------------------ */
/*  Step definitions per solicitud type                                */
/* ------------------------------------------------------------------ */

const APA_STEPS: StepDefinition[] = [
  { label: "Municipio", icon: MapPin },
  { label: "Información General", icon: FileText },
  { label: "Anejos", icon: Paperclip },
  { label: "Resumen", icon: ClipboardList },
  { label: "Someter", icon: Send },
];

const TIPO_LABELS: Record<string, string> = {
  apa: "APA — Autorización para emitir un Permiso Automático",
  aps: "APS — Aprobación de Planos Seguros",
  asp: "ASP — Aprobación de Sistema o Producto",
  cer: "CER — Certificación de Equipos de Energía Renovable",
  cir: "CIR — Certificado Instalador Renovable",
};

/* ------------------------------------------------------------------ */
/*  Form data                                                          */
/* ------------------------------------------------------------------ */

export interface SolicitudFormData {
  // Step 1 – Municipio
  municipio: string;

  // Step 2 – Información General (APA)
  licencia: string;
  profesion: string;
  expedicionColegiacion: string;
  expiracionColegiacion: string;
  expedicionLicencia: string;
  expiracionLicencia: string;
  certificoInformacion: boolean;
}

const INITIAL_FORM_DATA: SolicitudFormData = {
  municipio: "",

  licencia: "",
  profesion: "",
  expedicionColegiacion: "",
  expiracionColegiacion: "",
  expedicionLicencia: "",
  expiracionLicencia: "",
  certificoInformacion: false,
};

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function SolicitudTipoPage() {
  const params = useParams<{ tipo: string }>();
  const router = useRouter();
  const tipo = params.tipo;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<SolicitudFormData>(INITIAL_FORM_DATA);

  const steps = APA_STEPS; // All types share the same 5-step layout for now
  const title = TIPO_LABELS[tipo] ?? `Solicitud — ${tipo.toUpperCase()}`;

  function updateField<K extends keyof SolicitudFormData>(
    field: K,
    value: SolicitudFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleCancel() {
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <h1 className="mb-2 text-2xl font-bold text-[#1B4332]">
          Radicar Solicitud
        </h1>
        <p className="mb-6 text-sm text-gray-500">{title}</p>

        {/* Stepper */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step content */}
        <div className="mt-6">
          {currentStep === 0 && (
            <Municipio
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onCancel={handleCancel}
            />
          )}

          {currentStep === 1 && (
            <InformacionGeneral
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={handleCancel}
            />
          )}

          {currentStep > 1 && (
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <p className="text-center text-gray-400">
                Paso {currentStep + 1} — {steps[currentStep].label} —
                próximamente
              </p>

              {/* Placeholder navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a42]"
                >
                  Paso Anterior
                </button>
                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
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
