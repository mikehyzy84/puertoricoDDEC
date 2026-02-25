export interface CatastroResult {
  numeroCatastro: string;
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

export interface CatastroSearchParams {
  numeroCatastro?: string;
  latitud?: string;
  longitud?: string;
  lambertX?: string;
  lambertY?: string;
}
