"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, ChevronDown, Upload, Eye, Trash2 } from "lucide-react";

interface DocumentosProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface DocumentRow {
  tipoAnejo: string;
  nombreAnejo: string;
  requerido: boolean;
}

const INITIAL_DOCUMENTS: DocumentRow[] = [
  {
    tipoAnejo: "Evidencia de Titularidad",
    nombreAnejo: "Pending",
    requerido: true,
  },
];

export default function Documentos({ onNext, onPrevious }: DocumentosProps) {
  const [documents] = useState<DocumentRow[]>(INITIAL_DOCUMENTS);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      {/* Section title */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
        <FileText className="h-5 w-5 text-[#2A9D8F]" />
        <h2 className="text-lg font-semibold text-[#1B4332]">Documentos</h2>
      </div>

      {/* Documents table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#1B4332] text-white">
              <th className="px-4 py-3 font-medium">Tipo de Anejo</th>
              <th className="px-4 py-3 font-medium">Nombre del Anejo</th>
              <th className="px-4 py-3 text-center font-medium">Requerido</th>
              <th className="px-4 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 even:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-700">{doc.tipoAnejo}</td>
                <td className="px-4 py-3 text-gray-500 italic">
                  {doc.nombreAnejo}
                </td>
                <td className="px-4 py-3 text-center">
                  {doc.requerido && (
                    <span
                      className="inline-block h-3 w-3 rounded-full bg-green-500"
                      title="Requerido"
                      aria-label="Requerido"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="relative inline-block" ref={openMenu === idx ? menuRef : undefined}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(openMenu === idx ? null : idx)
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Acciones
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {openMenu === idx && (
                      <div className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(null)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Upload className="h-4 w-4" />
                          Subir archivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenMenu(null)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                          Ver documento
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenMenu(null)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a42]"
        >
          Paso Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-[#2A9D8F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#238577]"
        >
          Siguiente Paso
        </button>
      </div>
    </div>
  );
}
