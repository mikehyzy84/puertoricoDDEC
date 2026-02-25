export const TIPOS_INCENTIVO = [
  { id: "joven-empresario", nombre: "Joven Empresario", desc: "Exención contributiva para jóvenes empresarios (16-35 años), 100% exención contributiva hasta $500K, decreto de 3 años" },
  { id: "residente-inversionista", nombre: "Residente Inversionista Individual", desc: "Ley 60 Cap. 2, Subtítulo B — Inversionista individual residente" },
  { id: "exportacion-servicios", nombre: "Exportación de Servicios", desc: "Sec. 2031.01 — Incentivos para exportación de servicios" },
  { id: "manufactura", nombre: "Manufactura", desc: "Incentivos contributivos para manufactura" },
  { id: "energia-renovable", nombre: "Energía Renovable", desc: "Incentivos para proyectos de energía renovable" },
  { id: "turismo", nombre: "Turismo", desc: "Desarrollo turístico — créditos contributivos, exenciones de contribución sobre propiedad" },
  { id: "agricultura", nombre: "Agricultura", desc: "Incentivos para el sector agrícola" },
  { id: "industria-cinematografica", nombre: "Industria Cinematográfica", desc: "Créditos contributivos para la industria del cine" },
  { id: "investigadores-cientificos", nombre: "Investigadores y Científicos", desc: "Sec. 2021.04 — Incentivos para investigadores y científicos" },
  { id: "profesional-dificil-reclutamiento", nombre: "Profesional de Difícil Reclutamiento", desc: "Sec. 2021.02 — Profesionales de difícil reclutamiento" },
  { id: "entidades-financieras", nombre: "Entidades Financieras Internacionales", desc: "Sec. 2041.01 — Entidades financieras internacionales" },
  { id: "fondos-capital-privado", nombre: "Fondos de Capital Privado", desc: "Sec. 2041.03 — Fondos de capital privado" },
  { id: "zonas-oportunidad", nombre: "Zonas de Oportunidad", desc: "Sec. 6070.60 — Zonas de oportunidad" },
] as const;

export type TipoIncentivo = (typeof TIPOS_INCENTIVO)[number]["id"];
