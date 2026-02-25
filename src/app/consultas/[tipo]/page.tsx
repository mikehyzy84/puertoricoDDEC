"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

/* ───────────────────────── Consulta type metadata ───────────────────────── */

const CONSULTA_TYPES: Record<string, { nombre: string; desc: string }> = {
  discrecionales: { nombre: "Consultas Discrecionales", desc: "Incluye CCO, CUB y LOT" },
  pca: { nombre: "Pre-Consulta Arqueología Conservación Histórica", desc: "PCA" },
  pcd: { nombre: "Pre-Consulta Departamento de Evaluación de Cumplimiento Ambiental", desc: "PCD" },
  pce: { nombre: "Pre-Consulta – Edificabilidad", desc: "PCE" },
  pci: { nombre: "Pre-Consulta Infraestructura", desc: "PCI" },
};

/* ───────────────────────── Step definitions ───────────────────────── */

const STEPS = [
  { label: "Tipo de\nTrámite", icon: "info" as const },
  { label: "Selección de\nProyecto", icon: "building" as const },
  { label: "Información\nGeneral", icon: "form" as const },
  { label: "Documentos", icon: "doc" as const },
  { label: "Resumen", icon: "list" as const },
  { label: "Someter", icon: "send" as const },
];

type IconType = (typeof STEPS)[number]["icon"];

/* ───────────────────────── Shared styles ───────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "3px",
  padding: "8px 10px",
  fontSize: "13px",
  fontFamily: "Arial",
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Arial",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

/* ───────────────────────── Form data types ───────────────────────── */

interface ConsultaFormData {
  tipoTramite: {
    tipo: string;
    subTipo: string; // For discrecionales: CCO | CUB | LOT
  };
  proyecto: {
    proyectoId: string;
  };
  informacionGeneral: Record<string, string>;
  documentos: {
    planoSituacion: string;
    memorialDescriptivo: string;
    otros: string[];
  };
  resumen: Record<string, never>;
  someter: {
    certificado: boolean;
  };
}

const initialFormData: ConsultaFormData = {
  tipoTramite: { tipo: "", subTipo: "" },
  proyecto: { proyectoId: "" },
  informacionGeneral: {},
  documentos: { planoSituacion: "", memorialDescriptivo: "", otros: [] },
  resumen: {},
  someter: { certificado: false },
};

/* ───────────────────────── localStorage helper (useWizard-compatible) ───────────────────────── */

