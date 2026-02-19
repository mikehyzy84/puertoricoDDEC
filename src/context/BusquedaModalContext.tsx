"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface BusquedaModalState {
  isOpen: boolean;
  activeTab: string;
  openModal: (tab: string) => void;
  closeModal: () => void;
}

const BusquedaModalContext = createContext<BusquedaModalState | null>(null);

export function BusquedaModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Permisos");

  const openModal = useCallback((tab: string) => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <BusquedaModalContext.Provider value={{ isOpen, activeTab, openModal, closeModal }}>
      {children}
    </BusquedaModalContext.Provider>
  );
}

export function useBusquedaModal() {
  const ctx = useContext(BusquedaModalContext);
  if (!ctx) throw new Error("useBusquedaModal must be used within BusquedaModalProvider");
  return ctx;
}
