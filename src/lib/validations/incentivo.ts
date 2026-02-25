import { z } from "zod";

const required = "Este campo es requerido";

export const incentivoTipoSchema = z.object({
  tipoIncentivo: z.string().min(1, "Seleccione un tipo de incentivo"),
});

export const incentivoSolicitanteSchema = z.object({
  nombre: z.string().min(1, required),
  apellido: z.string().min(1, required),
  ciudadania: z.string().min(1, required),
  tipoIdentificacion: z.string().min(1, required),
  identificacion: z.string().min(1, required),
  telefono: z.string().min(1, required),
  email: z.string().email("Correo electrónico inválido"),
  direccion: z.string().min(1, required),
  municipio: z.string().min(1, "Seleccione un municipio"),
  codigoPostal: z.string().min(1, required),
});

export const incentivoNegocioSchema = z.object({
  nombreNegocio: z.string().min(1, required),
  codigoNAICS: z.string().min(1, required),
  registroComerciante: z.string().min(1, required),
  municipio: z.string().min(1, "Seleccione un municipio"),
  fechaEstablecimiento: z.string().min(1, required),
  numeroEmpleados: z.string().min(1, required),
  volumenVentasAnuales: z.string().min(1, required),
});

export const incentivoDetallesSchema = z.object({
  descripcion: z.string().min(1, required),
  impactoEconomicoEsperado: z.string().min(1, required),
  empleosCrear: z.string().min(1, required),
  montoInversion: z.string().min(1, required),
});

export const incentivoStepSchemas = [
  incentivoTipoSchema,
  incentivoSolicitanteSchema,
  incentivoNegocioSchema,
  incentivoDetallesSchema,
  z.object({}), // documentos
  z.object({}), // resumen
  z.object({}), // someter
] as const;

export const incentivoStepKeys = [
  "tipoIncentivo",
  "solicitante",
  "negocio",
  "detallesProyecto",
  "documentos",
  "resumen",
  "someter",
] as const;
