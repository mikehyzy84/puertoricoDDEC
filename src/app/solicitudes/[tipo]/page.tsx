"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizard } from "@/hooks/useWizard";
import { MUNICIPIOS } from "@/constants/municipios";
import { PROFESIONES } from "@/constants/profesiones";
import {
  solicitudMunicipioSchema,
  solicitudAPAInfoSchema,
  solicitudAPSInfoSchema,
  solicitudASPInfoSchema,
  solicitudCERInfoSchema,
  solicitudCIRInfoSchema,
} from "@/lib/validations/solicitud";
import type {
  SolicitudDocument,
  SolicitudWizardData,
} from "@/types/solicitud";

// ---------- Type configurations ----------

const SOLICITUD_TYPES: Record<string, { nombre: string; desc: string }> = {
  apa: { nombre: "Autorización para emitir un Permiso Automático", desc: "APA" },
  aps: { nombre: "Aprobación de Planos Seguros", desc: "APS" },
  asp: { nombre: "Aprobación de Sistema o Producto", desc: "ASP" },
  cer: { nombre: "Certificación de Equipos de Energía Renovable", desc: "CER" },
  cir: { nombre: "Certificado Instalador Renovable", desc: "CIR" },
};

// ---------- Document configurations per type ----------

const DOCUMENTS_BY_TYPE: Record<string, SolicitudDocument[]> = {
  apa: [
    { nombre: "Evidencia Colegiación", descripcion: "Evidencia de que se encuentra al día en sus cuotas (Copia de tarjeta de miembro activo).", archivo: "", requerido: true },
    { nombre: "Licencia", descripcion: "Licencia provista por el Departamento de Estado para ejercer la profesión.", archivo: "", requerido: true },
  ],
  aps: [
    { nombre: "Planos", descripcion: "Planos del proyecto según el tipo seleccionado.", archivo: "", requerido: true },
    { nombre: "Memorial descriptivo", descripcion: "Memorial descriptivo del proyecto con las especificaciones técnicas.", archivo: "", requerido: true },
  ],
  asp: [
    { nombre: "Certificación del fabricante", descripcion: "Certificación emitida por el fabricante del sistema o producto.", archivo: "", requerido: true },
    { nombre: "Especificaciones técnicas", descripcion: "Documento con las especificaciones técnicas del sistema o producto.", archivo: "", requerido: true },
  ],
  cer: [
    { nombre: "Certificación del equipo", descripcion: "Certificación del equipo de energía renovable emitida por un laboratorio acreditado.", archivo: "", requerido: true },
    { nombre: "Especificaciones técnicas", descripcion: "Especificaciones técnicas del equipo incluyendo capacidad y eficiencia.", archivo: "", requerido: true },
  ],
  cir: [
    { nombre: "Licencia profesional", descripcion: "Licencia profesional vigente para ejercer como instalador.", archivo: "", requerido: true },
    { nombre: "Certificaciones", descripcion: "Certificaciones profesionales relevantes al tipo de instalación.", archivo: "", requerido: true },
    { nombre: "Experiencia documentada", descripcion: "Documentación que evidencie los años de experiencia en instalaciones.", archivo: "", requerido: true },
  ],
};

// ---------- Default info general data per type ----------

function getInitialInfoGeneral(tipo: string): Record<string, unknown> {
  switch (tipo) {
    case "apa":
      return { licencia: "", profesion: "", expedicionColegiacion: "", expiracionColegiacion: "", expedicionLicencia: "", expiracionLicencia: "", certificacion: false };
    case "aps":
      return { descripcion: "", tipoPlano: "", notasAdicionales: "" };
    case "asp":
      return { nombreSistema: "", descripcion: "", fabricante: "", modelo: "", certificaciones: "" };
    case "cer":
      return { tipoEquipo: "", modelo: "", fabricante: "", capacidad: "" };
    case "cir":
      return { licencia: "", tipoInstalacion: "", experiencia: "", certificacionesProfesionales: "" };
    default:
      return {};
  }
}

// ---------- Steps ----------

const STEPS = [
  { label: "Municipio" },
  { label: "Información\nGeneral" },
  { label: "Anejos" },
  { label: "Resumen" },
  { label: "Someter" },
];

