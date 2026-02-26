/**
 * Field mapping configs that map ElevenLabs agent tool field keys
 * to React Hook Form field names for each form type.
 *
 * Each key in the record is the field_key the agent sends via
 * the fill_form_field client tool. The value is the React Hook Form
 * field path (dot notation for nested fields).
 *
 * Maintain these as forms change.
 */

export type FieldMapping = Record<string, string>;

// ── Permiso wizard (8-step) ──────────────────────────────────────

export const PERMISO_FIELD_MAP: FieldMapping = {
  // Step 1 — Proyecto o Actividad
  project_name: "proyectoActividad.nombre",
  zone_type: "proyectoActividad.tipoZona",
  project_type: "proyectoActividad.tipoProyecto",
  federal_funds: "proyectoActividad.fondosFederales",
  designation: "proyectoActividad.designacion",
  description: "proyectoActividad.descripcion",

  // Step 2 — Dueño del Proyecto
  owner_type: "duenoProyecto.tipoDueno",
  citizenship: "duenoProyecto.ciudadania",
  id_type: "duenoProyecto.tipoId",
  id_number: "duenoProyecto.identificacion",
  company: "duenoProyecto.compania",
  has_decree: "duenoProyecto.tieneDecreto",

  // Step 3 — Localización
  catastro_number: "localizacion.numeroCatastro",
  latitude: "localizacion.latitud",
  longitude: "localizacion.longitud",
  lambert_x: "localizacion.lambertX",
  lambert_y: "localizacion.lambertY",

  // Step 4 — Catastros Adicionales
  property_area: "catastrosAdicionales.cabidaPropiedad",
  area_unit: "catastrosAdicionales.unidadCabida",
  municipality: "catastrosAdicionales.municipio",
  physical_address: "catastrosAdicionales.direccionFisica",
  address_type: "catastrosAdicionales.tipoDireccion",
  postal_code: "catastrosAdicionales.codigoPostal",
  state: "catastrosAdicionales.estado",
  reference_point: "catastrosAdicionales.puntoReferencia",

  // Step 5 — Dueño del Solar
  owner_first_name: "duenoSolar.nombre",
  owner_initial: "duenoSolar.inicial",
  owner_last_name: "duenoSolar.apellido",
  owner_phone: "duenoSolar.telefono",
  owner_email: "duenoSolar.email",
  owner_address_1: "duenoSolar.direccionLinea1",
  owner_address_2: "duenoSolar.direccionLinea2",
  owner_country: "duenoSolar.pais",
  owner_state: "duenoSolar.estado",
  owner_city: "duenoSolar.ciudad",
  owner_postal_code: "duenoSolar.codigoPostal",

  // Step 6 — Arrendatario
  has_tenant: "arrendatario.tieneArrendatario",
};

// ── Solicitud (APA flow) ─────────────────────────────────────────

export const SOLICITUD_APA_FIELD_MAP: FieldMapping = {
  municipality: "municipio",
  license_number: "licencia",
  profession: "profesion",
  collegiate_start: "colegiacionInicio",
  collegiate_end: "colegiacionFin",
  license_start: "licenciaInicio",
  license_end: "licenciaFin",
};

// ── Querella ─────────────────────────────────────────────────────

export const QUERELLA_FIELD_MAP: FieldMapping = {
  municipality: "municipio",
  complaint_reason: "motivoQuerella",
  permit_type: "tipoPermiso",
  violation_details: "detallesViolacion",
  violation_schedule: "horarioViolacion",
  business_name: "nombreNegocio",
  business_hours: "horarioOperacion",
  general_comments: "comentarios",
  contact_name: "contactoNombre",
  contact_phone: "contactoTelefono",
  contact_email: "contactoEmail",
};

// ── Incentivo ────────────────────────────────────────────────────

export const INCENTIVO_FIELD_MAP: FieldMapping = {
  incentive_type: "tipoIncentivo",
  applicant_name: "nombreSolicitante",
  applicant_citizenship: "ciudadania",
  applicant_phone: "telefono",
  applicant_email: "email",
  business_name: "nombreNegocio",
  naics_code: "codigoNAICS",
  merchant_registry: "registroComercio",
  business_municipality: "municipioNegocio",
  date_established: "fechaEstablecimiento",
  employee_count: "cantidadEmpleados",
  annual_sales: "ventasAnuales",
  project_description: "descripcionProyecto",
  economic_impact: "impactoEconomico",
  jobs_created: "empleosCreados",
  investment_amount: "montoInversion",
};

// ── Permiso step resolution ─────────────────────────────────────

const PERMISO_STEP_PREFIXES: Record<string, number> = {
  proyectoActividad: 0,
  duenoProyecto: 1,
  localizacion: 2,
  catastrosAdicionales: 3,
  duenoSolar: 4,
  arrendatario: 5,
};

export const PERMISO_STEP_LABELS = [
  "Proyecto o Actividad",
  "Dueño del Proyecto",
  "Localización",
  "Catastros Adicionales",
  "Dueño del Solar",
  "Arrendatario",
  "Documentos",
  "Finish",
] as const;

/**
 * Resolve an agent field key to its step index and local form field name.
 * e.g. "project_name" → { stepIndex: 0, localFieldName: "nombre" }
 */
export function resolvePermisoField(
  agentFieldKey: string,
): { stepIndex: number; localFieldName: string } | null {
  const fullPath = PERMISO_FIELD_MAP[agentFieldKey];
  if (!fullPath) return null;

  const dotIndex = fullPath.indexOf(".");
  if (dotIndex === -1) return null;

  const prefix = fullPath.substring(0, dotIndex);
  const localFieldName = fullPath.substring(dotIndex + 1);
  const stepIndex = PERMISO_STEP_PREFIXES[prefix];

  if (stepIndex === undefined) return null;
  return { stepIndex, localFieldName };
}

// ── Page route mapping for voice navigation ─────────────────────

export const PAGE_ROUTES: Record<string, string> = {
  inicio: "/",
  dashboard: "/",
  permisos: "/permisos/nuevo",
  permiso: "/permisos/nuevo",
  solicitudes: "/solicitudes",
  consultas: "/consultas",
  querellas: "/querellas",
  incentivos: "/incentivos",
};

// ── Lookup helper ────────────────────────────────────────────────

const ALL_MAPPINGS: Record<string, FieldMapping> = {
  permiso: PERMISO_FIELD_MAP,
  "solicitud-apa": SOLICITUD_APA_FIELD_MAP,
  querella: QUERELLA_FIELD_MAP,
  incentivo: INCENTIVO_FIELD_MAP,
};

export function getFieldMapping(formId: string): FieldMapping | undefined {
  return ALL_MAPPINGS[formId];
}
