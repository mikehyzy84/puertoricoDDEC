import { useState } from "react";

// ═══════════════════════════════════════════
// QUERELLA WIZARD - 6 Step Flow
// Matches screenshots pages 15-18
// ═══════════════════════════════════════════

const STEPS = [
  { label: "Municipio", icon: "building" },
  { label: "Información\nGeneral", icon: "info" },
  { label: "Contacto", icon: "contact" },
  { label: "Anejos", icon: "doc" },
  { label: "Resumen", icon: "list" },
  { label: "Someter", icon: "send" },
];

export default function QuerellaWizard() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>Solicitud de Radicación de Querellas -</span>
        </div>
      </div>

      <QStepper currentStep={step} steps={STEPS} />

      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff", padding: "20px 24px" }}>
        {step === 0 && <QStep1 />}
        {step === 1 && <QStep2 />}
        {step === 2 && <QStep3 />}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0" }}>
        {step > 0 && (
          <Btn color="#2D6A4F" onClick={() => setStep(step - 1)}>
            <LeftArrow /> Paso Anterior
          </Btn>
        )}
        <Btn color="#2b8a7a">
          <SaveIcon /> Guardar
        </Btn>
        <Btn color="#2b8a7a">
          <SaveIcon /> Guardar y Continuar
        </Btn>
        <Btn color="#c53030">
          <XIcon /> Cancelar
        </Btn>
        <Btn color="#718096" onClick={() => setStep(Math.min(5, step + 1))}>
          Siguiente Paso <RightArrow />
        </Btn>
      </div>
    </div>
  );
}

function QStep1() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Seleccionar Municipio</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px" }}>¿En qué municipio se encuentra la propiedad de la querella?</span>
        <select style={inputStyle}>
          <option>Seleccione un municipio</option>
        </select>
      </div>
    </>
  );
}

function QStep2() {
  return (
    <>
      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Información General de la Querella</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Motivo de la querella:<span style={{ color: "red" }}>*</span></div>
        {["Ausencia de Permiso Requerido", "Incumplimiento con los términos del Permiso", "Permiso en incumplimiento con la ley y/o reglamento", "Con respecto al Profesional o Inspector Autorizado"].map((m) => (
          <label key={m} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", marginBottom: "6px", cursor: "pointer" }}>
            <input type="radio" name="motivo" style={{ accentColor: "#2b8a7a" }} /> {m}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "4px" }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Tipo de Permiso
          </div>
          {["Permiso de Uso", "Permiso de Construccion", "Permiso Uso y Construccion", "Permiso Rotulos Anuncio", "Permiso Antenas y Torres", "Movimiento Tierra", "Otro"].map((t) => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", marginBottom: "5px", cursor: "pointer" }}>
              <input type="radio" name="tipoPermiso" style={{ accentColor: "#2b8a7a" }} /> {t}
            </label>
          ))}
          {/* Otro text field */}
          <input type="text" style={{ ...inputStyle, marginTop: "4px" }} />
        </div>

        <div style={{ flex: 1 }}>
          <FField label="Detalles Breves sobre las Condiciones que se Violentan:" required>
            <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
          </FField>
          <FField label="Día y hora en donde aparentemente se realizan violaciones al código:" required>
            <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
          </FField>
        </div>
      </div>

      <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>Información adicional de la querella</h4>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FField label="Nombre de la compañía o negocio:" style={{ flex: 1 }}>
          <input type="text" style={inputStyle} />
        </FField>
        <FField label="Horario de operación:" style={{ flex: 1 }}>
          <input type="text" style={inputStyle} />
        </FField>
      </div>
      <FField label="Comentarios generales:" required>
        <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} />
      </FField>
    </>
  );
}

function QStep3() {
  return (
    <>
      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Dirección física de la propiedad objeto de la querella: (Lugar donde aparentemente ocurrió la violación)</h3>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FField label="Dirección 1:" required style={{ flex: 1 }}><input type="text" style={inputStyle} /></FField>
        <FField label="Dirección 2:" style={{ flex: 1 }}><input type="text" style={inputStyle} /></FField>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <FField label="País:" required style={{ flex: 1 }}><select style={inputStyle}><option>United States</option></select></FField>
        <FField label="Estado:" required style={{ flex: 1 }}><select style={inputStyle}><option>Puerto Rico (PR)</option></select></FField>
        <FField label="Ciudad:" style={{ flex: 1 }}><select style={inputStyle}><option>Seleccione...</option></select></FField>
        <FField label="Código postal:" style={{ width: "120px" }}><input type="text" style={inputStyle} /></FField>
      </div>

      {/* Catastro search - same as permiso */}
      <div style={{ backgroundColor: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: "4px", padding: "12px 16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#333" }}>
          Identifique la localización con una (1) de las siguientes opciones:
        </div>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", color: "#555", lineHeight: 1.6 }}>
          <li>Número de catastro</li>
          <li>Coordenadas Geográficas o las coordenadas Lambert</li>
          <li>Seleccionando la ubicación o parcela en el mapa a continuación (buscar sobre el mapa)</li>
        </ul>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>Número Catastro:</span>
        <input type="text" placeholder="000-000-000-00" style={{ ...inputStyle, flex: 1 }} />
        <SBtn />
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════

function QStepper({ currentStep, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: i <= currentStep ? "#2b8a7a" : "#ccc",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </div>
            <div style={{ fontSize: "10px", textAlign: "center", marginTop: "6px", fontWeight: i === currentStep ? 700 : 400, color: i <= currentStep ? "#333" : "#999", whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</div>
          </div>
          {i < steps.length - 1 && <div style={{ width: "40px", height: "2px", backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc", marginTop: "20px" }} />}
        </div>
      ))}
    </div>
  );
}

function FField({ label, required, children, style: extra }) {
  return (
    <div style={{ marginBottom: "10px", ...extra }}>
      {label && <label style={{ display: "block", fontSize: "13px", color: "#333", marginBottom: "3px" }}>{label}{required && <span style={{ color: "red" }}>*</span>}</label>}
      {children}
    </div>
  );
}

function Btn({ color, onClick, children }) {
  return (
    <button onClick={onClick} style={{ color: "#fff", backgroundColor: color, border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "6px" }}>
      {children}
    </button>
  );
}

function SBtn() {
  return (
    <button style={{ backgroundColor: "#2b8a7a", color: "#fff", border: "none", borderRadius: "4px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  );
}

const inputStyle = { width: "100%", border: "1px solid #ccc", borderRadius: "3px", padding: "8px 10px", fontSize: "13px", fontFamily: "Arial", outline: "none", boxSizing: "border-box" };

function LeftArrow() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>; }
function RightArrow() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>; }
function SaveIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>; }
function XIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>; }
