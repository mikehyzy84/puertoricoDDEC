"use client";

import { CheckCircle } from "lucide-react";

interface FinishProps {
  onPrevious: () => void;
}

export default function Finish({ onPrevious }: FinishProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center justify-center py-16">
        <CheckCircle className="h-16 w-16 text-[#2A9D8F]" />
        <h2 className="mt-6 text-xl font-semibold text-[#1B4332]">
          El proyecto ha sido creado correctamente
        </h2>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a42]"
        >
          Retroceder
        </button>
        <button
          type="button"
          onClick={() => {
            // Navigate to permit creation flow
          }}
          className="rounded-md bg-[#1B4332] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#15362a]"
        >
          Ir a crear el permiso
        </button>
      </div>
    </div>
  );
}
