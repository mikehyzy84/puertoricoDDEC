"use client";

import { useState } from "react";
import React from "react";

const STEPS = [
  { label: "Proyecto o\nActividad", icon: "building" },
  { label: "Dueño del\nProyecto", icon: "user" },
  { label: "Localización", icon: "pin" },
  { label: "Catastros\nAdicionales", icon: "check" },
  { label: "Dueño del Solar", icon: "users" },
  { label: "Arrendatario", icon: "home" },
  { label: "Documentos", icon: "doc" },
  { label: "Finish", icon: "checkmark" },
] as const;

type IconType = (typeof STEPS)[number]["icon"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "3px",
  padding: "8px 10px",
  fontSize: "13px",
  fontFamily: "Arial, Helvetica, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  color: "#fff", border: "none", borderRadius: "4px",
  padding: "8px 16px", fontSize: "13px", fontWeight: 600,
  cursor: "pointer", fontFamily: "Arial", display: "flex",
  alignItems: "center", gap: "6px",
};

function StepIcon({ type, active, completed }: { type: IconType; active: boolean; completed: boolean }) {
  const bg = completed ? "#2b8a7a" : active ? "#2b8a7a" : "#ccc";
  const icons: Record<IconType, React.ReactNode> = {
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    checkmark: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return (
    <div style={{
      width: "40px", height: "40px", borderRadius: "50%",
      backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icons[type]}
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0", gap: "0" }}>
      {STEPS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
            <StepIcon type={step.icon} active={i === currentStep} completed={i < currentStep} />
            <div style={{
              fontSize: "10px", textAlign: "center", marginTop: "6px",
              fontWeight: i === currentStep ? 700 : 400,
              color: i <= currentStep ? "#333" : "#999",
              lineHeight: 1.3, whiteSpace: "pre-line",
            }}>{step.label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: "40px", height: "2px", backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc",
              marginTop: "20px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function WizardButtons({ currentStep, onPrev, onNext }: { currentStep: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0", flexWrap: "wrap" }}>
      {currentStep > 0 && (
        <button onClick={onPrev} style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Paso Anterior
        </button>
      )}
      <button style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>
        Guardar
      </button>
      <button style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>
        Guardar y Continuar
      </button>
      <button style={{ ...btnStyle, backgroundColor: "#c53030" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Cancelar
      </button>
      <button onClick={onNext} style={{ ...btnStyle, backgroundColor: "#718096" }}>
        Siguiente Paso
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

function FormField({ label, required, children, style: extraStyle }: { label: string; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
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

function RadioOption({ label, name, checked, onChange }: { label: string; name: string; checked?: boolean; onChange?: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", cursor: "pointer" }}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor: "#2b8a7a" }} />
      {label}
    </label>
  );
}

function SearchBtn() {
  return (
    <button style={{
      backgroundColor: "#2b8a7a", color: "#fff", border: "none",
      borderRadius: "4px", width: "34px", height: "34px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  );
}

// Step 1: Proyecto o Actividad
function Step1() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Proyecto o Actividad</span>
      </div>

      <FormField label="Nombre:" required>
        <input type="text" style={inputStyle} />
      </FormField>

      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FormField label="Tipo de Zona:" required style={{ flex: 1 }}>
          <select style={inputStyle}>
            <option>Seleccione una zona...</option>
            <option>Rural</option>
            <option>Urbano</option>
          </select>
        </FormField>
        <FormField label="Tipo de Proyecto:" required style={{ flex: 1 }}>
          <select style={inputStyle}>
            <option>Privado</option>
            <option>Alianza Público-Privada</option>
            <option>Público</option>
            <option>Público con Contratación Privada</option>
          </select>
        </FormField>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: "#333", marginBottom: "8px" }}>
          ¿Su proyecto está subvencionado con fondos federales bajo estos programas?<span style={{ color: "red" }}>*</span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <RadioOption label="Fondos CDBG-DR" name="fondos" />
          <RadioOption label="Fondos COR3/FEMA" name="fondos" />
          <RadioOption label="No aplica" name="fondos" />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: "#333", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
          ¿Su proyecto cuenta con una de las siguientes designaciones?<span style={{ color: "red" }}>*</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2b8a7a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <RadioOption label="Crítico" name="designacion" />
          <RadioOption label="Estratégico" name="designacion" />
          <RadioOption label="No aplica" name="designacion" />
        </div>
      </div>

      <FormField label="Descripción:" required>
        <textarea style={{ ...inputStyle, height: "100px", resize: "vertical" }} />
      </FormField>
    </div>
  );
}

// Step 2: Dueño del Proyecto
function Step2() {
  const [owner, setOwner] = useState("usted");
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Dueño del Proyecto</span>
      </div>

      <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>
        ¿A nombre de quién deben salir los trámites de este proyecto?
      </div>

      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        <RadioOption label="Usted" name="owner" checked={owner === "usted"} onChange={() => setOwner("usted")} />
        <RadioOption label="De otra persona" name="owner" checked={owner === "otra"} onChange={() => setOwner("otra")} />
        <RadioOption label="De una compañía" name="owner" checked={owner === "company"} onChange={() => setOwner("company")} />
      </div>

      {owner === "usted" && (
        <div style={{ fontSize: "14px", color: "#333" }}>
          <strong>Nombre y Apellido del dueño del Proyecto:</strong> Antonio Pavía
        </div>
      )}

      {owner === "otra" && (
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <FormField label="Ciudadanía:" required style={{ flex: 1 }}>
            <select style={inputStyle}>
              <option>United States</option>
            </select>
          </FormField>
          <FormField label="Tipo:" required style={{ flex: 1 }}>
            <select style={inputStyle}>
              <option>Número de Seguro Social</option>
            </select>
          </FormField>
          <div style={{ flex: 1 }}>
            <input type="text" style={inputStyle} />
          </div>
          <SearchBtn />
        </div>
      )}

      {owner === "company" && (
        <>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "16px" }}>
            <FormField label="Compañías:" required style={{ flex: 1 }}>
              <select style={inputStyle}>
                <option>Seleccione una Compañía...</option>
              </select>
            </FormField>
            <button style={{ backgroundColor: "#1a3c34", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial" }}>
              Agregar Compañías
            </button>
          </div>
          <div style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "12px" }}>
            <strong>¿Cuenta la empresa con Decreto otorgado por el Gobierno de Puerto Rico?</strong>
            <RadioOption label="Sí" name="decreto" />
            <RadioOption label="No" name="decreto" />
          </div>
        </>
      )}
    </div>
  );
}

// Step 3: Localización
function Step3() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Localización:</span>
      </div>
      <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Búsqueda por Catastro</div>

      <div style={{ backgroundColor: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#333" }}>
          Identifique la localización con una (1) de las siguientes opciones:
        </div>
        <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "12px", color: "#555", lineHeight: 1.6 }}>
          <li>Número de catastro</li>
          <li>Coordenadas Geográficas o las coordenadas Lambert</li>
          <li>Seleccionando la ubicación o parcela en el mapa a continuación (buscar sobre el mapa)</li>
        </ul>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Número Catastro:</span>
        <input type="text" placeholder="000-000-000-00" style={{ ...inputStyle, flex: 1 }} />
        <SearchBtn />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Coordenadas Geográficas:</span>
        <span style={{ fontSize: "12px", color: "#666" }}>Latitud:</span>
        <input type="text" placeholder="00.000" style={{ ...inputStyle, width: "120px" }} />
        <span style={{ fontSize: "12px", color: "#666" }}>Longitud:</span>
        <input type="text" placeholder="00.000" style={{ ...inputStyle, width: "120px" }} />
        <SearchBtn />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Coordenadas Lambert:</span>
        <span style={{ fontSize: "12px", color: "#666" }}>X:</span>
        <input type="text" placeholder="0" style={{ ...inputStyle, width: "120px" }} />
        <span style={{ fontSize: "12px", color: "#666" }}>Y:</span>
        <input type="text" placeholder="0" style={{ ...inputStyle, width: "120px" }} />
        <SearchBtn />
      </div>

      <div style={{
        width: "100%", height: "300px", backgroundColor: "#e0e8e4",
        borderRadius: "4px", border: "1px solid #ccc", marginBottom: "20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#666", fontSize: "14px",
        backgroundImage: "linear-gradient(135deg, #d4e4dc 25%, #c8dcd2 50%, #d4e4dc 75%)",
      }}>
        Mapa de Puerto Rico (Esri/ArcGIS)
      </div>

      <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Detalles del Catastro</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          "Número de catastro", "Zona inundable", "Número de catastro ext", "Floodway",
          "Área aproximada", "Calificación", "Municipio", "Calificación sobrepuesto",
          "Barrio", "Clasificación", "Zona o sitio histórico", "Coordenadas",
          "Usos de permiso", "Coordenadas Nad83", "Suelo geológico", "Calificaciones efectivas",
        ].map((field) => (
          <FormField key={field} label={`${field}:`} required={field !== "Usos de permiso" && field !== "Calificaciones efectivas"}>
            <input type="text" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly />
          </FormField>
        ))}
      </div>
    </div>
  );
}