function useConsultaWizard(tipo: string) {
  const storageKey = `consulta-${tipo}-wizard-draft`;
  const totalSteps = 6;

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ConsultaFormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try { return JSON.parse(saved) as ConsultaFormData; } catch { /* ignore */ }
      }
    }
    return { ...initialFormData, tipoTramite: { tipo, subTipo: "" } };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey]);

  const updateField = useCallback((section: keyof ConsultaFormData, field: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, unknown>), [field]: value },
    }));
  }, []);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      setErrors({});
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setErrors({});
    }
  }, [currentStep]);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearErrors = useCallback(() => { setErrors({}); }, []);

  const clearStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData({ ...initialFormData, tipoTramite: { tipo, subTipo: "" } });
    setErrors({});
    clearStorage();
  }, [tipo, clearStorage]);

  return {
    currentStep,
    data,
    errors,
    totalSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    updateField,
    goNext,
    goPrev,
    goToStep: (s: number) => { if (s >= 0 && s < totalSteps) { setCurrentStep(s); setErrors({}); } },
    setFieldError,
    clearErrors,
    clearStorage,
    reset,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ConsultaWizardPage() {
  const params = useParams();
  const router = useRouter();
  const tipo = (params.tipo as string) || "";
  const meta = CONSULTA_TYPES[tipo];

  const wizard = useConsultaWizard(tipo);

  if (!meta) {
    return (
      <div style={{ fontFamily: "Arial, Helvetica, sans-serif", padding: "60px", textAlign: "center" }}>
        <h2 style={{ fontSize: "18px", color: "#333", marginBottom: "12px" }}>Tipo de consulta no encontrado</h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
          El tipo &quot;{tipo}&quot; no es un tipo de consulta válido.
        </p>
        <button
          onClick={() => router.push("/")}
          style={{ ...btnStyle, backgroundColor: "#2b8a7a", display: "inline-flex" }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" />
          </svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            {meta.nombre} — {meta.desc}
          </span>
        </div>
      </div>

      {/* ── Stepper ── */}
      <CStepper currentStep={wizard.currentStep} />

      {/* ── Step content ── */}
      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff", padding: "20px 24px" }}>
        {wizard.currentStep === 0 && (
          <StepTipoTramite tipo={tipo} meta={meta} data={wizard.data} updateField={wizard.updateField} errors={wizard.errors} />
        )}
        {wizard.currentStep === 1 && (
          <StepSeleccionProyecto data={wizard.data} updateField={wizard.updateField} errors={wizard.errors} />
        )}
        {wizard.currentStep === 2 && (
          <StepInformacionGeneral tipo={tipo} data={wizard.data} updateField={wizard.updateField} errors={wizard.errors} />
        )}
        {wizard.currentStep === 3 && (
          <StepDocumentos />
        )}
        {wizard.currentStep === 4 && (
          <StepResumen tipo={tipo} meta={meta} data={wizard.data} />
        )}
        {wizard.currentStep === 5 && (
          <StepSometer data={wizard.data} updateField={wizard.updateField} clearStorage={wizard.clearStorage} />
        )}
      </div>

      {/* ── Button bar ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0", flexWrap: "wrap" }}>
        {!wizard.isFirstStep && (
          <button onClick={wizard.goPrev} style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
            <LeftArrow /> Paso Anterior
          </button>
        )}
        <button style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
          <SaveIcon /> Guardar
        </button>
        <button onClick={wizard.goNext} style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
          <SaveIcon /> Guardar y Continuar
        </button>
        <button onClick={() => { wizard.reset(); router.push("/"); }} style={{ ...btnStyle, backgroundColor: "#c53030" }}>
          <XIcon /> Cancelar
        </button>
        {!wizard.isLastStep && (
          <button onClick={wizard.goNext} style={{ ...btnStyle, backgroundColor: "#718096" }}>
            Siguiente Paso <RightArrow />
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1 — Tipo de Trámite
   ═══════════════════════════════════════════════════════════════════════════ */

function StepTipoTramite({
  tipo,
  meta,
  data,
  updateField,
  errors,
}: {
  tipo: string;
  meta: { nombre: string; desc: string };
  data: ConsultaFormData;
  updateField: (section: keyof ConsultaFormData, field: string, value: unknown) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <SectionHeader icon="info" title="Tipo de Trámite" />

      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#0c5460", lineHeight: 1.6 }}>
        <strong>Tipo seleccionado:</strong> {meta.nombre}
        {meta.desc !== meta.nombre && <span style={{ marginLeft: "6px" }}>({meta.desc})</span>}
      </div>

      {tipo === "discrecionales" ? (
        <>
          <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>
            Seleccione el sub-tipo de consulta discrecional:<span style={{ color: "red" }}>*</span>
          </div>
          {[
            { value: "CCO", label: "CCO — Consulta de Construcción" },
            { value: "CUB", label: "CUB — Consulta de Ubicación" },
            { value: "LOT", label: "LOT — Variación a Lotificación" },
          ].map((opt) => (
            <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                name="subTipoDiscrecional"
                value={opt.value}
                checked={data.tipoTramite.subTipo === opt.value}
                onChange={() => updateField("tipoTramite", "subTipo", opt.value)}
                style={{ accentColor: "#2b8a7a" }}
              />
              {opt.label}
            </label>
          ))}
          {errors.subTipo && <ErrorMsg message={errors.subTipo} />}
        </>
      ) : (
        <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.7 }}>
          <p style={{ marginBottom: "8px" }}>
            Ha seleccionado: <strong>{meta.nombre}</strong>
          </p>
          <p style={{ color: "#666" }}>
            Presione <strong>Siguiente Paso</strong> para continuar con la selección de proyecto.
          </p>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 2 — Selección de Proyecto
   ═══════════════════════════════════════════════════════════════════════════ */

function StepSeleccionProyecto({
  data,
  updateField,
  errors,
}: {
  data: ConsultaFormData;
  updateField: (section: keyof ConsultaFormData, field: string, value: unknown) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <SectionHeader icon="building" title="Selección de Proyecto" />

      <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#856404", lineHeight: 1.6 }}>
        <strong>Aviso:</strong> Debe seleccionar un proyecto existente o crear uno nuevo para continuar con la consulta.
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}>
        <FormField label="Proyecto:" required style={{ flex: 1 }}>
          <select
            style={inputStyle}
            value={data.proyecto.proyectoId}
            onChange={(e) => updateField("proyecto", "proyectoId", e.target.value)}
          >
            <option value="">Seleccione un proyecto...</option>
          </select>
        </FormField>
        <button
          style={{
            backgroundColor: "#38a169",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Arial",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "12px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Crear Proyecto
        </button>
      </div>

      {errors.proyectoId && <ErrorMsg message={errors.proyectoId} />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 3 — Información General (varies per consulta type)
   ═══════════════════════════════════════════════════════════════════════════ */

function StepInformacionGeneral({
  tipo,
  data,
  updateField,
  errors,
}: {
  tipo: string;
  data: ConsultaFormData;
  updateField: (section: keyof ConsultaFormData, field: string, value: unknown) => void;
  errors: Record<string, string>;
}) {
  const ig = data.informacionGeneral;
  const set = (field: string, value: string) => updateField("informacionGeneral", field, value);

  return (
    <>
      <SectionHeader icon="form" title="Información General" />

      {tipo === "pca" && <InfoGeneralPCA ig={ig} set={set} errors={errors} />}
      {tipo === "pcd" && <InfoGeneralPCD ig={ig} set={set} errors={errors} />}
      {tipo === "pce" && <InfoGeneralPCE ig={ig} set={set} errors={errors} />}
      {tipo === "pci" && <InfoGeneralPCI ig={ig} set={set} errors={errors} />}
      {tipo === "discrecionales" && <InfoGeneralDiscrecionales ig={ig} set={set} errors={errors} subTipo={data.tipoTramite.subTipo} />}
    </>
  );
}

/* ── PCA — Arqueología ── */
function InfoGeneralPCA({
  ig,
  set,
  errors,
}: {
  ig: Record<string, string>;
  set: (field: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Complete la información requerida para la Pre-Consulta de Arqueología y Conservación Histórica (PCA).
      </div>

      <FormField label="Descripción del área:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.descripcionArea || ""}
          onChange={(e) => set("descripcionArea", e.target.value)}
          placeholder="Describa el área objeto de la consulta arqueológica..."
        />
        {errors.descripcionArea && <ErrorMsg message={errors.descripcionArea} />}
      </FormField>

      <FormField label="Período histórico estimado:" required>
        <input
          type="text"
          style={inputStyle}
          value={ig.periodoHistorico || ""}
          onChange={(e) => set("periodoHistorico", e.target.value)}
          placeholder="Ej. Pre-colombino, Colonial, Siglo XIX..."
        />
        {errors.periodoHistorico && <ErrorMsg message={errors.periodoHistorico} />}
      </FormField>

      <FormField label="Tipo de recurso arqueológico:" required>
        <select
          style={inputStyle}
          value={ig.tipoRecurso || ""}
          onChange={(e) => set("tipoRecurso", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="sitio_arqueologico">Sitio arqueológico</option>
          <option value="estructura_historica">Estructura histórica</option>
          <option value="zona_historica">Zona histórica</option>
          <option value="artefactos">Artefactos</option>
          <option value="cementerio">Cementerio / Enterramiento</option>
          <option value="otro">Otro</option>
        </select>
        {errors.tipoRecurso && <ErrorMsg message={errors.tipoRecurso} />}
      </FormField>
    </>
  );
}

/* ── PCD — Ambiental ── */
function InfoGeneralPCD({
  ig,
  set,
  errors,
}: {
  ig: Record<string, string>;
  set: (field: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Complete la información requerida para la Pre-Consulta del Departamento de Evaluación de Cumplimiento Ambiental (PCD).
      </div>

      <FormField label="Descripción del proyecto:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.descripcionProyecto || ""}
          onChange={(e) => set("descripcionProyecto", e.target.value)}
          placeholder="Describa el proyecto y su alcance..."
        />
        {errors.descripcionProyecto && <ErrorMsg message={errors.descripcionProyecto} />}
      </FormField>

      <FormField label="Tipo de evaluación ambiental:" required>
        <select
          style={inputStyle}
          value={ig.tipoEvaluacion || ""}
          onChange={(e) => set("tipoEvaluacion", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="evaluacion_preliminar">Evaluación Preliminar</option>
          <option value="documento_ambiental">Documento Ambiental (DA)</option>
          <option value="declaracion_impacto">Declaración de Impacto Ambiental (DIA)</option>
          <option value="exclusion_categorica">Exclusión Categórica (EC)</option>
          <option value="consulta_general">Consulta General</option>
        </select>
        {errors.tipoEvaluacion && <ErrorMsg message={errors.tipoEvaluacion} />}
      </FormField>

      <FormField label="Impacto ambiental potencial:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.impactoAmbiental || ""}
          onChange={(e) => set("impactoAmbiental", e.target.value)}
          placeholder="Describa los posibles impactos ambientales del proyecto..."
        />
        {errors.impactoAmbiental && <ErrorMsg message={errors.impactoAmbiental} />}
      </FormField>
    </>
  );
}

/* ── PCE — Edificabilidad ── */
function InfoGeneralPCE({
  ig,
  set,
  errors,
}: {
  ig: Record<string, string>;
  set: (field: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Complete la información requerida para la Pre-Consulta de Edificabilidad (PCE).
      </div>

      <FormField label="Descripción del terreno:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.descripcionTerreno || ""}
          onChange={(e) => set("descripcionTerreno", e.target.value)}
          placeholder="Describa las características del terreno..."
        />
        {errors.descripcionTerreno && <ErrorMsg message={errors.descripcionTerreno} />}
      </FormField>

      <div style={{ display: "flex", gap: "20px", marginBottom: "4px" }}>
        <FormField label="Uso propuesto:" required style={{ flex: 1 }}>
          <select
            style={inputStyle}
            value={ig.usoPropuesto || ""}
            onChange={(e) => set("usoPropuesto", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="industrial">Industrial</option>
            <option value="mixto">Uso Mixto</option>
            <option value="institucional">Institucional</option>
            <option value="recreativo">Recreativo</option>
            <option value="agricola">Agrícola</option>
            <option value="otro">Otro</option>
          </select>
          {errors.usoPropuesto && <ErrorMsg message={errors.usoPropuesto} />}
        </FormField>

        <FormField label="Área del solar (m²):" required style={{ flex: 1 }}>
          <input
            type="text"
            style={inputStyle}
            value={ig.areaSolar || ""}
            onChange={(e) => set("areaSolar", e.target.value)}
            placeholder="Ej. 500"
          />
          {errors.areaSolar && <ErrorMsg message={errors.areaSolar} />}
        </FormField>
      </div>

      <FormField label="Altura propuesta (pisos / metros):" required>
        <input
          type="text"
          style={inputStyle}
          value={ig.alturaPropuesta || ""}
          onChange={(e) => set("alturaPropuesta", e.target.value)}
          placeholder="Ej. 3 pisos / 12 metros"
        />
        {errors.alturaPropuesta && <ErrorMsg message={errors.alturaPropuesta} />}
      </FormField>
    </>
  );
}

/* ── PCI — Infraestructura ── */
function InfoGeneralPCI({
  ig,
  set,
  errors,
}: {
  ig: Record<string, string>;
  set: (field: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <>
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Complete la información requerida para la Pre-Consulta de Infraestructura (PCI).
      </div>

      <FormField label="Tipo de infraestructura:" required>
        <select
          style={inputStyle}
          value={ig.tipoInfraestructura || ""}
          onChange={(e) => set("tipoInfraestructura", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="acueducto">Acueducto / Agua potable</option>
          <option value="alcantarillado">Alcantarillado sanitario</option>
          <option value="pluvial">Sistema pluvial</option>
          <option value="electrica">Infraestructura eléctrica</option>
          <option value="telecomunicaciones">Telecomunicaciones</option>
          <option value="vial">Infraestructura vial</option>
          <option value="gas">Gas natural</option>
          <option value="otro">Otro</option>
        </select>
        {errors.tipoInfraestructura && <ErrorMsg message={errors.tipoInfraestructura} />}
      </FormField>

      <FormField label="Descripción:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.descripcion || ""}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Describa la infraestructura requerida y su propósito..."
        />
        {errors.descripcion && <ErrorMsg message={errors.descripcion} />}
      </FormField>

      <FormField label="Capacidad requerida:" required>
        <input
          type="text"
          style={inputStyle}
          value={ig.capacidadRequerida || ""}
          onChange={(e) => set("capacidadRequerida", e.target.value)}
          placeholder="Ej. 500 GPM, 2000 KW, etc."
        />
        {errors.capacidadRequerida && <ErrorMsg message={errors.capacidadRequerida} />}
      </FormField>
    </>
  );
}

/* ── Discrecionales (CCO / CUB / LOT) ── */
function InfoGeneralDiscrecionales({
  ig,
  set,
  errors,
  subTipo,
}: {
  ig: Record<string, string>;
  set: (field: string, value: string) => void;
  errors: Record<string, string>;
  subTipo: string;
}) {
  const subTipoLabel = subTipo === "CCO"
    ? "Consulta de Construcción (CCO)"
    : subTipo === "CUB"
      ? "Consulta de Ubicación (CUB)"
      : subTipo === "LOT"
        ? "Variación a Lotificación (LOT)"
        : "No seleccionado";

  return (
    <>
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Consulta Discrecional — <strong>{subTipoLabel}</strong>
      </div>

      <FormField label="Tipo de consulta:" required>
        <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
          {[
            { value: "CCO", label: "CCO — Consulta de Construcción" },
            { value: "CUB", label: "CUB — Consulta de Ubicación" },
            { value: "LOT", label: "LOT — Variación a Lotificación" },
          ].map((opt) => (
            <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
              <input
                type="radio"
                name="tipoConsultaDisc"
                value={opt.value}
                checked={(ig.tipoConsulta || subTipo) === opt.value}
                onChange={() => set("tipoConsulta", opt.value)}
                style={{ accentColor: "#2b8a7a" }}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.tipoConsulta && <ErrorMsg message={errors.tipoConsulta} />}
      </FormField>

      <FormField label="Descripción:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.descripcion || ""}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Describa el propósito de la consulta discrecional..."
        />
        {errors.descripcion && <ErrorMsg message={errors.descripcion} />}
      </FormField>

      <FormField label="Justificación:" required>
        <textarea
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          value={ig.justificacion || ""}
          onChange={(e) => set("justificacion", e.target.value)}
          placeholder="Justifique la necesidad de la consulta discrecional..."
        />
        {errors.justificacion && <ErrorMsg message={errors.justificacion} />}
      </FormField>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 4 — Documentos
   ═══════════════════════════════════════════════════════════════════════════ */

function StepDocumentos() {
  return (
    <>
      <SectionHeader icon="doc" title="Documentos" />

      <div style={{ backgroundColor: "#f0f4f2", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#555", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        </svg>
        Puede añadir uno o más documentos mediante el botón de Acciones
      </div>

      {/* Required documents table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Nombre", "Descripción", "Documento", "Requerido", "Acción"].map((h) => (
              <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "10px 12px", fontSize: "13px" }}>Plano de Situación</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>Plano que muestre la ubicación y contexto del proyecto dentro del solar y entorno inmediato.</td>
            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#999" }}>Pendiente</td>
            <td style={{ padding: "10px 12px" }}><GreenDot /></td>
            <td style={{ padding: "10px 12px" }}><AccionesBtn /></td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
            <td style={{ padding: "10px 12px", fontSize: "13px" }}>Memorial Descriptivo</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>Documento narrativo que describe las características del proyecto, uso propuesto y detalles relevantes.</td>
            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#999" }}>Pendiente</td>
            <td style={{ padding: "10px 12px" }}><GreenDot /></td>
            <td style={{ padding: "10px 12px" }}><AccionesBtn /></td>
          </tr>
        </tbody>
      </table>

      {/* Other documents */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>Otros Documentos</span>
        </div>
        <button style={{
          backgroundColor: "#c53030", color: "#fff", border: "none", borderRadius: "4px",
          padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: "5px", fontFamily: "Arial",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar Otro Documento
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Descripción", "Documento", "Acción"].map((h) => (
              <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ padding: "30px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No se han agregado documentos adicionales.
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 5 — Resumen
   ═══════════════════════════════════════════════════════════════════════════ */

function StepResumen({
  tipo,
  meta,
  data,
}: {
  tipo: string;
  meta: { nombre: string; desc: string };
  data: ConsultaFormData;
}) {
  const ig = data.informacionGeneral;

  return (
    <>
      <SectionHeader icon="list" title="Resumen de la Consulta" />

      {/* Tipo de Trámite */}
      <ResumenSection title="Tipo de Trámite">
        <ResumenRow label="Tipo de consulta" value={meta.nombre} />
        {tipo === "discrecionales" && (
          <ResumenRow
            label="Sub-tipo"
            value={
              data.tipoTramite.subTipo === "CCO" ? "CCO — Consulta de Construcción"
                : data.tipoTramite.subTipo === "CUB" ? "CUB — Consulta de Ubicación"
                  : data.tipoTramite.subTipo === "LOT" ? "LOT — Variación a Lotificación"
                    : "No seleccionado"
            }
          />
        )}
      </ResumenSection>

      {/* Proyecto */}
      <ResumenSection title="Proyecto">
        <ResumenRow label="Proyecto seleccionado" value={data.proyecto.proyectoId || "No seleccionado"} />
      </ResumenSection>

      {/* Información General */}
      <ResumenSection title="Información General">
        {tipo === "pca" && (
          <>
            <ResumenRow label="Descripción del área" value={ig.descripcionArea || "—"} />
            <ResumenRow label="Período histórico estimado" value={ig.periodoHistorico || "—"} />
            <ResumenRow label="Tipo de recurso arqueológico" value={ig.tipoRecurso || "—"} />
          </>
        )}
        {tipo === "pcd" && (
          <>
            <ResumenRow label="Descripción del proyecto" value={ig.descripcionProyecto || "—"} />
            <ResumenRow label="Tipo de evaluación ambiental" value={ig.tipoEvaluacion || "—"} />
            <ResumenRow label="Impacto ambiental potencial" value={ig.impactoAmbiental || "—"} />
          </>
        )}
        {tipo === "pce" && (
          <>
            <ResumenRow label="Descripción del terreno" value={ig.descripcionTerreno || "—"} />
            <ResumenRow label="Uso propuesto" value={ig.usoPropuesto || "—"} />
            <ResumenRow label="Área del solar" value={ig.areaSolar ? `${ig.areaSolar} m²` : "—"} />
            <ResumenRow label="Altura propuesta" value={ig.alturaPropuesta || "—"} />
          </>
        )}
        {tipo === "pci" && (
          <>
            <ResumenRow label="Tipo de infraestructura" value={ig.tipoInfraestructura || "—"} />
            <ResumenRow label="Descripción" value={ig.descripcion || "—"} />
            <ResumenRow label="Capacidad requerida" value={ig.capacidadRequerida || "—"} />
          </>
        )}
        {tipo === "discrecionales" && (
          <>
            <ResumenRow label="Tipo de consulta" value={ig.tipoConsulta || data.tipoTramite.subTipo || "—"} />
            <ResumenRow label="Descripción" value={ig.descripcion || "—"} />
            <ResumenRow label="Justificación" value={ig.justificacion || "—"} />
          </>
        )}
      </ResumenSection>

      {/* Documentos */}
      <ResumenSection title="Documentos">
        <ResumenRow label="Plano de Situación" value={data.documentos.planoSituacion ? "Cargado" : "Pendiente"} />
        <ResumenRow label="Memorial Descriptivo" value={data.documentos.memorialDescriptivo ? "Cargado" : "Pendiente"} />
        <ResumenRow label="Otros documentos" value={data.documentos.otros.length > 0 ? `${data.documentos.otros.length} documento(s)` : "Ninguno"} />
      </ResumenSection>
    </>
  );
}

function ResumenSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ backgroundColor: "#1a3c34", color: "#fff", padding: "8px 14px", fontSize: "13px", fontWeight: 700, borderRadius: "3px 3px 0 0" }}>
        {title}
      </div>
      <div style={{ border: "1px solid #ddd", borderTop: "none", borderRadius: "0 0 3px 3px", padding: "12px 14px" }}>
        {children}
      </div>
    </div>
  );
}

function ResumenRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "8px", fontSize: "13px" }}>
      <span style={{ fontWeight: 700, color: "#333", minWidth: "220px" }}>{label}:</span>
      <span style={{ color: "#555" }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 6 — Someter
   ═══════════════════════════════════════════════════════════════════════════ */

function StepSometer({
  data,
  updateField,
  clearStorage,
}: {
  data: ConsultaFormData;
  updateField: (section: keyof ConsultaFormData, field: string, value: unknown) => void;
  clearStorage: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!data.someter.certificado) return;
    clearStorage();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#38a169", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#333", marginBottom: "12px" }}>
          Consulta sometida exitosamente
        </h3>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
          Su consulta ha sido radicada. Recibirá una notificación con el número de trámite asignado.
        </p>
      </div>
    );
  }

  return (
    <>
      <SectionHeader icon="send" title="Someter Consulta" />

      <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", padding: "16px", marginBottom: "20px", fontSize: "12px", color: "#856404", lineHeight: 1.7 }}>
        <strong>Aviso Legal:</strong> Al someter esta consulta, usted certifica que toda la información provista es correcta y verdadera
        según su mejor conocimiento. Cualquier información falsa o engañosa puede resultar en la denegación de la consulta
        y/o acciones legales conforme a las leyes aplicables del Estado Libre Asociado de Puerto Rico.
      </div>

      <div style={{ backgroundColor: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "16px", marginBottom: "20px", fontSize: "12px", color: "#555", lineHeight: 1.7 }}>
        <p style={{ marginBottom: "8px" }}>
          De conformidad con lo dispuesto en el Código de Permisos y la reglamentación vigente de la Oficina de Gerencia de Permisos (OGPe),
          el solicitante declara bajo juramento que:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={{ marginBottom: "4px" }}>Toda la información contenida en esta solicitud de consulta es verdadera, correcta y completa.</li>
          <li style={{ marginBottom: "4px" }}>Los documentos anejos son copias fieles de los originales.</li>
          <li style={{ marginBottom: "4px" }}>Autoriza a la OGPe a verificar la información provista con las agencias gubernamentales correspondientes.</li>
          <li>Entiende que la aprobación de esta consulta no constituye la aprobación de un permiso.</li>
        </ul>
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", cursor: "pointer", marginBottom: "24px" }}>
        <input
          type="checkbox"
          checked={data.someter.certificado}
          onChange={(e) => updateField("someter", "certificado", e.target.checked)}
          style={{ accentColor: "#2b8a7a", marginTop: "2px" }}
        />
        <span>
          <strong>Certifico</strong> que he leído y entiendo los términos anteriores, y que toda la información provista en esta
          consulta es verdadera y correcta según mi mejor conocimiento.<span style={{ color: "red" }}>*</span>
        </span>
      </label>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleSubmit}
          disabled={!data.someter.certificado}
          style={{
            ...btnStyle,
            backgroundColor: data.someter.certificado ? "#2b8a7a" : "#a0aec0",
            cursor: data.someter.certificado ? "pointer" : "not-allowed",
            padding: "10px 30px",
            fontSize: "14px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Someter Consulta
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Stepper ── */
function CStepper({ currentStep }: { currentStep: number }) {
  const iconMap: Record<IconType, React.ReactNode> = {
    info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>,
    form: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>,
    doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    list: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0" }}>
      {STEPS.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "90px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: i <= currentStep ? "#2b8a7a" : "#ccc",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {iconMap[s.icon]}
            </div>
            <div style={{
              fontSize: "10px", textAlign: "center", marginTop: "6px",
              fontWeight: i === currentStep ? 700 : 400,
              color: i <= currentStep ? "#333" : "#999",
              whiteSpace: "pre-line", lineHeight: 1.3,
            }}>
              {s.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: "40px", height: "2px",
              backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc",
              marginTop: "20px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title }: { icon: IconType; title: string }) {
  const iconMap: Record<IconType, React.ReactNode> = {
    info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>,
    form: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>,
    doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    list: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    send: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      {iconMap[icon]}
      <span style={{ fontSize: "15px", fontWeight: 700 }}>{title}</span>
    </div>
  );
}

/* ── FormField ── */
function FormField({
  label,
  required,
  children,
  style: extraStyle,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: "12px", ...extraStyle }}>
      {label && (
        <label style={{ display: "block", fontSize: "13px", fontWeight: 400, color: "#333", marginBottom: "4px" }}>
          {label}{required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

/* ── Error message ── */
function ErrorMsg({ message }: { message: string }) {
  return <span style={{ display: "block", fontSize: "11px", color: "red", marginTop: "3px" }}>{message}</span>;
}

/* ── Green dot (required indicator) ── */
function GreenDot() {
  return <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#38a169" }} />;
}

/* ── Acciones button ── */
function AccionesBtn() {
  return (
    <button style={{
      border: "1px solid #ccc", borderRadius: "3px", backgroundColor: "#fff",
      padding: "4px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Arial",
      display: "flex", alignItems: "center", gap: "4px",
    }}>
      Acciones
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

/* ── Icon buttons ── */
function LeftArrow() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>;
}
function RightArrow() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>;
}
function SaveIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8" /></svg>;
}
function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
}
