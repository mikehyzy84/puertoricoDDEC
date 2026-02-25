export const ZONAS = ["Rural", "Urbano"] as const;
export type TipoZona = (typeof ZONAS)[number];
