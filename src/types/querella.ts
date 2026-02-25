export interface QuerellaMunicipio {
  municipio: string;
}

export interface QuerellaInformacionGeneral {
  motivo: string;
  tipoPermiso: string;
  tipoPermisoOtro: string;
  detallesViolaciones: string;
  diaHoraViolaciones: string;
  nombreCompania: string;
  horarioOperacion: string;
  comentariosGenerales: string;
}

export interface QuerellaContacto {
  direccion1: string;
  direccion2: string;
  pais: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
  numeroCatastro: string;
}

export interface QuerellaDocumento {
  nombre: string;
  descripcion: string;
  requerido: boolean;
  archivo?: File;
}

export interface QuerellaFormData {
  municipio: QuerellaMunicipio;
  informacionGeneral: QuerellaInformacionGeneral;
  contacto: QuerellaContacto;
  documentos: QuerellaDocumento[];
}
