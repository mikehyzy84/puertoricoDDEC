import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { BusquedaModalProvider } from "@/context/BusquedaModalContext";
import Navbar from "@/components/layout/Navbar";
import GlobalBusquedaModal from "@/components/GlobalBusquedaModal";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gerencia de Permisos — DDEC",
  description: "Sistema de Gerencia de Permisos del Departamento de Desarrollo Económico y Comercio de Puerto Rico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BusquedaModalProvider>
          <Navbar />
          {children}
          <GlobalBusquedaModal />
        </BusquedaModalProvider>
      </body>
    </html>
  );
}
