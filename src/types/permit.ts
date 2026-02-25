export interface PermisoProyectoActividad {
  nombre: string;
  tipoZona: string;
  tipoProyecto: string;
  fondosFederales: string;
  designacion: string;
  descripcion: string;
}

export type TipoDueno = "usted" | "otra" | "company";

export interface PermisoDuenoProyecto {
  tipoDueno: TipoDueno;
  ciudadania: string;
  tipoId: string;
  identificacion: string;
  compania: string;
  tieneDecreto: string;
}

export interface PermisoLocalizacion {
  numeroCatastro: string;
  latitud: string;
  longitud: string;
  lambertX: string;
  lambertY: string;
  catastroExt: string;
  zonaInundable: string;
  floodway: string;
  areaAproximada: string;
  calificacion: string;
  municipio: string;
  calificacionSobrepuesto: string;
  barrio: string;
  clasificacion: string;
  zonaSitioHistorico: string;
  coordenadas: string;
  usosPermiso: string;
  coordenadasNad83: string;
  sueloGeologico: string;
  calificacionesEfectivas: string;
}

export type TipoDireccion = "Urbana" | "Rural";

export interface PermisoCatastrosAdicionales {
  cabidaPropiedad: string;
  unidadCabida: string;
  municipio: string;
  direccionFisica: string;
  tipoDireccion: string;
  codigoPostal: string;
  estado: string;
  puntoReferencia: string;
}

export interface PermisoDuenoSolar {
  nombre: string;
  inicial: string;
  apellido: string;
  telefono: string;
  email: string;
  direccionLinea1: string;
  direccionLinea2: string;
  pais: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
}

export interface PermisoArrendatario {
  tieneArrendatario: string;
}

export interface PermisoDocumento {
  tipoAnejo: string;
  nombreAnejo: string;
  requerido: boolean;
  archivo?: File;
}

export interface PermisoFormData {
  proyectoActividad: PermisoProyectoActividad;
  duenoProyecto: PermisoDuenoProyecto;
  localizacion: PermisoLocalizacion;
  catastrosAdicionales: PermisoCatastrosAdicionales;
  duenoSolar: PermisoDuenoSolar;
  arrendatario: PermisoArrendatario;
  documentos: PermisoDocumento[];
}
