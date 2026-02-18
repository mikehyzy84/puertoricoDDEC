"use client";

import { useState } from "react";
import { Search, CalendarDays } from "lucide-react";

const filterButtons = [
  "Todos",
  "Trámites Personales",
  "Trámites de Compañía",
  "Trámites de Terceros",
] as const;

const tabs = [
  "No Pagados/No Sometidos",
  "Pagados/Sometidos",
  "Continuación de Operación",
  "Querellas Radicadas",
  "Pendientes",
  "Casos Aprot.",
] as const;

const columns = [
  "Número Permiso",
  "Última Modificación",
  "Solicitante",
  "Estado Actual",
  "Acciones",
] as const;

export default function SolicitudesTramites() {
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [busqueda, setBusqueda] = useState("");

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-[#1B4332]">
        Solicitudes de Trámites
      </h2>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Filter buttons row */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3">
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date range + search row */}
        <div className="flex flex-wrap items-end gap-4 border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="desde"
              className="text-xs font-medium text-gray-500"
            >
              Desde
            </label>
            <div className="relative">
              <input
                id="desde"
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-[#2A9D8F] focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
              />
              <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="hasta"
              className="text-xs font-medium text-gray-500"
            >
              Hasta
            </label>
            <div className="relative">
              <input
                id="hasta"
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-[#2A9D8F] focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
              />
              <CalendarDays className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="numero-tramite"
              className="text-xs font-medium text-gray-500"
            >
              Número de Trámite
            </label>
            <div className="relative">
              <input
                id="numero-tramite"
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="h-9 w-56 rounded-md border border-gray-300 bg-white pl-3 pr-8 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#2A9D8F] focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
              />
              <Search className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
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

        {/* Data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#2D6A4F] text-white">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No se encontraron trámites.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
