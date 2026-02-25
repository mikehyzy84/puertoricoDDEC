import { z } from "zod";

const required = "Este campo es requerido";

export const solicitudMunicipioSchema = z.object({
  municipio: z.string().min(1, "Seleccione un municipio"),
});

export const solicitudAPAInfoSchema = z.object({
  licencia: z.string().min(1, required),
  profesion: z.string().min(1, "Seleccione una profesión"),
  expedicionColegiacion: z.string().min(1, required),
  expiracionColegiacion: z.string().min(1, required),
  expedicionLicencia: z.string().min(1, required),
  expiracionLicencia: z.string().min(1, required),
  certificacion: z.boolean().refine((v) => v === true, { message: "Debe certificar la información" }),
});

export const solicitudAPSInfoSchema = z.object({
  descripcion: z.string().min(1, required),
  tipoPlano: z.string().min(1, required),
  notasAdicionales: z.string().optional(),
});

export const solicitudASPInfoSchema = z.object({
  nombreSistema: z.string().min(1, required),
  descripcion: z.string().min(1, required),
  fabricante: z.string().min(1, required),
  modelo: z.string().optional(),
  certificaciones: z.string().optional(),
});

export const solicitudCERInfoSchema = z.object({
  tipoEquipo: z.string().min(1, required),
  modelo: z.string().min(1, required),
  fabricante: z.string().min(1, required),
  capacidad: z.string().min(1, required),
});

export const solicitudCIRInfoSchema = z.object({
  licencia: z.string().min(1, required),
  tipoInstalacion: z.string().min(1, required),
  experiencia: z.string().min(1, required),
  certificacionesProfesionales: z.string().optional(),
});

export const solicitudCertificacionFinalSchema = z.object({
  certificacionFinal: z.boolean().refine((v) => v === true, { message: "Debe certificar la información para someter" }),
});