// ---------- Shared styles ----------

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #ccc", borderRadius: "3px",
  padding: "8px 10px", fontSize: "13px", fontFamily: "Arial",
  outline: "none", boxSizing: "border-box",
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "red",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "80px",
  resize: "vertical",
};

const textareaErrorStyle: React.CSSProperties = {
  ...textareaStyle,
  borderColor: "red",
};

const errorMsgStyle: React.CSSProperties = {
  color: "red", fontSize: "11px", marginTop: "2px",
};

// ---------- APS dropdown options ----------

const TIPOS_PLANO = [
  "Plano Estructural",
  "Plano Eléctrico",
  "Plano Mecánico",
  "Plano Plomería",
];

// ---------- CER dropdown options ----------

const TIPOS_EQUIPO = [
  "Solar Fotovoltaico",
  "Turbina Eólica",
  "Sistema de Baterías",
  "Otro",
];

// ---------- CIR dropdown options ----------

const TIPOS_INSTALACION = [
  "Solar",
  "Eólica",
  "Baterías",
  "Otro",
];

// =====================================================================
//  MAIN COMPONENT
// =====================================================================

export default function SolicitudWizard() {
  const params = useParams();
  const router = useRouter();
  const tipoRaw = (params.tipo as string || "").toLowerCase();
  const config = SOLICITUD_TYPES[tipoRaw];

  // Redirect if invalid type
  useEffect(() => {
    if (!config) {
      router.push("/solicitudes");
    }
  }, [config, router]);

  const storageKey = `solicitud-${tipoRaw}-wizard-draft`;

  const wizard = useWizard<SolicitudWizardData>({
    totalSteps: 5,
    initialData: {
      municipio: { municipio: "" },
      informacionGeneral: getInitialInfoGeneral(tipoRaw),
      documentos: DOCUMENTS_BY_TYPE[tipoRaw] || [],
      certificacionFinal: false,
      sometido: false,
    },
    storageKey,
    onComplete: () => {
      wizard.updateStepData("sometido" as keyof SolicitudWizardData, true as never);
    },
  });

  const [submitted, setSubmitted] = useState(false);

  if (!config) {
    return null;
  }

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "6px" }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
          {config.nombre} -
        </span>
      </div>

      {/* Stepper */}
      <SStepper currentStep={wizard.currentStep} />

      {/* Step content */}
      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff", padding: "20px 24px" }}>
        {wizard.currentStep === 0 && (
          <StepMunicipio
            data={wizard.data.municipio}
            onUpdate={(val) => wizard.setStepData("municipio", val)}
          />
        )}
        {wizard.currentStep === 1 && (
          <StepInfoGeneral
            tipo={tipoRaw}
            data={wizard.data.informacionGeneral}
            onUpdate={(val) => wizard.setStepData("informacionGeneral", val)}
          />
        )}
        {wizard.currentStep === 2 && (
          <StepAnejos
            tipo={tipoRaw}
          />
        )}
        {wizard.currentStep === 3 && (
          <StepResumen
            tipo={tipoRaw}
            config={config}
            data={wizard.data}
          />
        )}
        {wizard.currentStep === 4 && (
          <StepSometer
            submitted={submitted}
            onSubmit={() => {
              setSubmitted(true);
              wizard.clearStorage();
            }}
            config={config}
          />
        )}
      </div>

      {/* Navigation buttons */}
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0" }}>
          {wizard.currentStep > 0 && (
            <Btn color="#2D6A4F" onClick={() => wizard.goPrev()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Paso Anterior
            </Btn>
          )}
          <Btn color="#2b8a7a"><SvIcon /> Guardar</Btn>
          <Btn color="#2b8a7a" onClick={() => wizard.goNext()}>
            <SvIcon /> Guardar y Continuar
          </Btn>
          <Btn color="#c53030" onClick={() => { wizard.reset(); router.push("/solicitudes"); }}>
            <XIcon /> Cancelar
          </Btn>
          {wizard.currentStep < 4 && (
            <Btn color="#718096" onClick={() => wizard.goNext()}>
              Siguiente Paso
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================================
//  STEP 1: MUNICIPIO
// =====================================================================

function StepMunicipio({
  data,
  onUpdate,
}: {
  data: { municipio: string };
  onUpdate: (val: { municipio: string }) => void;
}) {
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(solicitudMunicipioSchema),
    defaultValues: data,
    mode: "onBlur",
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Seleccionar Municipio</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px" }}>En qué municipio se solicita el trámite:<span style={{ color: "red" }}>*</span></span>
        <select
          style={errors.municipio ? inputErrorStyle : { ...inputStyle, width: "200px" }}
          {...register("municipio")}
          onChange={(e) => {
            onUpdate({ municipio: e.target.value });
          }}
          value={data.municipio}
        >
          <option value="">-- Seleccionar --</option>
          {MUNICIPIOS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      {errors.municipio && (
        <span style={errorMsgStyle}>{errors.municipio.message}</span>
      )}
    </>
  );
}

// =====================================================================
//  STEP 2: INFORMACIÓN GENERAL (varies by type)
// =====================================================================

function StepInfoGeneral({
  tipo,
  data,
  onUpdate,
}: {
  tipo: string;
  data: Record<string, unknown>;
  onUpdate: (val: Record<string, unknown>) => void;
}) {
  switch (tipo) {
    case "apa": return <InfoAPA data={data} onUpdate={onUpdate} />;
    case "aps": return <InfoAPS data={data} onUpdate={onUpdate} />;
    case "asp": return <InfoASP data={data} onUpdate={onUpdate} />;
    case "cer": return <InfoCER data={data} onUpdate={onUpdate} />;
    case "cir": return <InfoCIR data={data} onUpdate={onUpdate} />;
    default: return null;
  }
}

// ----- APA Info -----

function InfoAPA({ data, onUpdate }: { data: Record<string, unknown>; onUpdate: (val: Record<string, unknown>) => void }) {
  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(solicitudAPAInfoSchema),
    defaultValues: {
      licencia: (data.licencia as string) || "",
      profesion: (data.profesion as string) || "",
      expedicionColegiacion: (data.expedicionColegiacion as string) || "",
      expiracionColegiacion: (data.expiracionColegiacion as string) || "",
      expedicionLicencia: (data.expedicionLicencia as string) || "",
      expiracionLicencia: (data.expiracionLicencia as string) || "",
      certificacion: (data.certificacion as boolean) || false,
    },
    mode: "onBlur",
  });

  // Sync form changes to wizard state
  const watchAll = watch();
  useEffect(() => {
    onUpdate(watchAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchAll)]);

  return (
    <>
      {/* Yellow warning box */}
      <div style={{
        backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px",
        padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#856404", lineHeight: 1.6,
      }}>
        <strong>Aviso:</strong> La aprobación del Permiso de Uso Único Automático y Permiso de Construcción Consolidado es automática una vez se haya validado la información de la licencia y colegiación. Después de haber sido validada usted podrá emitir Permiso de Uso Único Automático y Permiso de Construcción Consolidado sin tener que validar esta información para cada solicitud.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Información Profesional</span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Licencia:" required style={{ flex: 1 }}>
          <input type="text" style={errors.licencia ? inputErrorStyle : inputStyle} {...register("licencia")} />
          {errors.licencia && <span style={errorMsgStyle}>{errors.licencia.message}</span>}
        </FF>
        <FF label="Profesión:" required style={{ flex: 1 }}>
          <select style={errors.profesion ? inputErrorStyle : inputStyle} {...register("profesion")}>
            <option value="">-- Seleccionar --</option>
            {PROFESIONES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.profesion && <span style={errorMsgStyle}>{errors.profesion.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Expedición de la colegiación:" required style={{ flex: 1 }}>
          <input type="date" style={errors.expedicionColegiacion ? inputErrorStyle : inputStyle} {...register("expedicionColegiacion")} />
          {errors.expedicionColegiacion && <span style={errorMsgStyle}>{errors.expedicionColegiacion.message}</span>}
        </FF>
        <FF label="Expiración de la colegiación:" required style={{ flex: 1 }}>
          <input type="date" style={errors.expiracionColegiacion ? inputErrorStyle : inputStyle} {...register("expiracionColegiacion")} />
          {errors.expiracionColegiacion && <span style={errorMsgStyle}>{errors.expiracionColegiacion.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FF label="Expedición de la licencia:" required style={{ flex: 1 }}>
          <input type="date" style={errors.expedicionLicencia ? inputErrorStyle : inputStyle} {...register("expedicionLicencia")} />
          {errors.expedicionLicencia && <span style={errorMsgStyle}>{errors.expedicionLicencia.message}</span>}
        </FF>
        <FF label="Expiración de la licencia:" required style={{ flex: 1 }}>
          <input type="date" style={errors.expiracionLicencia ? inputErrorStyle : inputStyle} {...register("expiracionLicencia")} />
          {errors.expiracionLicencia && <span style={errorMsgStyle}>{errors.expiracionLicencia.message}</span>}
        </FF>
      </div>

      {/* Blue info box */}
      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Asegúrese de utilizar su correo electrónico personal, este será el único correo electrónico para los trámites subsiguientes de Permiso de Uso Único Automático y Permiso de Construcción Consolidado. La primera vez se deberá realizar la validación de sus credenciales.
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
        <input type="checkbox" style={{ accentColor: "#2b8a7a" }} {...register("certificacion")} />
        Certifico que la información ingresada es correcta.
      </label>
      {errors.certificacion && <span style={errorMsgStyle}>{errors.certificacion.message}</span>}
    </>
  );
}

// ----- APS Info -----

function InfoAPS({ data, onUpdate }: { data: Record<string, unknown>; onUpdate: (val: Record<string, unknown>) => void }) {
  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(solicitudAPSInfoSchema),
    defaultValues: {
      descripcion: (data.descripcion as string) || "",
      tipoPlano: (data.tipoPlano as string) || "",
      notasAdicionales: (data.notasAdicionales as string) || "",
    },
    mode: "onBlur",
  });

  const watchAll = watch();
  useEffect(() => {
    onUpdate(watchAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchAll)]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Información del Plano</span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Descripción del plano:" required style={{ flex: 1 }}>
          <textarea style={errors.descripcion ? textareaErrorStyle : textareaStyle} {...register("descripcion")} />
          {errors.descripcion && <span style={errorMsgStyle}>{errors.descripcion.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Tipo de plano:" required style={{ flex: 1 }}>
          <select style={errors.tipoPlano ? inputErrorStyle : inputStyle} {...register("tipoPlano")}>
            <option value="">-- Seleccionar --</option>
            {TIPOS_PLANO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.tipoPlano && <span style={errorMsgStyle}>{errors.tipoPlano.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Notas adicionales:" style={{ flex: 1 }}>
          <textarea style={textareaStyle} {...register("notasAdicionales")} />
        </FF>
      </div>
    </>
  );
}

// ----- ASP Info -----

function InfoASP({ data, onUpdate }: { data: Record<string, unknown>; onUpdate: (val: Record<string, unknown>) => void }) {
  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(solicitudASPInfoSchema),
    defaultValues: {
      nombreSistema: (data.nombreSistema as string) || "",
      descripcion: (data.descripcion as string) || "",
      fabricante: (data.fabricante as string) || "",
      modelo: (data.modelo as string) || "",
      certificaciones: (data.certificaciones as string) || "",
    },
    mode: "onBlur",
  });

  const watchAll = watch();
  useEffect(() => {
    onUpdate(watchAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchAll)]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Información del Sistema o Producto</span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Nombre del sistema o producto:" required style={{ flex: 1 }}>
          <input type="text" style={errors.nombreSistema ? inputErrorStyle : inputStyle} {...register("nombreSistema")} />
          {errors.nombreSistema && <span style={errorMsgStyle}>{errors.nombreSistema.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Descripción:" required style={{ flex: 1 }}>
          <textarea style={errors.descripcion ? textareaErrorStyle : textareaStyle} {...register("descripcion")} />
          {errors.descripcion && <span style={errorMsgStyle}>{errors.descripcion.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Fabricante:" required style={{ flex: 1 }}>
          <input type="text" style={errors.fabricante ? inputErrorStyle : inputStyle} {...register("fabricante")} />
          {errors.fabricante && <span style={errorMsgStyle}>{errors.fabricante.message}</span>}
        </FF>
        <FF label="Modelo:" style={{ flex: 1 }}>
          <input type="text" style={inputStyle} {...register("modelo")} />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Certificaciones:" style={{ flex: 1 }}>
          <textarea style={textareaStyle} {...register("certificaciones")} placeholder="Listado de certificaciones del sistema o producto" />
        </FF>
      </div>
    </>
  );
}

// ----- CER Info -----

function InfoCER({ data, onUpdate }: { data: Record<string, unknown>; onUpdate: (val: Record<string, unknown>) => void }) {
  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(solicitudCERInfoSchema),
    defaultValues: {
      tipoEquipo: (data.tipoEquipo as string) || "",
      modelo: (data.modelo as string) || "",
      fabricante: (data.fabricante as string) || "",
      capacidad: (data.capacidad as string) || "",
    },
    mode: "onBlur",
  });

  const watchAll = watch();
  useEffect(() => {
    onUpdate(watchAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchAll)]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Información del Equipo de Energía Renovable</span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Tipo de equipo:" required style={{ flex: 1 }}>
          <select style={errors.tipoEquipo ? inputErrorStyle : inputStyle} {...register("tipoEquipo")}>
            <option value="">-- Seleccionar --</option>
            {TIPOS_EQUIPO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.tipoEquipo && <span style={errorMsgStyle}>{errors.tipoEquipo.message}</span>}
        </FF>
        <FF label="Modelo:" required style={{ flex: 1 }}>
          <input type="text" style={errors.modelo ? inputErrorStyle : inputStyle} {...register("modelo")} />
          {errors.modelo && <span style={errorMsgStyle}>{errors.modelo.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Fabricante:" required style={{ flex: 1 }}>
          <input type="text" style={errors.fabricante ? inputErrorStyle : inputStyle} {...register("fabricante")} />
          {errors.fabricante && <span style={errorMsgStyle}>{errors.fabricante.message}</span>}
        </FF>
        <FF label="Capacidad (kW):" required style={{ flex: 1 }}>
          <input type="text" style={errors.capacidad ? inputErrorStyle : inputStyle} {...register("capacidad")} placeholder="Ej: 10.5" />
          {errors.capacidad && <span style={errorMsgStyle}>{errors.capacidad.message}</span>}
        </FF>
      </div>
    </>
  );
}

// ----- CIR Info -----

function InfoCIR({ data, onUpdate }: { data: Record<string, unknown>; onUpdate: (val: Record<string, unknown>) => void }) {
  const { register, formState: { errors }, watch } = useForm({
    resolver: zodResolver(solicitudCIRInfoSchema),
    defaultValues: {
      licencia: (data.licencia as string) || "",
      tipoInstalacion: (data.tipoInstalacion as string) || "",
      experiencia: (data.experiencia as string) || "",
      certificacionesProfesionales: (data.certificacionesProfesionales as string) || "",
    },
    mode: "onBlur",
  });

  const watchAll = watch();
  useEffect(() => {
    onUpdate(watchAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchAll)]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Información del Instalador</span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Licencia:" required style={{ flex: 1 }}>
          <input type="text" style={errors.licencia ? inputErrorStyle : inputStyle} {...register("licencia")} />
          {errors.licencia && <span style={errorMsgStyle}>{errors.licencia.message}</span>}
        </FF>
        <FF label="Tipo de instalación:" required style={{ flex: 1 }}>
          <select style={errors.tipoInstalacion ? inputErrorStyle : inputStyle} {...register("tipoInstalacion")}>
            <option value="">-- Seleccionar --</option>
            {TIPOS_INSTALACION.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.tipoInstalacion && <span style={errorMsgStyle}>{errors.tipoInstalacion.message}</span>}
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Años de experiencia:" required style={{ flex: 1 }}>
          <input type="number" min="0" style={errors.experiencia ? inputErrorStyle : inputStyle} {...register("experiencia")} placeholder="Ej: 5" />
          {errors.experiencia && <span style={errorMsgStyle}>{errors.experiencia.message}</span>}
        </FF>
        <FF label="Certificaciones profesionales:" style={{ flex: 1 }}>
          <textarea style={textareaStyle} {...register("certificacionesProfesionales")} placeholder="Listado de certificaciones profesionales" />
        </FF>
      </div>
    </>
  );
}

// =====================================================================
//  STEP 3: ANEJOS (Documents)
// =====================================================================

function StepAnejos({
  tipo,
}: {
  tipo: string;
}) {
  const docs = DOCUMENTS_BY_TYPE[tipo] || [];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Documentos</span>
      </div>
      <div style={{ backgroundColor: "#f0f4f2", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#555", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        Puede añadir uno o más documentos mediante el botón de Acciones
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Nombre", "Descripción", "Documento", "Requerido", "Acción"].map((h) => (
              <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, i) => (
            <tr key={doc.nombre} style={{ borderBottom: "1px solid #eee", backgroundColor: i % 2 === 1 ? "#f9f9f9" : "#fff" }}>
              <td style={{ padding: "10px 12px", fontSize: "13px" }}>{doc.nombre}</td>
              <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>{doc.descripcion}</td>
              <td style={{ padding: "10px 12px", fontSize: "13px", color: "#999" }}>Pendiente</td>
              <td style={{ padding: "10px 12px" }}>{doc.requerido && <GreenDot />}</td>
              <td style={{ padding: "10px 12px" }}><AccionesBtn /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>Otros Documentos</span>
        </div>
        <button style={{ backgroundColor: "#c53030", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontFamily: "Arial" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
          <tr><td colSpan={3} style={{ padding: "30px", textAlign: "center", color: "#999", fontSize: "13px" }}></td></tr>
        </tbody>
      </table>
    </>
  );
}

// =====================================================================
//  STEP 4: RESUMEN
// =====================================================================

function StepResumen({
  tipo,
  config,
  data,
}: {
  tipo: string;
  config: { nombre: string; desc: string };
  data: SolicitudWizardData;
}) {
  const info = data.informacionGeneral;
  const docs = DOCUMENTS_BY_TYPE[tipo] || [];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Resumen de la Solicitud</span>
      </div>

      <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>Revise la información antes de someter.</p>

      {/* Tipo */}
      <SummarySection title="Tipo de Solicitud">
        <SummaryRow label="Tipo" value={`${config.desc} - ${config.nombre}`} />
      </SummarySection>

      {/* Municipio */}
      <SummarySection title="Municipio">
        <SummaryRow label="Municipio" value={data.municipio.municipio || "(no seleccionado)"} />
      </SummarySection>

      {/* Información General */}
      <SummarySection title="Información General">
        {tipo === "apa" && (
          <>
            <SummaryRow label="Licencia" value={(info.licencia as string) || "-"} />
            <SummaryRow label="Profesión" value={(info.profesion as string) || "-"} />
            <SummaryRow label="Expedición colegiación" value={(info.expedicionColegiacion as string) || "-"} />
            <SummaryRow label="Expiración colegiación" value={(info.expiracionColegiacion as string) || "-"} />
            <SummaryRow label="Expedición licencia" value={(info.expedicionLicencia as string) || "-"} />
            <SummaryRow label="Expiración licencia" value={(info.expiracionLicencia as string) || "-"} />
            <SummaryRow label="Certificación" value={(info.certificacion as boolean) ? "Sí" : "No"} />
          </>
        )}
        {tipo === "aps" && (
          <>
            <SummaryRow label="Descripción del plano" value={(info.descripcion as string) || "-"} />
            <SummaryRow label="Tipo de plano" value={(info.tipoPlano as string) || "-"} />
            <SummaryRow label="Notas adicionales" value={(info.notasAdicionales as string) || "-"} />
          </>
        )}
        {tipo === "asp" && (
          <>
            <SummaryRow label="Nombre del sistema o producto" value={(info.nombreSistema as string) || "-"} />
            <SummaryRow label="Descripción" value={(info.descripcion as string) || "-"} />
            <SummaryRow label="Fabricante" value={(info.fabricante as string) || "-"} />
            <SummaryRow label="Modelo" value={(info.modelo as string) || "-"} />
            <SummaryRow label="Certificaciones" value={(info.certificaciones as string) || "-"} />
          </>
        )}
        {tipo === "cer" && (
          <>
            <SummaryRow label="Tipo de equipo" value={(info.tipoEquipo as string) || "-"} />
            <SummaryRow label="Modelo" value={(info.modelo as string) || "-"} />
            <SummaryRow label="Fabricante" value={(info.fabricante as string) || "-"} />
            <SummaryRow label="Capacidad (kW)" value={(info.capacidad as string) || "-"} />
          </>
        )}
        {tipo === "cir" && (
          <>
            <SummaryRow label="Licencia" value={(info.licencia as string) || "-"} />
            <SummaryRow label="Tipo de instalación" value={(info.tipoInstalacion as string) || "-"} />
            <SummaryRow label="Años de experiencia" value={(info.experiencia as string) || "-"} />
            <SummaryRow label="Certificaciones profesionales" value={(info.certificacionesProfesionales as string) || "-"} />
          </>
        )}
      </SummarySection>

      {/* Documentos */}
      <SummarySection title="Documentos Requeridos">
        {docs.map((doc) => (
          <SummaryRow key={doc.nombre} label={doc.nombre} value="Pendiente" />
        ))}
      </SummarySection>
    </>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ backgroundColor: "#1a3c34", color: "#fff", padding: "8px 12px", fontSize: "13px", fontWeight: 700, borderRadius: "3px 3px 0 0" }}>
        {title}
      </div>
      <div style={{ border: "1px solid #ddd", borderTop: "none", borderRadius: "0 0 3px 3px", padding: "12px" }}>
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: "13px" }}>
      <div style={{ width: "240px", fontWeight: 600, color: "#333" }}>{label}:</div>
      <div style={{ color: "#555", flex: 1 }}>{value}</div>
    </div>
  );
}

// =====================================================================
//  STEP 5: SOMETER
// =====================================================================

function StepSometer({
  submitted,
  onSubmit,
  config,
}: {
  submitted: boolean;
  onSubmit: () => void;
  config: { nombre: string; desc: string };
}) {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#38a169", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#333" }}>Solicitud Sometida Exitosamente</h3>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Su solicitud de {config.desc} - {config.nombre} ha sido sometida correctamente.</p>
        <p style={{ fontSize: "13px", color: "#666" }}>Recibirá una notificación con el número de trámite asignado.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Someter Solicitud</h3>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>Confirme para someter la solicitud de {config.desc}.</p>

      <div style={{ display: "inline-block", textAlign: "left", marginBottom: "24px" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
          <input
            type="checkbox"
            style={{ accentColor: "#2b8a7a", marginTop: "2px" }}
            checked={checked}
            onChange={(e) => { setChecked(e.target.checked); setShowError(false); }}
          />
          <span>
            Certifico que toda la información y los documentos proporcionados en esta solicitud son verdaderos y correctos.
            Entiendo que proporcionar información falsa puede resultar en la denegación de la solicitud y/o
            acciones legales según las leyes aplicables del Estado Libre Asociado de Puerto Rico.
          </span>
        </label>
        {showError && <span style={errorMsgStyle}>Debe certificar la información para someter</span>}
      </div>

      <div>
        <button
          onClick={() => {
            if (!checked) {
              setShowError(true);
              return;
            }
            onSubmit();
          }}
          style={{
            backgroundColor: "#2b8a7a", color: "#fff", border: "none", borderRadius: "4px",
            padding: "10px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Arial",
            display: "inline-flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Someter Solicitud
        </button>
      </div>
    </div>
  );
}

// =====================================================================
//  SHARED UI COMPONENTS
// =====================================================================

function SStepper({ currentStep }: { currentStep: number }) {
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </div>
            <div style={{ fontSize: "10px", textAlign: "center", marginTop: "6px", fontWeight: i === currentStep ? 700 : 400, color: i <= currentStep ? "#333" : "#999", whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</div>
          </div>
          {i < STEPS.length - 1 && <div style={{ width: "50px", height: "2px", backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc", marginTop: "20px" }} />}
        </div>
      ))}
    </div>
  );
}

function FF({ label, required, children, style: extra }: { label: string; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: "8px", ...extra }}>
      <label style={{ display: "block", fontSize: "13px", color: "#333", marginBottom: "3px" }}>{label}{required && <span style={{ color: "red" }}>*</span>}</label>
      {children}
    </div>
  );
}

function GreenDot() {
  return <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#38a169" }} />;
}

function AccionesBtn() {
  return (
    <button style={{ border: "1px solid #ccc", borderRadius: "3px", backgroundColor: "#fff", padding: "4px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "4px" }}>
      Acciones
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  );
}

function Btn({ color, onClick, children }: { color: string; onClick?: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ color: "#fff", backgroundColor: color, border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "6px" }}>{children}</button>;
}

function SvIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>; }
function XIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }
