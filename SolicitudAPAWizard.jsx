import { useState } from "react";

// ═══════════════════════════════════════════
// SOLICITUD APA WIZARD - 5 Step Flow
// Autorización para emitir un Permiso Automático
// Matches screenshots pages 10-12
// ═══════════════════════════════════════════

const STEPS = [
  { label: "Municipio" },
  { label: "Información\nGeneral" },
  { label: "Anejos" },
  { label: "Resumen" },
  { label: "Someter" },
];

export default function SolicitudAPAWizard() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "6px" }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
          Autorización para emitir un Permiso Automático -
        </span>
      </div>

      <SStepper currentStep={step} />

      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff", padding: "20px 24px" }}>
        {step === 0 && <AStep1 />}
        {step === 1 && <AStep2 />}
        {step === 2 && <AStep3 />}
        {step === 3 && <AStep4 />}
        {step === 4 && <AStep5 />}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0" }}>
        {step > 0 && (
          <Btn color="#2D6A4F" onClick={() => setStep(step - 1)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Paso Anterior
          </Btn>
        )}
        <Btn color="#2b8a7a"><SvIcon /> Guardar</Btn>
        <Btn color="#2b8a7a"><SvIcon /> Guardar y Continuar</Btn>
        <Btn color="#c53030"><XIcon /> Cancelar</Btn>
        <Btn color="#718096" onClick={() => setStep(Math.min(4, step + 1))}>
          Siguiente Paso
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Btn>
      </div>
    </div>
  );
}

// Step 1: Municipio
function AStep1() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Seleccionar Municipio</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px" }}>En qué municipio se solicita el trámite:*</span>
        <select style={{ ...inputStyle, width: "200px" }}>
          <option>Guaynabo</option>
        </select>
      </div>
    </>
  );
}

// Step 2: Información General
function AStep2() {
  return (
    <>
      {/* Warning banner */}
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
        <FF label="Licencia:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FF>
        <FF label="Profesión:" required style={{ flex: 1 }}>
          <select style={inputStyle}>
            <option></option>
            <option>Arquitecto/a</option>
            <option>Ingeniero/a</option>
          </select>
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
        <FF label="Expedición de la colegiación:" required style={{ flex: 1 }}>
          <DateInput />
        </FF>
        <FF label="Expiración de la colegiación:" required style={{ flex: 1 }}>
          <DateInput />
        </FF>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FF label="Expedición de la licencia:" required style={{ flex: 1 }}>
          <DateInput />
        </FF>
        <FF label="Expiración de la licencia:" required style={{ flex: 1 }}>
          <DateInput />
        </FF>
      </div>

      <div style={{ backgroundColor: "#e8f4fd", border: "1px solid #b3d9f2", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#0c5460", lineHeight: 1.6 }}>
        Asegúrese de utilizar su correo electrónico personal, este será el único correo electrónico para los trámites subsiguientes de Permiso de Uso Único Automático y Permiso de Construcción Consolidado. La primera vez se deberá realizar la validación de sus credenciales.
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
        <input type="checkbox" style={{ accentColor: "#2b8a7a" }} />
        Certifico que la información ingresada es correcta.
      </label>
    </>
  );
}

// Step 3: Anejos (Documents)
function AStep3() {
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
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "10px 12px", fontSize: "13px" }}>Evidencia<br/>Colegiación</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>Evidencia de que se encuentra al día en sus cuotas (Copia de tarjeta de miembro activo).</td>
            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#999" }}>Pendiente</td>
            <td style={{ padding: "10px 12px" }}><GreenDot /></td>
            <td style={{ padding: "10px 12px" }}><AccionesBtn /></td>
          </tr>
          <tr style={{ borderBottom: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
            <td style={{ padding: "10px 12px", fontSize: "13px" }}>Licencia</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", color: "#666" }}>Licencia provista por el Departamento de Estado para ejercer la profesión.</td>
            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#999" }}>Pendiente</td>
            <td style={{ padding: "10px 12px" }}><GreenDot /></td>
            <td style={{ padding: "10px 12px" }}><AccionesBtn /></td>
          </tr>
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

// Step 4: Resumen
function AStep4() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Resumen de la Solicitud</h3>
      <p style={{ fontSize: "13px", color: "#666" }}>Revise la información antes de someter.</p>
    </div>
  );
}

// Step 5: Someter
function AStep5() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Someter Solicitud</h3>
      <p style={{ fontSize: "13px", color: "#666" }}>Confirme para someter la solicitud.</p>
    </div>
  );
}

// ═══════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════

function SStepper({ currentStep }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0" }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
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

function FF({ label, required, children, style: extra }) {
  return (
    <div style={{ marginBottom: "8px", ...extra }}>
      <label style={{ display: "block", fontSize: "13px", color: "#333", marginBottom: "3px" }}>{label}{required && <span style={{ color: "red" }}>*</span>}</label>
      {children}
    </div>
  );
}

function DateInput() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid #ccc", borderRadius: "3px", padding: "6px 10px", backgroundColor: "#fff" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span style={{ fontSize: "13px", color: "#aaa" }}>mm/dd/yyyy</span>
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

function Btn({ color, onClick, children }) {
  return <button onClick={onClick} style={{ color: "#fff", backgroundColor: color, border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "6px" }}>{children}</button>;
}
function SvIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>; }
function XIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }

const inputStyle = { width: "100%", border: "1px solid #ccc", borderRadius: "3px", padding: "8px 10px", fontSize: "13px", fontFamily: "Arial", outline: "none", boxSizing: "border-box" };
