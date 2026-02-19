"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [solicitanteOpen, setSolicitanteOpen] = useState(false);

  return (
    <nav style={{ width: "100%", backgroundColor: "#1B4332", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 24px" }}>
        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", textDecoration: "none", fontSize: "12px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Mi Bandeja</span>
          </Link>

          <Link href="#" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", textDecoration: "none", fontSize: "12px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Help Desk (HDS)</span>
          </Link>

          <button style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "Arial" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <span>Menú</span>
          </button>

          {/* Solicitante dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSolicitanteOpen(!solicitanteOpen)}
              style={{ display: "flex", alignItems: "center", gap: "4px", color: "#fff", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "Arial" }}
            >
              <span>Solicitante</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {solicitanteOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setSolicitanteOpen(false)} />
                <div style={{ position: "absolute", left: 0, top: "100%", marginTop: "4px", width: "180px", backgroundColor: "#fff", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 50, padding: "4px 0" }}>
                  <button style={{ display: "block", width: "100%", padding: "8px 16px", textAlign: "left", fontSize: "12px", color: "#333", background: "none", border: "none", cursor: "pointer", fontFamily: "Arial" }}>Mi Perfil</button>
                  <button style={{ display: "block", width: "100%", padding: "8px 16px", textAlign: "left", fontSize: "12px", color: "#333", background: "none", border: "none", cursor: "pointer", fontFamily: "Arial" }}>Mis Compañías</button>
                </div>
              </>
            )}
          </div>

          <Link href="#" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", textDecoration: "none", fontSize: "12px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Salir</span>
          </Link>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Gear icon */}
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label="Configuración">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>

          {/* Bell with red badge */}
          <div style={{ position: "relative" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} aria-label="Notificaciones">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </button>
            <span style={{
              position: "absolute", top: "-6px", right: "-8px",
              backgroundColor: "#e53e3e", color: "#fff", fontSize: "9px", fontWeight: 700,
              borderRadius: "50%", width: "16px", height: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>0</span>
          </div>

          {/* Email */}
          <span style={{ fontSize: "12px", color: "#fff" }}>apaviavidal@gmail.com</span>

          {/* Gerencia de Permisos */}
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>GERENCIA DE PERMISOS</span>
        </div>
      </div>
    </nav>
  );
}
