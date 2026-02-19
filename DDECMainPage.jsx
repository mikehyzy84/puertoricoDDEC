import { useState } from "react";

export default function DDECMainPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [activeStatus, setActiveStatus] = useState("No Pagados/No Sometidos");

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      
      {/* ══════ NAVBAR ══════ */}
      <div style={{
        backgroundColor: "#1a3c34",
        backgroundImage: "linear-gradient(to right, #1a3c34, #1e4a3f, #1a3c34)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "42px",
        fontSize: "13px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NavLink label="Mi Bandeja">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </NavLink>
          <NavLink label="Help Desk (HDS)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </NavLink>
          <NavLink label="Menú">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </NavLink>
          <span style={{ textDecoration: "underline", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "3px" }}>
            Solicitante
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <NavLink label="Salir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </NavLink>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <div style={{ position: "absolute", top: "-6px", right: "-8px", backgroundColor: "#e53e3e", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "9px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>0</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>apaviavidal@gmail.com</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: "14px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#8B4513", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #DAA520" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#DAA520" stroke="#DAA520" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: "7px", letterSpacing: "0.5px", opacity: 0.7 }}>OFICINA DE</div>
              <div style={{ fontSize: "15px", fontWeight: "bold", letterSpacing: "2px", fontFamily: "Georgia, serif" }}>GERENCIA</div>
              <div style={{ fontSize: "9px", fontWeight: "bold", letterSpacing: "0.5px" }}>DE PERMISOS</div>
              <div style={{ fontSize: "6px", opacity: 0.5 }}>GOBIERNO DE PUERTO RICO</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ RADICAR SECTION ══════ */}
      <div style={{ backgroundColor: "#e8f0ee", borderBottom: "1px solid #ccc", padding: "18px 24px 22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#c2703a" stroke="#c2703a" strokeWidth="1"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Radicar</span>
          </div>
          <button style={{ padding: "6px 14px", border: "1px solid #aaa", borderRadius: "3px", backgroundColor: "#fff", fontSize: "12px", cursor: "pointer", fontFamily: "Arial" }}>
            Permisos, Incentivos ▾
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <RadicarButton label="Permisos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          </RadicarButton>
          <RadicarButton label="Solicitudes">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </RadicarButton>
          <RadicarButton label="Consultas">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </RadicarButton>
          <RadicarButton label="Querellas">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </RadicarButton>
          <RadicarButton label="Incentivos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </RadicarButton>
        </div>
        <div>
          <RadicarButton label="Todos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </RadicarButton>
        </div>
      </div>

      {/* ══════ CONTENT ══════ */}
      <div style={{ padding: "20px 24px" }}>

        {/* SOLICITUDES DE TRÁMITES */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#2b8a7a" stroke="#2b8a7a" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{ fontSize: "15px", fontWeight: "bold" }}>Solicitudes de Trámites</span>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "16px", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              <FilterBtn label="Todos" active={activeFilter === "Todos"} onClick={() => setActiveFilter("Todos")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </FilterBtn>
              <FilterBtn label="Trámites Personales" active={activeFilter === "Trámites Personales"} onClick={() => setActiveFilter("Trámites Personales")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </FilterBtn>
              <FilterBtn label="Trámites de Compañía" active={activeFilter === "Trámites de Compañía"} onClick={() => setActiveFilter("Trámites de Compañía")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              </FilterBtn>
              <FilterBtn label="Trámites de Terceros" active={activeFilter === "Trámites de Terceros"} onClick={() => setActiveFilter("Trámites de Terceros")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </FilterBtn>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap" }}>
              <DateField label="Desde" />
              <DateField label="Hasta" />
              <div style={{ flex: 1, minWidth: "150px" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>Número de Trámite</div>
                <input type="text" style={{ width: "100%", border: "1px solid #ccc", borderRadius: "3px", padding: "7px 10px", fontSize: "13px", fontFamily: "Arial", outline: "none" }} />
              </div>
              <TealSearchBtn />
            </div>

            <div style={{ display: "flex", borderBottom: "2px solid #ddd", overflowX: "auto" }}>
              {["No Pagados/No Sometidos","Pagados/Sometidos","Continuación de Operación","Querellas Radicadas","Pendientes","Casos Aprot"].map((s) => (
                <button key={s} onClick={() => setActiveStatus(s)} style={{
                  background: "none", border: "none",
                  borderBottom: activeStatus === s ? "3px solid #b85c38" : "3px solid transparent",
                  padding: "9px 12px", fontSize: "12.5px",
                  fontWeight: activeStatus === s ? 700 : 400,
                  color: activeStatus === s ? "#b85c38" : "#666",
                  cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Arial",
                }}>{s}</button>
              ))}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {["Número Permiso","Última Modificación","Solicitante","Estado Actual","Acciones"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "12px", fontWeight: 700, color: "#333", borderBottom: "2px solid #333" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody><tr><td colSpan={5} style={{ padding: "60px 0" }} /></tr></tbody>
            </table>
          </div>
        </div>

        {/* PERFILES DE PROYECTOS */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#2b8a7a" stroke="#2b8a7a" strokeWidth="1"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>Perfiles de Proyectos</span>
            </div>
            <button style={{ backgroundColor: "#38a169", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Crear Proyecto
            </button>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "16px", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap" }}>
              <DateField label="Desde" />
              <DateField label="Hasta" />
              <div style={{ flex: 1, minWidth: "150px" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>Proyecto</div>
                <input type="text" style={{ width: "100%", border: "1px solid #ccc", borderRadius: "3px", padding: "7px 10px", fontSize: "13px", fontFamily: "Arial", outline: "none" }} />
              </div>
              <TealSearchBtn />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ backgroundColor: "#c2703a" }}>
                {["Nombre del Proyecto","Número de Proyecto","Fecha de Creación","Dueño del Proyecto","Dueño del Solar"].map((h) => (
                  <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody><tr><td colSpan={5} style={{ padding: "60px 0" }} /></tr></tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "12px", color: "#666" }}>
              <span>Mostrando 1 a 0 de 0 resultados</span>
              <button style={{ backgroundColor: "#e53e3e", color: "#fff", border: "none", borderRadius: "3px", padding: "4px 12px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ label, children }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "13px" }}>
      {children}
      <span>{label}</span>
    </span>
  );
}

function RadicarButton({ label, children }) {
  return (
    <div style={{
      backgroundColor: "#2b8a7a", color: "#fff", borderRadius: "8px",
      padding: "12px 16px", display: "inline-flex", alignItems: "center",
      gap: "8px", cursor: "pointer", minWidth: "120px", fontSize: "15px", fontWeight: 700,
    }}>
      <div style={{
        backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "5px",
        width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{children}</div>
      <span>{label}</span>
    </div>
  );
}

function FilterBtn({ label, active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 20px", border: active ? "2px solid #333" : "1px solid #bbb",
      borderRadius: "3px", backgroundColor: "#fff", color: "#333",
      fontSize: "13px", fontWeight: active ? 600 : 400, cursor: "pointer",
      fontFamily: "Arial", display: "flex", alignItems: "center", gap: "6px",
    }}>
      {children}
      {label}
    </button>
  );
}

function DateField({ label }) {
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        border: "1px solid #ccc", borderRadius: "3px",
        padding: "6px 10px", backgroundColor: "#fff", width: "150px",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style={{ fontSize: "13px", color: "#aaa" }}>mm/dd/yyyy</span>
      </div>
    </div>
  );
}

function TealSearchBtn() {
  return (
    <button style={{
      backgroundColor: "#2b8a7a", color: "#fff", border: "none",
      borderRadius: "4px", width: "36px", height: "36px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  );
}
