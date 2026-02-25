export interface IncentivoSolicitante {
  nombre: string;
  apellido: string;
  ciudadania: string;
  tipoIdentificacion: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  municipio: string;
  codigoPostal: string;
}

export interface IncentivoNegocio {
  nombreNegocio: string;
  codigoNAICS: string;
  registroComerciante: string;
  municipio: string;
  fechaEstablecimiento: string;
  numeroEmpleados: string;
  volumenVentasAnuales: string;
}

export interface IncentivoDetallesProyecto {
  descripcion: string;
  impactoEconomicoEsperado: string;
  empleosCrear: string;
  montoInversion: string;
}

export interface IncentivoDocumento {
  nombre: string;
  descripcion: string;
  requerido: boolean;
  archivo?: File;
}

export interface IncentivoFormData {
  tipoIncentivo: string;
  solicitante: IncentivoSolicitante;
  negocio: IncentivoNegocio;
  detallesProyecto: IncentivoDetallesProyecto;
  documentos: IncentivoDocumento[];
}
