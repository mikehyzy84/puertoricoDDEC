"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Search,
  FolderOpen,
  FileText,
  MessageSquareMore,
  ShieldAlert,
  BadgeDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export const modalTabs = [
  "Permisos",
  "Solicitudes",
  "Consultas",
  "Incentivos",
  "Todos",
] as const;

export type ModalTab = (typeof modalTabs)[number];

interface SearchItem {
  code: string;
  label: string;
  icon: LucideIcon;
  href: string;
  category: Exclude<ModalTab, "Todos">;
}

const items: SearchItem[] = [
  /* ---- Permisos ---- */
  { code: "PU", label: "Permiso de Uso", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },
  { code: "PC", label: "Permiso de Construcción", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },
  { code: "PUC", label: "Permiso de Uso y Construcción", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },
  { code: "PRA", label: "Permiso de Rótulos y Anuncios", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },
  { code: "PAT", label: "Permiso de Antenas y Torres", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },
  { code: "MT", label: "Movimiento de Tierra", icon: FolderOpen, href: "/permisos/nuevo", category: "Permisos" },

  /* ---- Solicitudes ---- */
  { code: "APA", label: "Autorización para emitir un Permiso Automático", icon: FileText, href: "/solicitudes/apa", category: "Solicitudes" },
  { code: "APS", label: "Aprobación de Planos Seguros", icon: FileText, href: "/solicitudes/aps", category: "Solicitudes" },
  { code: "ASP", label: "Aprobación de Sistema o Producto", icon: FileText, href: "/solicitudes/asp", category: "Solicitudes" },
  { code: "CER", label: "Certificación de Equipos de Energía Renovable", icon: FileText, href: "/solicitudes/cer", category: "Solicitudes" },
  { code: "CIR", label: "Certificado Instalador Renovable", icon: FileText, href: "/solicitudes/cir", category: "Solicitudes" },

  /* ---- Consultas ---- */
  { code: "CCO", label: "Consulta de Caso de Obra (Discrecional)", icon: MessageSquareMore, href: "/consultas/cco", category: "Consultas" },
  { code: "CUB", label: "Consulta de Uso de Bienes (Discrecional)", icon: MessageSquareMore, href: "/consultas/cub", category: "Consultas" },
  { code: "LOT", label: "Consulta de Lotificación (Discrecional)", icon: MessageSquareMore, href: "/consultas/lot", category: "Consultas" },
  { code: "PCA", label: "Pre-Consulta Arqueología Conservación Histórica", icon: MessageSquareMore, href: "/consultas/pca", category: "Consultas" },
  { code: "PCD", label: "Pre-Consulta Evaluación de Cumplimiento Ambiental", icon: MessageSquareMore, href: "/consultas/pcd", category: "Consultas" },
  { code: "PCE", label: "Pre-Consulta Edificabilidad", icon: MessageSquareMore, href: "/consultas/pce", category: "Consultas" },
  { code: "PCI", label: "Pre-Consulta Infraestructura", icon: MessageSquareMore, href: "/consultas/pci", category: "Consultas" },

  /* ---- Incentivos ---- */
  { code: "JE", label: "Joven Empresario", icon: BadgeDollarSign, href: "/incentivos/joven-empresario", category: "Incentivos" },
  { code: "RII", label: "Residente Inversionista Individual", icon: BadgeDollarSign, href: "/incentivos/residente-inversionista", category: "Incentivos" },
  { code: "ES", label: "Exportación de Servicios", icon: BadgeDollarSign, href: "/incentivos/exportacion-servicios", category: "Incentivos" },
  { code: "MAN", label: "Manufactura", icon: BadgeDollarSign, href: "/incentivos/manufactura", category: "Incentivos" },
  { code: "ER", label: "Energía Renovable", icon: BadgeDollarSign, href: "/incentivos/energia-renovable", category: "Incentivos" },
  { code: "TUR", label: "Turismo", icon: BadgeDollarSign, href: "/incentivos/turismo", category: "Incentivos" },
  { code: "AGR", label: "Agricultura", icon: BadgeDollarSign, href: "/incentivos/agricultura", category: "Incentivos" },
  { code: "IC", label: "Industria Cinematográfica", icon: BadgeDollarSign, href: "/incentivos/industria-cinematografica", category: "Incentivos" },
  { code: "IYC", label: "Investigadores y Científicos", icon: BadgeDollarSign, href: "/incentivos/investigadores-cientificos", category: "Incentivos" },
  { code: "PDR", label: "Profesional de Difícil Reclutamiento", icon: BadgeDollarSign, href: "/incentivos/profesional-dificil-reclutamiento", category: "Incentivos" },
  { code: "EFI", label: "Entidades Financieras Internacionales", icon: BadgeDollarSign, href: "/incentivos/entidades-financieras", category: "Incentivos" },
  { code: "FCP", label: "Fondos de Capital Privado", icon: BadgeDollarSign, href: "/incentivos/fondos-capital-privado", category: "Incentivos" },
  { code: "ZO", label: "Zonas de Oportunidad", icon: BadgeDollarSign, href: "/incentivos/zonas-oportunidad", category: "Incentivos" },
];

/* A standalone Querellas entry that only shows in "Todos" */
const querellasItem: SearchItem = {
  code: "QUE",
  label: "Querella",
  icon: ShieldAlert,
  href: "/querellas",
  category: "Permisos", // unused for filtering — only appears in Todos
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SearchModalProps {
  open: boolean;
  defaultTab: ModalTab;
  onClose: () => void;
}

export default function SearchModal({
  open,
  defaultTab,
  onClose,
}: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>(defaultTab);
  const [query, setQuery] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Sync default tab when re-opened */
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
      setQuery("");
    }
  }, [open, defaultTab]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  /* Filter items */
  const baseItems =
    activeTab === "Todos"
      ? [...items, querellasItem]
      : items.filter((i) => i.category === activeTab);

  const filtered = query
    ? baseItems.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.code.toLowerCase().includes(query.toLowerCase()),
      )
    : baseItems;

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Panel */}
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1B4332]">
            Búsqueda de Permisos
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-5">
          {modalTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#2A9D8F] text-[#2A9D8F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#2A9D8F] focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
              autoFocus
            />
          </div>
        </div>

        {/* Items list */}
        <ul className="max-h-80 overflow-y-auto px-5 pb-5">
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-gray-400">
              No se encontraron resultados.
            </li>
          )}
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={`${item.category}-${item.code}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2D6A4F]/10 text-[#2D6A4F]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mr-2 text-xs font-bold text-[#2D6A4F]">
                    {item.code}
                  </span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <a
                  href={item.href}
                  className="shrink-0 rounded-md bg-[#2A9D8F] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#238577]"
                >
                  Radicar
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
