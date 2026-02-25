export type TipoSolicitud = "APA" | "APS" | "ASP" | "CER" | "CIR";

export interface SolicitudAPA {
  municipio: string;
  licencia: string;
  profesion: string;
  expedicionColegiacion: string;
  expiracionColegiacion: string;
  expedicionLicencia: string;
  expiracionLicencia: string;
  certificacion: boolean;
}

export interface SolicitudAPS {
  municipio: string;
  descripcion: string;
  tipoPlano: string;
  notasAdicionales: string;
}

export interface SolicitudASP {
  municipio: string;
  nombreSistema: string;
  descripcion: string;
  fabricante: string;
  modelo: string;
  certificaciones: string;
}

export interface SolicitudCER {
  municipio: string;
  tipoEquipo: string;
  modelo: string;
  fabricante: string;
  capacidad: string;
}

export interface SolicitudCIR {
  municipio: string;
  licencia: string;
  tipoInstalacion: string;
  experiencia: string;
  certificacionesProfesionales: string;
}

export interface SolicitudDocument {
  nombre: string;
  descripcion: string;
  archivo: string;
  requerido: boolean;
}

export interface SolicitudWizardData {
  municipio: { municipio: string };
  informacionGeneral: Record<string, unknown>;
  documentos: SolicitudDocument[];
  certificacionFinal: boolean;
  sometido: boolean;
}
