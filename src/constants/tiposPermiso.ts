export const TIPOS_PERMISO_QUERELLA = [
  "Permiso de Uso",
  "Permiso de Construccion",
  "Permiso Uso y Construccion",
  "Permiso Rotulos Anuncio",
  "Permiso Antenas y Torres",
  "Movimiento Tierra",
  "Otro",
] as const;
export type TipoPermisoQuerella = (typeof TIPOS_PERMISO_QUERELLA)[number];
