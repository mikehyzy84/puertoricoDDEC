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
import Localizacion from "@/components/wizards/permiso/Localizacion";
import CatastrosAdicionales from "@/components/wizards/permiso/CatastrosAdicionales";
import DuenoSolar from "@/components/wizards/permiso/DuenoSolar";
import Arrendatario from "@/components/wizards/permiso/Arrendatario";
import Documentos from "@/components/wizards/permiso/Documentos";
import Finish from "@/components/wizards/permiso/Finish";

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

  // Step 3 – Localización (search inputs)
  numeroCatastroSearch: string;
  latitud: string;
  longitud: string;
  lambertX: string;
  lambertY: string;

  // Step 3 – Localización (catastro detail read-only results)
  numeroCatastro: string;
  catastroExt: string;
  zonaInundable: string;
  floodway: string;
  areaAproximada: string;
  calificacion: string;
  municipioCatastro: string;
  calificacionSobrepuesto: string;
  barrio: string;
  clasificacion: string;
  zonaSitioHistorico: string;
  coordenadas: string;
  usosPermiso: string;
  coordenadasNad83: string;
  sueloGeologico: string;
  calificacionesEfectivas: string;

  // Step 4 – Catastros Adicionales
  cabidaPropiedad: string;
  cabidaUnidad: string;
  municipioAdicional: string;
  direccionFisica: string;
  tipoDireccion: string;
  codigoPostal: string;
  estado: string;
  puntoReferencia: string;

  // Step 6 – Arrendatario
  tieneArrendatario: string;

  // Step 5 – Dueño del Solar
  duenoNombre: string;
  duenoInicial: string;
  duenoApellido: string;
  duenoTelefono: string;
  duenoEmail: string;
  duenoDireccionLinea1: string;
  duenoDireccionLinea2: string;
  duenoPais: string;
  duenoEstado: string;
  duenoCiudad: string;
  duenoCodigoPostal: string;
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

  numeroCatastroSearch: "",
  latitud: "",
  longitud: "",
  lambertX: "",
  lambertY: "",

  numeroCatastro: "",
  catastroExt: "",
  zonaInundable: "",
  floodway: "",
  areaAproximada: "",
  calificacion: "",
  municipioCatastro: "",
  calificacionSobrepuesto: "",
  barrio: "",
  clasificacion: "",
  zonaSitioHistorico: "",
  coordenadas: "",
  usosPermiso: "",
  coordenadasNad83: "",
  sueloGeologico: "",
  calificacionesEfectivas: "",

  cabidaPropiedad: "",
  cabidaUnidad: "",
  municipioAdicional: "",
  direccionFisica: "",
  tipoDireccion: "urbana",
  codigoPostal: "",
  estado: "Puerto Rico",
  puntoReferencia: "",

  tieneArrendatario: "no",

  duenoNombre: "",
  duenoInicial: "",
  duenoApellido: "",
  duenoTelefono: "",
  duenoEmail: "",
  duenoDireccionLinea1: "",
  duenoDireccionLinea2: "",
  duenoPais: "US",
  duenoEstado: "",
  duenoCiudad: "",
  duenoCodigoPostal: "",
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

          {currentStep === 2 && (
            <Localizacion
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={() => window.history.back()}
            />
          )}

          {currentStep === 3 && (
            <CatastrosAdicionales
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={() => window.history.back()}
            />
          )}

          {currentStep === 4 && (
            <DuenoSolar
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={() => window.history.back()}
            />
          )}

          {currentStep === 6 && (
            <Documentos
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 7 && (
            <Finish onPrevious={handlePrevious} />
          )}

          {currentStep === 5 && (
            <Arrendatario
              formData={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onCancel={() => window.history.back()}
            />
          )}
        </div>
      </div>
    </main>
  );
}