// Step 4: Catastros Adicionales
function Step4() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px" }}>Detalles Adicionales del Catastro</h3>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <FormField label="Cabida de la propiedad según escritura:" required style={{ width: "200px" }}>
          <input type="text" style={inputStyle} />
        </FormField>
        <FormField label="" style={{ width: "180px" }}>
          <select style={inputStyle}><option>Seleccione un valor...</option></select>
        </FormField>
        <FormField label="Municipio:" required style={{ flex: 1 }}>
          <select style={inputStyle}><option>Seleccione el municipio...</option></select>
        </FormField>
      </div>
      <FormField label="Dirección Física (solo lectura):" required>
        <input type="text" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly />
      </FormField>
      <div style={{ marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700 }}>Tipo de Dirección:<span style={{ color: "red" }}>*</span></span>
        <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
          <RadioOption label="Urbana" name="tipoDireccion" />
          <RadioOption label="Rural" name="tipoDireccion" />
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FormField label="Código postal:" required style={{ flex: 1 }}>
          <input type="text" style={inputStyle} />
        </FormField>
        <FormField label="Estado:" required style={{ flex: 1 }}>
          <input type="text" value="Puerto Rico" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly />
        </FormField>
      </div>
      <FormField label="Punto de referencia de cómo llegar:">
        <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
      </FormField>
    </div>
  );
}

