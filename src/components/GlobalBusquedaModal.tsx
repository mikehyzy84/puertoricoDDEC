"use client";

import { useBusquedaModal } from "@/context/BusquedaModalContext";
import BusquedaModal from "@/components/BusquedaModal";

export default function GlobalBusquedaModal() {
  const { isOpen, activeTab, closeModal } = useBusquedaModal();
  return <BusquedaModal isOpen={isOpen} onClose={closeModal} initialTab={activeTab} />;
}
