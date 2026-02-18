"use client";

import { useState } from "react";
import {
  FolderOpen,
  FileText,
  MessageSquareMore,
  ShieldAlert,
  BadgeDollarSign,
  LayoutGrid,
} from "lucide-react";
import SearchModal, {
  type ModalTab,
} from "@/components/shared/SearchModal";

const radicarItems = [
  {
    label: "Permisos",
    icon: FolderOpen,
    color: "orange" as const,
    tab: "Permisos" as ModalTab,
  },
  {
    label: "Solicitudes",
    icon: FileText,
    color: "teal" as const,
    tab: "Solicitudes" as ModalTab,
  },
  {
    label: "Consultas",
    icon: MessageSquareMore,
    color: "teal" as const,
    tab: "Consultas" as ModalTab,
  },
  {
    label: "Querellas",
    icon: ShieldAlert,
    color: "orange" as const,
    tab: "Todos" as ModalTab,
  },
  {
    label: "Incentivos",
    icon: BadgeDollarSign,
    color: "teal" as const,
    tab: "Incentivos" as ModalTab,
  },
  {
    label: "Todos",
    icon: LayoutGrid,
    color: "orange" as const,
    tab: "Todos" as ModalTab,
  },
];

const colorStyles = {
  orange: {
    bg: "bg-[#E76F51]",
    hover: "hover:bg-[#d45d3f]",
    ring: "focus-visible:ring-[#E76F51]",
  },
  teal: {
    bg: "bg-[#2A9D8F]",
    hover: "hover:bg-[#238577]",
    ring: "focus-visible:ring-[#2A9D8F]",
  },
};

export default function RadicarButtons() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("Todos");

  function openModal(tab: ModalTab) {
    setModalTab(tab);
    setModalOpen(true);
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#1B4332] mb-4">Radicar</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {radicarItems.map((item) => {
          const styles = colorStyles[item.color];
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => openModal(item.tab)}
              className={`${styles.bg} ${styles.hover} ${styles.ring} flex flex-col items-center justify-center gap-3 rounded-xl px-4 py-6 text-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            >
              <Icon className="h-10 w-10" strokeWidth={1.5} />
              <span className="text-sm font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <SearchModal
        open={modalOpen}
        defaultTab={modalTab}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
