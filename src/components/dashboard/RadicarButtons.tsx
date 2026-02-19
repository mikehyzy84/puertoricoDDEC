"use client";

import { useState } from "react";
import {
  FolderOpen,
  FileText,
  MessageSquareMore,
  Building,
  BadgeDollarSign,
  LayoutGrid,
} from "lucide-react";
import SearchModal, {
  type ModalTab,
} from "@/components/shared/SearchModal";
import type { LucideIcon } from "lucide-react";

interface RadicarItem {
  label: string;
  icon: LucideIcon;
  color: "orange" | "teal";
  tab: ModalTab;
}

const mainRow: RadicarItem[] = [
  { label: "Permisos", icon: FolderOpen, color: "orange", tab: "Permisos" },
  { label: "Solicitudes", icon: FileText, color: "teal", tab: "Solicitudes" },
  { label: "Consultas", icon: MessageSquareMore, color: "teal", tab: "Consultas" },
  { label: "Querellas", icon: Building, color: "orange", tab: "Todos" },
  { label: "Incentivos", icon: BadgeDollarSign, color: "teal", tab: "Incentivos" },
];

const todosItem: RadicarItem = {
  label: "Todos",
  icon: LayoutGrid,
  color: "orange",
  tab: "Todos",
};

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

function RadicarButton({
  item,
  onClick,
}: {
  item: RadicarItem;
  onClick: () => void;
}) {
  const styles = colorStyles[item.color];
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`${styles.bg} ${styles.hover} ${styles.ring} flex w-[140px] items-center gap-2.5 rounded-lg px-3 py-3 text-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
      <span className="text-sm font-semibold">{item.label}</span>
    </button>
  );
}

export default function RadicarButtons() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("Todos");

  function openModal(tab: ModalTab) {
    setModalTab(tab);
    setModalOpen(true);
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-[#1B4332]">Radicar</h2>

      {/* Row 1: 5 main buttons */}
      <div className="flex flex-wrap gap-3">
        {mainRow.map((item) => (
          <RadicarButton
            key={item.label}
            item={item}
            onClick={() => openModal(item.tab)}
          />
        ))}
      </div>

      {/* Row 2: Todos aligned left */}
      <div className="mt-3 flex">
        <RadicarButton
          item={todosItem}
          onClick={() => openModal(todosItem.tab)}
        />
      </div>

      <SearchModal
        open={modalOpen}
        defaultTab={modalTab}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
