"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useWizard } from "@/hooks/useWizard";
import { TIPOS_INCENTIVO } from "@/constants/tiposIncentivo";
import { MUNICIPIOS } from "@/constants/municipios";
import {
  incentivoSolicitanteSchema,
  incentivoNegocioSchema,
  incentivoDetallesSchema,
} from "@/lib/validations/incentivo";
import type {
  IncentivoFormData,
  IncentivoSolicitante,
  IncentivoNegocio,
  IncentivoDetallesProyecto,
  IncentivoDocumento,
} from "@/types/incentivo";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { label: "Tipo de\nIncentivo", icon: "tag" },
  { label: "Información\ndel Solicitante", icon: "user" },
  { label: "Información\ndel Negocio", icon: "building" },
  { label: "Detalles del\nProyecto", icon: "doc" },
  { label: "Documentos", icon: "attach" },
  { label: "Resumen", icon: "list" },
  { label: "Someter", icon: "send" },
] as const;

type IconType = (typeof STEPS)[number]["icon"];

const INITIAL_DATA: IncentivoFormData = {
  tipoIncentivo: "",
  solicitante: {
    nombre: "",
    apellido: "",
    ciudadania: "United States",
    tipoIdentificacion: "Numero de Seguro Social",
    identificacion: "",
    telefono: "",
    email: "",
    direccion: "",
    municipio: "",
    codigoPostal: "",
  },
  negocio: {
    nombreNegocio: "",
    codigoNAICS: "",
    registroComerciante: "",
    municipio: "",
    fechaEstablecimiento: "",
    numeroEmpleados: "",
    volumenVentasAnuales: "",
  },
  detallesProyecto: {
    descripcion: "",
    impactoEconomicoEsperado: "",
    empleosCrear: "",
    montoInversion: "",
  },
  documentos: [],
};

const DEFAULT_DOCUMENTS: IncentivoDocumento[] = [
  { nombre: "Certificacion No-Deuda Hacienda", descripcion: "Certificacion de no adeudar contribuciones al Departamento de Hacienda", requerido: true },
  { nombre: "Certificacion Radicacion Planillas", descripcion: "Certificacion de haber radicado planillas los ultimos 5 anos", requerido: true },
  { nombre: "Registro de Comerciante IVU", descripcion: "Certificado de Registro de Comerciante del IVU vigente", requerido: true },
  { nombre: "Certificacion No-Deuda CRIM", descripcion: "Certificacion de no adeudar contribuciones al CRIM", requerido: true },
  { nombre: "Certificacion No-Deuda Fondo del Seguro del Estado", descripcion: "Certificacion de no adeudar al Fondo del Seguro del Estado", requerido: true },
  { nombre: "Certificacion No-Deuda Departamento del Trabajo", descripcion: "Certificacion de no adeudar al Departamento del Trabajo y Recursos Humanos", requerido: true },
];

// ---------------------------------------------------------------------------
// Shared Styles
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// SVG Icon Helpers
// ---------------------------------------------------------------------------

function StepIcon({ type, active, completed }: { type: IconType; active: boolean; completed: boolean }) {
  const bg = completed || active ? "#2b8a7a" : "#ccc";
  const icons: Record<IconType, React.ReactNode> = {
    tag: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    user: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    building: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
    doc: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    attach: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
      </svg>
    ),
    list: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    send: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  };
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icons[type]}
    </div>
  );
}

function LeftArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 12h8" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function GreenDot() {
  return <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#38a169" }} />;
}

function CheckCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 9" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

