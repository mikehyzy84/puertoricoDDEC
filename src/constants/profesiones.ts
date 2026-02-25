export const PROFESIONES = [
  "Arquitecto/a",
  "Ingeniero/a",
] as const;
export type Profesion = (typeof PROFESIONES)[number];