// Step 5: Dueño del Solar
function Step5() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Dueño del Solar</span>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Nombre:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
        <FormField label="Inicial:" style={{ width: "80px" }}><input type="text" style={inputStyle} /></FormField>
        <FormField label="Apellido:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Teléfono:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
        <FormField label="Email:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Dirección Línea 1:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
        <FormField label="Dirección Línea 2:" style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <FormField label="País:" required style={{ flex: 1 }}><select style={inputStyle}><option>United States</option></select></FormField>
        <FormField label="Estado*" style={{ flex: 1 }}><select style={inputStyle}><option>Seleccione el estado</option></select></FormField>
        <FormField label="Ciudad:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FormField>
        <FormField label="Código Postal:" required style={{ width: "120px" }}><input type="text" style={inputStyle} /></FormField>
      </div>
    </div>
  );
}

// Step 6: Arrendatario
function Step6() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Arrendatario</span>
      </div>
      <div style={{ fontSize: "13px", lineHeight: 1.8, marginBottom: "20px" }}>
        <div>Si usted está gestionando un trámite para otra persona, <strong>debe</strong> contestar <strong>Sí</strong></div>
        <div>Si usted está arrendando/alquilando un local o el solar, <strong>debe</strong> contestar <strong>Sí</strong></div>
        <div>Si es el Dueño del Proyecto del Local, marque <strong>No</strong></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "13px" }}>¿Su proyecto tiene Arrendatario?</span>
        <RadioOption label="Sí" name="arrendatario" />
        <RadioOption label="No" name="arrendatario" />
      </div>
    </div>
  );
}

// Step 7: Documentos
function Step7() {
  return (
    <div style={{ padding: "20px 24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Tipo de Anejo", "Nombre del Anejo", "Requerido", "Acciones"].map((h) => (
              <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "12px" }}>Evidencia de Titularidad</td>
            <td style={{ padding: "12px", color: "#999" }}>Pending</td>
            <td style={{ padding: "12px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#38a169" }} />
            </td>
            <td style={{ padding: "12px" }}>
              <button style={{ border: "1px solid #ccc", borderRadius: "3px", backgroundColor: "#fff", padding: "4px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "4px" }}>
                Acciones
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Step 8: Finish
function Step8() {
  return (
    <div style={{ padding: "40px 24px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start", marginBottom: "30px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Terminar</span>
      </div>
      <div style={{ backgroundColor: "#f0f4f2", borderRadius: "8px", padding: "40px", marginBottom: "24px" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>El proyecto ha sido creado correctamente</p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Retroceder
        </button>
        <button style={{ ...btnStyle, backgroundColor: "#1a3c34" }}>
          Ir a crear el permiso
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </button>
      </div>
    </div>
  );
}

// Main Wizard
export default function PermisoWizard() {
  const [step, setStep] = useState(0);

  const steps = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8];
  const CurrentStep = steps[step];

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>Proyecto</span>
        </div>
      </div>

      <Stepper currentStep={step} />

      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff" }}>
        <CurrentStep />
      </div>

      {step < 7 ? (
        <WizardButtons
          currentStep={step}
          onPrev={() => setStep(Math.max(0, step - 1))}
          onNext={() => setStep(Math.min(7, step + 1))}
        />
      ) : null}
    </div>
  );
}