function IStepper({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0" }}>
      {STEPS.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "90px" }}>
            <StepIcon type={s.icon} active={i === currentStep} completed={i < currentStep} />
            <div
              style={{
                fontSize: "10px",
                textAlign: "center",
                marginTop: "6px",
                fontWeight: i === currentStep ? 700 : 400,
                color: i <= currentStep ? "#333" : "#999",
                whiteSpace: "pre-line",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc",
                marginTop: "20px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------

function FF({
  label,
  required,
  children,
  error,
  style: extra,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: "12px", ...extra }}>
      {label && (
        <label style={{ display: "block", fontSize: "13px", color: "#333", marginBottom: "4px" }}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      {children}
      {error && <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>{error}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step ref interface
// ---------------------------------------------------------------------------

interface StepHandle {
  validate: () => boolean;
}

// ---------------------------------------------------------------------------
// Step 1: Tipo de Incentivo
// ---------------------------------------------------------------------------

const Step1TipoIncentivo = React.forwardRef<
  StepHandle,
  { tipoId: string }
>(function Step1TipoIncentivo({ tipoId }, ref) {
  const tipo = TIPOS_INCENTIVO.find((t) => t.id === tipoId);

  React.useImperativeHandle(ref, () => ({
    validate: () => !!tipo,
  }));

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Tipo de Incentivo Seleccionado</span>
      </div>

      {tipo ? (
        <div
          style={{
            backgroundColor: "#f0faf7",
            border: "1px solid #2b8a7a",
            borderRadius: "6px",
            padding: "24px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#333", marginBottom: "4px" }}>
            Tipo de Incentivo:
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#2b8a7a",
              marginBottom: "16px",
            }}
          >
            {tipo.nombre}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#333", marginBottom: "4px" }}>
            Descripcion:
          </div>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{tipo.desc}</div>
          <div
            style={{
              marginTop: "20px",
              padding: "10px 14px",
              backgroundColor: "#e8f4fd",
              border: "1px solid #b3d9f2",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#0c5460",
              lineHeight: 1.6,
            }}
          >
            Este incentivo se tramita bajo la <strong>Ley 60-2019 (Codigo de Incentivos de Puerto Rico)</strong>. Complete
            todos los pasos del formulario para someter su solicitud de decreto.
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "4px",
            padding: "16px",
            fontSize: "13px",
            color: "#856404",
          }}
        >
          No se encontro el tipo de incentivo seleccionado. Por favor regrese a la pagina de incentivos y seleccione un
          tipo valido.
        </div>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 2: Informacion del Solicitante
// ---------------------------------------------------------------------------

const Step2Solicitante = React.forwardRef<
  StepHandle,
  {
    data: IncentivoSolicitante;
    onChange: (d: Partial<IncentivoSolicitante>) => void;
  }
>(function Step2Solicitante({ data, onChange }, ref) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useImperativeHandle(ref, () => ({
    validate: () => {
      const result = incentivoSolicitanteSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
  }));

  const handle = (field: keyof IncentivoSolicitante) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ [field]: e.target.value });
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Informacion del Solicitante</span>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
        <FF label="Nombre:" required error={errors.nombre} style={{ flex: 1 }}>
          <input type="text" value={data.nombre} onChange={handle("nombre")} style={inputStyle} />
        </FF>
        <FF label="Apellido:" required error={errors.apellido} style={{ flex: 1 }}>
          <input type="text" value={data.apellido} onChange={handle("apellido")} style={inputStyle} />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
        <FF label="Ciudadania:" required error={errors.ciudadania} style={{ flex: 1 }}>
          <select value={data.ciudadania} onChange={handle("ciudadania")} style={inputStyle}>
            <option value="United States">United States</option>
            <option value="Otra">Otra</option>
          </select>
        </FF>
        <FF label="Tipo de Identificacion:" required error={errors.tipoIdentificacion} style={{ flex: 1 }}>
          <select value={data.tipoIdentificacion} onChange={handle("tipoIdentificacion")} style={inputStyle}>
            <option value="Numero de Seguro Social">Numero de Seguro Social</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Otro">Otro</option>
          </select>
        </FF>
        <FF label="Identificacion:" required error={errors.identificacion} style={{ flex: 1 }}>
          <input type="text" value={data.identificacion} onChange={handle("identificacion")} style={inputStyle} />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
        <FF label="Telefono:" required error={errors.telefono} style={{ flex: 1 }}>
          <input type="tel" value={data.telefono} onChange={handle("telefono")} style={inputStyle} placeholder="(787) 000-0000" />
        </FF>
        <FF label="Correo Electronico:" required error={errors.email} style={{ flex: 1 }}>
          <input type="email" value={data.email} onChange={handle("email")} style={inputStyle} placeholder="correo@ejemplo.com" />
        </FF>
      </div>

      <FF label="Direccion:" required error={errors.direccion}>
        <input type="text" value={data.direccion} onChange={handle("direccion")} style={inputStyle} />
      </FF>

      <div style={{ display: "flex", gap: "16px" }}>
        <FF label="Municipio:" required error={errors.municipio} style={{ flex: 1 }}>
          <select value={data.municipio} onChange={handle("municipio")} style={inputStyle}>
            <option value="">Seleccione un municipio</option>
            {MUNICIPIOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FF>
        <FF label="Codigo Postal:" required error={errors.codigoPostal} style={{ width: "180px" }}>
          <input type="text" value={data.codigoPostal} onChange={handle("codigoPostal")} style={inputStyle} placeholder="00000" />
        </FF>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 3: Informacion del Negocio
// ---------------------------------------------------------------------------

const Step3Negocio = React.forwardRef<
  StepHandle,
  {
    data: IncentivoNegocio;
    onChange: (d: Partial<IncentivoNegocio>) => void;
  }
>(function Step3Negocio({ data, onChange }, ref) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useImperativeHandle(ref, () => ({
    validate: () => {
      const result = incentivoNegocioSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
  }));

  const handle = (field: keyof IncentivoNegocio) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ [field]: e.target.value });
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Informacion del Negocio</span>
      </div>

      <FF label="Nombre del Negocio:" required error={errors.nombreNegocio}>
        <input type="text" value={data.nombreNegocio} onChange={handle("nombreNegocio")} style={inputStyle} />
      </FF>

      <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
        <FF label="Codigo NAICS:" required error={errors.codigoNAICS} style={{ flex: 1 }}>
          <input
            type="text"
            value={data.codigoNAICS}
            onChange={handle("codigoNAICS")}
            style={inputStyle}
            placeholder="Ej. 541511"
          />
        </FF>
        <FF label="Registro de Comerciante:" required error={errors.registroComerciante} style={{ flex: 1 }}>
          <input type="text" value={data.registroComerciante} onChange={handle("registroComerciante")} style={inputStyle} />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
        <FF label="Municipio:" required error={errors.municipio} style={{ flex: 1 }}>
          <select value={data.municipio} onChange={handle("municipio")} style={inputStyle}>
            <option value="">Seleccione un municipio</option>
            {MUNICIPIOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FF>
        <FF label="Fecha de Establecimiento:" required error={errors.fechaEstablecimiento} style={{ flex: 1 }}>
          <input type="date" value={data.fechaEstablecimiento} onChange={handle("fechaEstablecimiento")} style={inputStyle} />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <FF label="Numero de Empleados:" required error={errors.numeroEmpleados} style={{ flex: 1 }}>
          <input
            type="number"
            min="0"
            value={data.numeroEmpleados}
            onChange={handle("numeroEmpleados")}
            style={inputStyle}
            placeholder="0"
          />
        </FF>
        <FF label="Volumen de Ventas Anuales (USD):" required error={errors.volumenVentasAnuales} style={{ flex: 1 }}>
          <input
            type="text"
            value={data.volumenVentasAnuales}
            onChange={handle("volumenVentasAnuales")}
            style={inputStyle}
            placeholder="$0.00"
          />
        </FF>
      </div>

      <div
        style={{
          marginTop: "8px",
          padding: "10px 14px",
          backgroundColor: "#e8f4fd",
          border: "1px solid #b3d9f2",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#0c5460",
          lineHeight: 1.6,
        }}
      >
        El codigo NAICS (North American Industry Classification System) identifica la actividad economica principal de su
        negocio. Puede consultarlo en{" "}
        <strong>www.census.gov/naics</strong>.
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 4: Detalles del Proyecto
// ---------------------------------------------------------------------------

const Step4DetallesProyecto = React.forwardRef<
  StepHandle,
  {
    data: IncentivoDetallesProyecto;
    onChange: (d: Partial<IncentivoDetallesProyecto>) => void;
  }
>(function Step4DetallesProyecto({ data, onChange }, ref) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useImperativeHandle(ref, () => ({
    validate: () => {
      const result = incentivoDetallesSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
  }));

  const handleInput = (field: keyof IncentivoDetallesProyecto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ [field]: e.target.value });
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Detalles del Proyecto</span>
      </div>

      <FF label="Descripcion del Proyecto:" required error={errors.descripcion}>
        <textarea
          value={data.descripcion}
          onChange={handleInput("descripcion")}
          style={{ ...inputStyle, height: "100px", resize: "vertical" }}
          placeholder="Describa el proyecto, actividades principales y objetivos..."
        />
      </FF>

      <FF label="Impacto Economico Esperado:" required error={errors.impactoEconomicoEsperado}>
        <textarea
          value={data.impactoEconomicoEsperado}
          onChange={handleInput("impactoEconomicoEsperado")}
          style={{ ...inputStyle, height: "80px", resize: "vertical" }}
          placeholder="Describa el impacto economico esperado del proyecto..."
        />
      </FF>

      <div style={{ display: "flex", gap: "16px" }}>
        <FF label="Empleos a Crear:" required error={errors.empleosCrear} style={{ flex: 1 }}>
          <input
            type="number"
            min="0"
            value={data.empleosCrear}
            onChange={handleInput("empleosCrear")}
            style={inputStyle}
            placeholder="0"
          />
        </FF>
        <FF label="Monto de Inversion (USD):" required error={errors.montoInversion} style={{ flex: 1 }}>
          <input
            type="text"
            value={data.montoInversion}
            onChange={handleInput("montoInversion")}
            style={inputStyle}
            placeholder="$0.00"
          />
        </FF>
      </div>

      <div
        style={{
          marginTop: "8px",
          padding: "10px 14px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#856404",
          lineHeight: 1.6,
        }}
      >
        <strong>Nota:</strong> La informacion provista en esta seccion sera evaluada por la DDEC para determinar la
        viabilidad del decreto bajo la Ley 60-2019. Provea la mayor cantidad de detalles posible.
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 5: Documentos
// ---------------------------------------------------------------------------

const Step5Documentos = React.forwardRef<
  StepHandle,
  {
    documentos: IncentivoDocumento[];
    onUpload: (index: number, file: File) => void;
  }
>(function Step5Documentos({ documentos, onUpload }, ref) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useImperativeHandle(ref, () => ({
    validate: () => true, // Documents can be uploaded later
  }));

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(index, file);
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Documentos Requeridos</span>
      </div>

      <div
        style={{
          backgroundColor: "#f0f4f2",
          borderRadius: "4px",
          padding: "10px 14px",
          marginBottom: "16px",
          fontSize: "12px",
          color: "#555",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        </svg>
        Suba los documentos requeridos para completar su solicitud de incentivo. Puede utilizar el boton de Acciones
        para cargar cada documento.
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Nombre", "Descripcion", "Documento", "Requerido", "Accion"].map((h) => (
              <th
                key={h}
                style={{
                  color: "#fff",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc, i) => (
            <tr
              key={doc.nombre}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: i % 2 === 1 ? "#f9f9f9" : "#fff",
              }}
            >
              <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>{doc.nombre}</td>
              <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>{doc.descripcion}</td>
              <td style={{ padding: "10px 12px", fontSize: "13px", color: doc.archivo ? "#2b8a7a" : "#999" }}>
                {doc.archivo ? doc.archivo.name : "Pendiente"}
              </td>
              <td style={{ padding: "10px 12px" }}>{doc.requerido && <GreenDot />}</td>
              <td style={{ padding: "10px 12px" }}>
                <input
                  type="file"
                  ref={(el) => { fileInputRefs.current[i] = el; }}
                  onChange={handleFileChange(i)}
                  style={{ display: "none" }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRefs.current[i]?.click()}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                    backgroundColor: "#fff",
                    padding: "4px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Arial",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Cargar
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>Otros Documentos</span>
        </div>
        <button
          style={{
            backgroundColor: "#c53030",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "Arial",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar Otro Documento
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Descripcion", "Documento", "Accion"].map((h) => (
              <th
                key={h}
                style={{
                  color: "#fff",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ padding: "30px", textAlign: "center", color: "#999", fontSize: "13px" }}>
              No se han agregado documentos adicionales
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 6: Resumen
// ---------------------------------------------------------------------------

const Step6Resumen = React.forwardRef<
  StepHandle,
  {
    data: IncentivoFormData;
  }
>(function Step6Resumen({ data }, ref) {
  React.useImperativeHandle(ref, () => ({
    validate: () => true,
  }));

  const tipo = TIPOS_INCENTIVO.find((t) => t.id === data.tipoIncentivo);

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "16px 20px",
    marginBottom: "16px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#2b8a7a",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    marginBottom: "6px",
    fontSize: "13px",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    color: "#555",
    width: "220px",
    flexShrink: 0,
  };

  const valueStyle: React.CSSProperties = {
    color: "#333",
  };

  function Row({ label, value }: { label: string; value: string }) {
    return (
      <div style={rowStyle}>
        <span style={labelStyle}>{label}:</span>
        <span style={valueStyle}>{value || "—"}</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Resumen de la Solicitud</span>
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "10px 14px",
          backgroundColor: "#e8f4fd",
          border: "1px solid #b3d9f2",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#0c5460",
          lineHeight: 1.6,
        }}
      >
        Revise cuidadosamente toda la informacion antes de someter. Si necesita hacer cambios, utilice el boton
        &quot;Paso Anterior&quot; para regresar al paso correspondiente.
      </div>

      {/* Tipo de Incentivo */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Tipo de Incentivo</div>
        <Row label="Tipo" value={tipo?.nombre || ""} />
        <Row label="Descripcion" value={tipo?.desc || ""} />
      </div>

      {/* Solicitante */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Informacion del Solicitante</div>
        <Row label="Nombre" value={`${data.solicitante.nombre} ${data.solicitante.apellido}`} />
        <Row label="Ciudadania" value={data.solicitante.ciudadania} />
        <Row label="Tipo de Identificacion" value={data.solicitante.tipoIdentificacion} />
        <Row label="Identificacion" value={data.solicitante.identificacion} />
        <Row label="Telefono" value={data.solicitante.telefono} />
        <Row label="Correo Electronico" value={data.solicitante.email} />
        <Row label="Direccion" value={data.solicitante.direccion} />
        <Row label="Municipio" value={data.solicitante.municipio} />
        <Row label="Codigo Postal" value={data.solicitante.codigoPostal} />
      </div>

      {/* Negocio */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Informacion del Negocio</div>
        <Row label="Nombre del Negocio" value={data.negocio.nombreNegocio} />
        <Row label="Codigo NAICS" value={data.negocio.codigoNAICS} />
        <Row label="Registro de Comerciante" value={data.negocio.registroComerciante} />
        <Row label="Municipio" value={data.negocio.municipio} />
        <Row label="Fecha de Establecimiento" value={data.negocio.fechaEstablecimiento} />
        <Row label="Numero de Empleados" value={data.negocio.numeroEmpleados} />
        <Row label="Volumen de Ventas Anuales" value={data.negocio.volumenVentasAnuales} />
      </div>

      {/* Detalles del Proyecto */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Detalles del Proyecto</div>
        <Row label="Descripcion" value={data.detallesProyecto.descripcion} />
        <Row label="Impacto Economico Esperado" value={data.detallesProyecto.impactoEconomicoEsperado} />
        <Row label="Empleos a Crear" value={data.detallesProyecto.empleosCrear} />
        <Row label="Monto de Inversion" value={data.detallesProyecto.montoInversion} />
      </div>

      {/* Documentos */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Documentos</div>
        {data.documentos.length > 0 ? (
          data.documentos.map((doc) => (
            <div key={doc.nombre} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
              {doc.archivo ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
              <span style={{ color: doc.archivo ? "#333" : "#999" }}>
                {doc.nombre}: {doc.archivo ? doc.archivo.name : "Pendiente"}
              </span>
            </div>
          ))
        ) : (
          <div style={{ fontSize: "13px", color: "#999" }}>No se han cargado documentos</div>
        )}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Step 7: Someter
// ---------------------------------------------------------------------------

const Step7Someter = React.forwardRef<
  StepHandle,
  {
    tipoNombre: string;
    submitted: boolean;
    onSubmit: () => void;
  }
>(function Step7Someter({ tipoNombre, submitted, onSubmit }, ref) {
  const [certified, setCertified] = useState(false);
  const [certError, setCertError] = useState("");

  React.useImperativeHandle(ref, () => ({
    validate: () => {
      if (!certified && !submitted) {
        setCertError("Debe certificar la informacion antes de someter");
        return false;
      }
      setCertError("");
      return true;
    },
  }));

  if (submitted) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <CheckCircle />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#2b8a7a", marginBottom: "8px" }}>
          Solicitud Sometida Exitosamente
        </h3>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "8px", lineHeight: 1.6 }}>
          Su solicitud de decreto de incentivo <strong>{tipoNombre}</strong> ha sido radicada correctamente.
        </p>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
          Recibira una confirmacion por correo electronico con el numero de tramite asignado.
        </p>
        <div
          style={{
            backgroundColor: "#f0faf7",
            border: "1px solid #2b8a7a",
            borderRadius: "6px",
            padding: "16px 20px",
            display: "inline-block",
            textAlign: "left",
            fontSize: "13px",
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>Proximos pasos:</strong>
          </div>
          <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px", color: "#555" }}>
            <li>La DDEC evaluara su solicitud dentro de los proximos 30 dias.</li>
            <li>Puede verificar el estado de su tramite en &quot;Mi Bandeja&quot;.</li>
            <li>De requerir documentos adicionales, se le notificara por correo electronico.</li>
            <li>Una vez aprobada, se emitira su decreto bajo la Ley 60-2019.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Someter Solicitud de Incentivo</span>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          padding: "16px",
          marginBottom: "20px",
          fontSize: "12px",
          color: "#856404",
          lineHeight: 1.8,
        }}
      >
        <strong>Aviso Legal:</strong> Al someter esta solicitud, usted declara bajo juramento que toda la informacion
        provista es verdadera, correcta y completa. Cualquier declaracion falsa o fraudulenta puede resultar en la
        denegacion de la solicitud, la revocacion de cualquier decreto otorgado, y puede conllevar penalidades bajo las
        leyes aplicables del Estado Libre Asociado de Puerto Rico. La Ley 60-2019 (Codigo de Incentivos de Puerto Rico)
        requiere que toda la informacion suministrada sea veraz y verificable.
      </div>

      <div
        style={{
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#333" }}>
          Certificacion del Solicitante
        </div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.8, marginBottom: "16px" }}>
          Al marcar la casilla a continuacion, usted certifica que:
        </div>
        <ul style={{ fontSize: "13px", color: "#555", lineHeight: 2, paddingLeft: "24px", marginBottom: "16px" }}>
          <li>Toda la informacion provista en esta solicitud es veraz y correcta.</li>
          <li>Los documentos presentados son autenticos y vigentes.</li>
          <li>
            El negocio o empresa solicitante no tiene deudas pendientes con las agencias del Gobierno de Puerto Rico,
            incluyendo Hacienda, CRIM, ASUME, Fondo del Seguro del Estado y Departamento del Trabajo.
          </li>
          <li>
            Entiende que la aprobacion del decreto esta sujeta a la evaluacion y determinacion de la DDEC bajo los
            criterios establecidos en la Ley 60-2019.
          </li>
          <li>
            Se compromete a cumplir con los Informes Anuales de Negocio Exento (IANE) y todas las condiciones del
            decreto, de ser aprobado.
          </li>
        </ul>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            color: "#333",
          }}
        >
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => {
              setCertified(e.target.checked);
              if (e.target.checked) setCertError("");
            }}
            style={{ accentColor: "#2b8a7a", marginTop: "2px", width: "16px", height: "16px" }}
          />
          <span>
            Certifico que he leido y entiendo las condiciones anteriores, y que toda la informacion provista es correcta y
            completa.
          </span>
        </label>
        {certError && <div style={{ color: "red", fontSize: "11px", marginTop: "6px", marginLeft: "26px" }}>{certError}</div>}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            if (!certified) {
              setCertError("Debe certificar la informacion antes de someter");
              return;
            }
            onSubmit();
          }}
          style={{
            ...btnStyle,
            backgroundColor: "#2b8a7a",
            padding: "12px 32px",
            fontSize: "14px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Someter Solicitud de Incentivo
        </button>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Main Wizard Page
// ---------------------------------------------------------------------------

export default function IncentivoWizardPage() {
  const params = useParams();
  const router = useRouter();
  const tipoId = (params?.tipo as string) || "";

  const tipoInfo = TIPOS_INCENTIVO.find((t) => t.id === tipoId);

  const wizard = useWizard<Record<string, unknown>>({
    totalSteps: STEPS.length,
    initialData: {
      ...INITIAL_DATA,
      tipoIncentivo: tipoId,
      documentos: DEFAULT_DOCUMENTS,
    } as unknown as Record<string, unknown>,
    storageKey: `incentivo-wizard-${tipoId}`,
  });

  // Cast data back to our typed shape
  const formData = wizard.data as unknown as IncentivoFormData & { documentos: IncentivoDocumento[] };

  const [submitted, setSubmitted] = useState(false);

  // Ensure tipoIncentivo stays synced
  useEffect(() => {
    if (tipoId && formData.tipoIncentivo !== tipoId) {
      wizard.setStepData("tipoIncentivo" as keyof Record<string, unknown>, tipoId as never);
    }
    // Initialize documents if empty
    if (!formData.documentos || formData.documentos.length === 0) {
      wizard.setStepData("documentos" as keyof Record<string, unknown>, DEFAULT_DOCUMENTS as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoId]);

  // Step refs
  const stepRef = useRef<StepHandle>(null);

  // Handler: advance with validation
  const handleNext = useCallback(() => {
    if (stepRef.current) {
      const valid = stepRef.current.validate();
      if (!valid) return;
    }
    wizard.goNext();
  }, [wizard]);

  // Document upload handler
  const handleDocUpload = useCallback(
    (index: number, file: File) => {
      const docs = [...(formData.documentos || DEFAULT_DOCUMENTS)];
      docs[index] = { ...docs[index], archivo: file };
      wizard.setStepData("documentos" as keyof Record<string, unknown>, docs as never);
    },
    [formData.documentos, wizard]
  );

  // Submit handler
  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    wizard.clearStorage();
  }, [wizard]);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Solicitud de Decreto de Incentivo — {tipoInfo?.nombre || tipoId}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <IStepper currentStep={wizard.currentStep} />

      {/* Step Content */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          margin: "0 24px",
          backgroundColor: "#fff",
        }}
      >
        {wizard.currentStep === 0 && <Step1TipoIncentivo ref={stepRef} tipoId={tipoId} />}
        {wizard.currentStep === 1 && (
          <Step2Solicitante
            ref={stepRef}
            data={formData.solicitante}
            onChange={(d) =>
              wizard.updateStepData(
                "solicitante" as keyof Record<string, unknown>,
                d as Partial<Record<string, unknown>[keyof Record<string, unknown>]>
              )
            }
          />
        )}
        {wizard.currentStep === 2 && (
          <Step3Negocio
            ref={stepRef}
            data={formData.negocio}
            onChange={(d) =>
              wizard.updateStepData(
                "negocio" as keyof Record<string, unknown>,
                d as Partial<Record<string, unknown>[keyof Record<string, unknown>]>
              )
            }
          />
        )}
        {wizard.currentStep === 3 && (
          <Step4DetallesProyecto
            ref={stepRef}
            data={formData.detallesProyecto}
            onChange={(d) =>
              wizard.updateStepData(
                "detallesProyecto" as keyof Record<string, unknown>,
                d as Partial<Record<string, unknown>[keyof Record<string, unknown>]>
              )
            }
          />
        )}
        {wizard.currentStep === 4 && (
          <Step5Documentos
            ref={stepRef}
            documentos={formData.documentos || DEFAULT_DOCUMENTS}
            onUpload={handleDocUpload}
          />
        )}
        {wizard.currentStep === 5 && <Step6Resumen ref={stepRef} data={formData} />}
        {wizard.currentStep === 6 && (
          <Step7Someter
            ref={stepRef}
            tipoNombre={tipoInfo?.nombre || tipoId}
            submitted={submitted}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0", flexWrap: "wrap" }}>
          {wizard.currentStep > 0 && (
            <button onClick={wizard.goPrev} style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
              <LeftArrow /> Paso Anterior
            </button>
          )}
          <button style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
            <SaveIcon /> Guardar
          </button>
          <button
            onClick={handleNext}
            style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}
          >
            <SaveIcon /> Guardar y Continuar
          </button>
          <button
            onClick={() => router.push("/")}
            style={{ ...btnStyle, backgroundColor: "#c53030" }}
          >
            <XIcon /> Cancelar
          </button>
          {wizard.currentStep < STEPS.length - 1 && (
            <button onClick={handleNext} style={{ ...btnStyle, backgroundColor: "#718096" }}>
              Siguiente Paso <RightArrow />
            </button>
          )}
        </div>
      )}

      {/* Post-submit navigation */}
      {submitted && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0" }}>
          <button onClick={() => router.push("/")} style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Ir a Mi Bandeja
          </button>
        </div>
      )}
    </div>
  );
}
