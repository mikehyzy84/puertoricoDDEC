"use client";

import { useState } from "react";
import { Search, CalendarDays, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const columns = [
  "Nombre del Proyecto",
  "Número de Proyecto",
  "Fecha de Creación",
  "Dueño del Proyecto",
  "Dueño del Solar",
] as const;

export default function PerfilesProyectos() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [busqueda, setBusqueda] = useState("");

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1B4332]">
          Perfiles de Proyectos
        </h2>
        <button className="flex items-center gap-1.5 rounded-md bg-[#2D6A4F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#245a42]">
          <Plus className="h-4 w-4" />
          Crear Proyecto
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Date range + search row */}
        <div className="flex flex-wrap items-end gap-4 border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="proy-desde"
              className="text-xs font-medium text-gray-500"
            >
              Desde
            </label>
            <div className="relative">
              <input
                id="proy-desde"
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
              htmlFor="proy-hasta"
              className="text-xs font-medium text-gray-500"
            >
              Hasta
            </label>
            <div className="relative">
              <input
                id="proy-hasta"
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
              htmlFor="proy-busqueda"
              className="text-xs font-medium text-gray-500"
            >
              Proyecto
            </label>
            <div className="relative">
              <input
                id="proy-busqueda"
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
                  No se encontraron proyectos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            Mostrando 1 a 0 de 0 resultados
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="rounded-md border border-gray-300 p-1.5 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded-md border border-[#2D6A4F] bg-[#2D6A4F] px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button
              disabled
              className="rounded-md border border-gray-300 p-1.5 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
