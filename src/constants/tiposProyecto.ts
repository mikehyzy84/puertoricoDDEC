export const TIPOS_PROYECTO = [
  "Privado",
  "Alianza Público-Privada",
  "Público",
  "Público con Contratación Privada",
] as const;
export type TipoProyecto = (typeof TIPOS_PROYECTO)[number];

export const FONDOS_FEDERALES = [
  "Fondos CDBG-DR",
  "Fondos COR3/FEMA",
  "No aplica",
] as const;
export type FondosFederales = (typeof FONDOS_FEDERALES)[number];

export const DESIGNACIONES = [
  "Crítico",
  "Estratégico",
  "No aplica",
] as const;
export type Designacion = (typeof DESIGNACIONES)[number];

// Re-export zona types for convenience
export { ZONAS, type TipoZona } from "./zonas";
