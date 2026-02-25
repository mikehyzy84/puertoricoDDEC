import type { CatastroResult, CatastroSearchParams } from "@/types/catastro";

// Puerto Rico CRIM/JP GIS service endpoints
const PR_CATASTRO_SERVICE =
  "https://gis.jp.pr.gov/ArcGIS/rest/services/Catastro/Catastro_parcelas/MapServer/0";

/**
 * Query the PR catastro GIS service by catastro number.
 */
export async function searchByCatastro(
  numeroCatastro: string
): Promise<CatastroResult | null> {
  const url = new URL(`${PR_CATASTRO_SERVICE}/query`);
  url.searchParams.set("where", `CATASTRO = '${numeroCatastro.replace(/'/g, "")}'`);
  url.searchParams.set("outFields", "*");
  url.searchParams.set("returnGeometry", "true");
  url.searchParams.set("f", "json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;
    return mapFeatureToCatastro(data.features[0]);
  } catch {
    return null;
  }
}

/**
 * Query by geographic coordinates (WGS84 lat/lng).
 */
export async function searchByCoordinates(
  lat: number,
  lng: number
): Promise<CatastroResult | null> {
  const url = new URL(`${PR_CATASTRO_SERVICE}/query`);
  url.searchParams.set(
    "geometry",
    JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } })
  );
  url.searchParams.set("geometryType", "esriGeometryPoint");
  url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
  url.searchParams.set("outFields", "*");
  url.searchParams.set("returnGeometry", "true");
  url.searchParams.set("f", "json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;
    return mapFeatureToCatastro(data.features[0]);
  } catch {
    return null;
  }
}

/**
 * Query by Lambert coordinates (PR State Plane NAD83, WKID 32161).
 */
export async function searchByLambert(
  x: number,
  y: number
): Promise<CatastroResult | null> {
  const url = new URL(`${PR_CATASTRO_SERVICE}/query`);
  url.searchParams.set(
    "geometry",
    JSON.stringify({ x, y, spatialReference: { wkid: 32161 } })
  );
  url.searchParams.set("geometryType", "esriGeometryPoint");
  url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
  url.searchParams.set("outFields", "*");
  url.searchParams.set("returnGeometry", "true");
  url.searchParams.set("f", "json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;
    return mapFeatureToCatastro(data.features[0]);
  } catch {
    return null;
  }
}

/**
 * Unified search dispatcher.
 */
export async function searchCatastro(
  params: CatastroSearchParams
): Promise<CatastroResult | null> {
  if (params.numeroCatastro) {
    return searchByCatastro(params.numeroCatastro);
  }
  if (params.latitud && params.longitud) {
    return searchByCoordinates(parseFloat(params.latitud), parseFloat(params.longitud));
  }
  if (params.lambertX && params.lambertY) {
    return searchByLambert(parseFloat(params.lambertX), parseFloat(params.lambertY));
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFeatureToCatastro(feature: any): CatastroResult {
  const a = feature.attributes || {};
  const geom = feature.geometry;

  // Extract centroid coordinates from geometry
  let coordStr = "";
  let coordNad83 = "";
  if (geom) {
    if (geom.rings && geom.rings[0]) {
      // Polygon — compute centroid of first ring
      const ring = geom.rings[0];
      const cx = ring.reduce((s: number, p: number[]) => s + p[0], 0) / ring.length;
      const cy = ring.reduce((s: number, p: number[]) => s + p[1], 0) / ring.length;
      coordStr = `${cy.toFixed(6)}, ${cx.toFixed(6)}`;
      coordNad83 = `${cx.toFixed(2)}, ${cy.toFixed(2)}`;
    } else if (geom.x !== undefined && geom.y !== undefined) {
      coordStr = `${geom.y.toFixed(6)}, ${geom.x.toFixed(6)}`;
      coordNad83 = `${geom.x.toFixed(2)}, ${geom.y.toFixed(2)}`;
    }
  }

  return {
    numeroCatastro: a.CATASTRO || a.NUM_CATASTRO || "",
    catastroExt: a.CATASTRO_EXT || a.EXT || "",
    zonaInundable: a.ZONA_INUNDABLE || a.FLOOD_ZONE || "",
    floodway: a.FLOODWAY || "",
    areaAproximada: a.AREA_APROX || a.SHAPE_Area ? `${parseFloat(a.SHAPE_Area || 0).toFixed(2)} m²` : "",
    calificacion: a.CALIFICACION || a.CALIF || "",
    municipio: a.MUNICIPIO || a.NOMBRE_MUNICIPIO || "",
    calificacionSobrepuesto: a.CALIF_SOBREPUESTO || "",
    barrio: a.BARRIO || a.NOMBRE_BARRIO || "",
    clasificacion: a.CLASIFICACION || "",
    zonaSitioHistorico: a.ZONA_HISTORICA || a.SITIO_HISTORICO || "No",
    coordenadas: coordStr,
    usosPermiso: a.USOS_PERMISO || a.USO || "",
    coordenadasNad83: coordNad83,
    sueloGeologico: a.SUELO_GEOLOGICO || a.GEOLOGIA || "",
    calificacionesEfectivas: a.CALIF_EFECTIVAS || "",
  };
}
