import { z } from "zod";

const required = "Este campo es requerido";

export const proyectoActividadSchema = z.object({
  nombre: z.string().min(1, required),
  tipoZona: z.string().min(1, "Seleccione una zona"),
  tipoProyecto: z.string().min(1, "Seleccione un tipo"),
  fondosFederales: z.string().min(1, required),
  designacion: z.string().min(1, required),
  descripcion: z.string().min(1, required),
});

export const duenoProyectoSchema = z.object({
  tipoDueno: z.string().min(1, required),
  ciudadania: z.string().optional(),
  tipoId: z.string().optional(),
  identificacion: z.string().optional(),
  compania: z.string().optional(),
  tieneDecreto: z.string().optional(),
});

export const localizacionSchema = z.object({
  numeroCatastro: z.string().optional(),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
  lambertX: z.string().optional(),
  lambertY: z.string().optional(),
  catastroExt: z.string().optional(),
  zonaInundable: z.string().optional(),
  floodway: z.string().optional(),
  areaAproximada: z.string().optional(),
  calificacion: z.string().optional(),
  municipio: z.string().optional(),
  calificacionSobrepuesto: z.string().optional(),
  barrio: z.string().optional(),
  clasificacion: z.string().optional(),
  zonaSitioHistorico: z.string().optional(),
  coordenadas: z.string().optional(),
  usosPermiso: z.string().optional(),
  coordenadasNad83: z.string().optional(),
  sueloGeologico: z.string().optional(),
  calificacionesEfectivas: z.string().optional(),
});

export const catastrosAdicionalesSchema = z.object({
  cabidaPropiedad: z.string().min(1, required),
  unidadCabida: z.string().optional(),
  municipio: z.string().min(1, "Seleccione un municipio"),
  direccionFisica: z.string().optional(),
  tipoDireccion: z.string().min(1, required),
  codigoPostal: z.string().min(1, required),
  estado: z.string().optional(),
  puntoReferencia: z.string().optional(),
});

export const duenoSolarSchema = z.object({
  nombre: z.string().min(1, required),
  inicial: z.string().optional(),
  apellido: z.string().min(1, required),
  telefono: z.string().min(1, required),
  email: z.string().min(1, required),
  direccionLinea1: z.string().min(1, required),
  direccionLinea2: z.string().optional(),
  pais: z.string().min(1, required),
  estado: z.string().min(1, required),
  ciudad: z.string().min(1, required),
  codigoPostal: z.string().min(1, required),
});

export const arrendatarioSchema = z.object({
  tieneArrendatario: z.string().min(1, required),
});

// Step-indexed schemas for validation per step
export const permisoStepSchemas = [
  proyectoActividadSchema,
  duenoProyectoSchema,
  localizacionSchema,
  catastrosAdicionalesSchema,
  duenoSolarSchema,
  arrendatarioSchema,
  z.object({}), // documentos — no field validation, file presence checked separately
  z.object({}), // finish — no validation
] as const;

// Step keys matching PermisoFormData
export const permisoStepKeys = [
  "proyectoActividad",
  "duenoProyecto",
  "localizacion",
  "catastrosAdicionales",
  "duenoSolar",
  "arrendatario",
  "documentos",
  "finish",
] as const;
