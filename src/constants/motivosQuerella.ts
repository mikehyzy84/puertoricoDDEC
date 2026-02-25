export const MOTIVOS_QUERELLA = [
  "Ausencia de Permiso Requerido",
  "Incumplimiento con los términos del Permiso",
  "Permiso en incumplimiento con la ley y/o reglamento",
  "Con respecto al Profesional o Inspector Autorizado",
] as const;
export type MotivoQuerella = (typeof MOTIVOS_QUERELLA)[number];
