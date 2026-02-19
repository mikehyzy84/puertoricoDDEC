"use client";

import { useState } from "react";
import Link from "next/link";
import { useBusquedaModal } from "@/context/BusquedaModalContext";

export default function Navbar() {
  const [solicitanteOpen, setSolicitanteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useBusquedaModal();

  const menuItems = [
    { label: "Permisos", tab: "Permisos", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
    )},
    { label: "Aplicaciones", tab: "Solicitudes", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    )},
    { label: "Consultas", tab: "Consultas", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    )},
    { label: "Querellas", tab: "Querellas", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    )},
    { label: "Incentivos", tab: "Incentivos", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    )},
  ];

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

          {/* Menú dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSolicitanteOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fff", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "Arial" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              <span>Menú</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {menuOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
                <div style={{
                  position: "absolute", left: 0, top: "100%", marginTop: "4px",
                  width: "220px", backgroundColor: "#fff", borderRadius: "4px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 50, padding: "4px 0",
                }}>
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        openModal(item.tab);
                        setMenuOpen(false);
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "10px 16px", textAlign: "left",
                        fontSize: "13px", color: "#333", background: "none",
                        border: "none", cursor: "pointer", fontFamily: "Arial",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f7f5"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <span style={{ color: "#2b8a7a", display: "flex", alignItems: "center" }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Solicitante dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setSolicitanteOpen(!solicitanteOpen); setMenuOpen(false); }}
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

          {/* Gerencia de Permisos logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Government seal */}
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="#fff" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="42" stroke="#fff" strokeWidth="1" fill="none"/>
              <path d="M50 15 L53 25 L63 25 L55 31 L58 41 L50 35 L42 41 L45 31 L37 25 L47 25 Z" fill="#fff"/>
              <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">GERENCIA</text>
              <text x="50" y="68" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Arial">DE PERMISOS</text>
              <path d="M20 75 Q50 85 80 75" stroke="#fff" strokeWidth="1" fill="none"/>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>Gerencia</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>de Permisos</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
