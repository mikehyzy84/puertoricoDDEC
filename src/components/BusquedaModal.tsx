"use client";

import { useState } from "react";
import Link from "next/link";

interface BusquedaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

interface ListItem {
  code: string;
  name: string;
  desc: string;
  route: string;
}

export default function BusquedaModal({ isOpen, onClose, initialTab = "Permisos" }: BusquedaModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const tabs = ["Permisos", "Solicitudes", "Consultas", "Incentivos", "Todos"];

  const permisosItems: ListItem[] = [
    { code: "", name: "Permiso de Construcción", desc: "Permiso para construcción nueva, remodelación o demolición", route: "/permisos/nuevo" },
    { code: "", name: "Permiso de Uso", desc: "Permiso de uso para establecimientos comerciales", route: "/permisos/nuevo" },
  ];

  const solicitudesItems: ListItem[] = [
    { code: "APA", name: "Autorización para emitir un Permiso Automático", desc: "Autorización para emitir un Permiso Automático", route: "/solicitudes/apa" },
    { code: "APS", name: "Aprobación de Planos Seguros", desc: "Aprobación de Planos Seguros", route: "/solicitudes/aps" },
    { code: "ASP", name: "Aprobación de Sistema o Producto", desc: "Aprobación de Sistema o Producto", route: "/solicitudes/asp" },
    { code: "CER", name: "Certificación de Equipos de Energía Renovable", desc: "Certificación de Equipos de Energía Renovable", route: "/solicitudes/cer" },
    { code: "CIR", name: "Certificado Instalador Renovable", desc: "Certificado Instalador Renovable", route: "/solicitudes/cir" },
  ];

  const consultasItems: ListItem[] = [
    { code: "", name: "Consultas Discrecionales", desc: "Este producto incluye las Consultas de Construcción (CCO), Consultas de Ubicación (CUB) y Variación a Lotificación (LOT)", route: "/consultas/discrecionales" },
    { code: "PCA", name: "Pre-Consulta Arqueología Conservación Histórica", desc: "Pre-Consulta Arqueología Conservación Histórica", route: "/consultas/pca" },
    { code: "PCD", name: "Pre-Consulta Departamento de Evaluación de Cumplimiento Ambiental", desc: "Pre-Consulta Departamento de Evaluación de Cumplimiento Ambiental", route: "/consultas/pcd" },
    { code: "PCE", name: "Pre-Consulta – Edificabilidad", desc: "Pre-Consulta – Edificabilidad", route: "/consultas/pce" },
    { code: "PCI", name: "Pre-Consulta Infraestructura", desc: "Pre-Consulta Infraestructura", route: "/consultas/pci" },
  ];

  const getItems = (): ListItem[] => {
    switch (activeTab) {
      case "Permisos": return permisosItems;
      case "Solicitudes": return solicitudesItems;
      case "Consultas": return consultasItems;
      case "Todos": return [...permisosItems, ...solicitudesItems, ...consultasItems];
      default: return solicitudesItems;
    }
  };

  const items = getItems().filter(
    (item) => search === "" || item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: "8px", width: "700px",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: "#333" }}>Búsqueda de Permisos</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Tab links */}
              <div style={{ display: "flex", gap: "14px", fontSize: "13px" }}>
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "13px", fontFamily: "Arial",
                      color: activeTab === t ? "#333" : "#666",
                      fontWeight: activeTab === t ? 700 : 400,
                      textDecoration: activeTab === t ? "underline" : "none",
                      textUnderlineOffset: "4px",
                      padding: "0",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Close button */}
              <button onClick={onClose} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "20px", color: "#999", padding: "0", lineHeight: 1,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Search input */}
          <div style={{
            border: "1px solid #ccc", borderRadius: "4px", padding: "8px 12px",
            marginBottom: "16px", display: "flex", alignItems: "center",
          }}>
            <input
              type="text"
              placeholder="Escriba una palabra clave"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none", outline: "none", fontSize: "14px", flex: 1,
                fontFamily: "Arial", color: "#666",
              }}
            />
          </div>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 20px 24px" }}>
          {items.map((item, i) => (
            <div
              key={`${item.code}-${item.name}-${i}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid #eee",
                backgroundColor: i % 2 === 1 ? "#f9f9f9" : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                {/* Icon */}
                <div style={{
                  backgroundColor: activeTab === "Consultas" && item.code === "" ? "#eee" : "#2b8a7a",
                  borderRadius: "6px", width: "44px", height: "44px",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {activeTab === "Consultas" && item.code === "" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#333", marginBottom: "2px" }}>
                    {item.code ? `${item.code} - ${item.name}` : item.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#777" }}>{item.desc}</div>
                </div>
              </div>
              <Link
                href={item.route}
                onClick={onClose}
                style={{
                  border: "1px solid #999", borderRadius: "3px",
                  backgroundColor: "#fff", padding: "6px 16px",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "Arial", color: "#333", whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                RADICAR
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
