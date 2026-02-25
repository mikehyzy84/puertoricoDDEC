import { z } from "zod";

const required = "Este campo es requerido";

export const querellaMunicipioSchema = z.object({
  municipio: z.string().min(1, "Seleccione un municipio"),
});

export const querellaInfoGeneralSchema = z.object({
  motivo: z.string().min(1, required),
  tipoPermiso: z.string().min(1, required),
  tipoPermisoOtro: z.string().optional(),
  detallesViolaciones: z.string().min(1, required),
  diaHoraViolaciones: z.string().min(1, required),
  nombreCompania: z.string().optional(),
  horarioOperacion: z.string().optional(),
  comentariosGenerales: z.string().min(1, required),
});

export const querellaContactoSchema = z.object({
  direccion1: z.string().min(1, required),
  direccion2: z.string().optional(),
  pais: z.string().min(1, required),
  estado: z.string().min(1, required),
  ciudad: z.string().optional(),
  codigoPostal: z.string().optional(),
  numeroCatastro: z.string().optional(),
});

export const querellaStepSchemas = [
  querellaMunicipioSchema,
  querellaInfoGeneralSchema,
  querellaContactoSchema,
  z.object({}), // anejos
  z.object({}), // resumen
  z.object({}), // someter
] as const;

export const querellaStepKeys = [
  "municipio",
  "informacionGeneral",
  "contacto",
  "documentos",
  "resumen",
  "someter",
] as const;
