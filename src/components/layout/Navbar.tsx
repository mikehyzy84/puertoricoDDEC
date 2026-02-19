"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  HelpCircle,
  Menu,
  ChevronDown,
  LogOut,
  Bell,
  User,
} from "lucide-react";

export default function Navbar() {
  const [solicitanteOpen, setSolicitanteOpen] = useState(false);

  return (
    <nav className="w-full bg-[#1B4332]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        {/* Left side links */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-white/80"
          >
            <Home className="h-4 w-4" />
            <span>Mi Bandeja</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-white/80"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help Desk (HDS)</span>
          </Link>

          <button className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-white/80">
            <Menu className="h-4 w-4" />
            <span>Menú</span>
          </button>

          {/* Solicitante dropdown */}
          <div className="relative">
            <button
              onClick={() => setSolicitanteOpen(!solicitanteOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-white/80"
            >
              <span>Solicitante</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {solicitanteOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSolicitanteOpen(false)}
                />
                <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  <button className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100">
                    Mi Perfil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100">
                    Mis Compañías
                  </button>
                </div>
              </>
            )}
          </div>

          <Link
            href="#"
            className="flex items-center gap-1.5 text-xs font-medium text-white transition-colors hover:text-white/80"
          >
            <LogOut className="h-4 w-4" />
            <span>Salir</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <button
            className="relative text-white transition-colors hover:text-white/80"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-white">
            <User className="h-4 w-4" />
            <span>apaviavidal@gmail.com</span>
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="text-xs font-semibold tracking-wide text-white">
              Gerencia de Permisos
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
