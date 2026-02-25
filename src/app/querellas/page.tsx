"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizard } from "@/hooks/useWizard";
import { MUNICIPIOS } from "@/constants/municipios";
import { MOTIVOS_QUERELLA } from "@/constants/motivosQuerella";
import { TIPOS_PERMISO_QUERELLA } from "@/constants/tiposPermiso";
import {
  querellaMunicipioSchema,
  querellaInfoGeneralSchema,
  querellaContactoSchema,
} from "@/lib/validations/querella";
import type {
  QuerellaFormData,
  QuerellaMunicipio,
  QuerellaInformacionGeneral,
  QuerellaContacto,
  QuerellaDocumento,
} from "@/types/querella";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResolver = any;

/* ───────────────── constants ───────────────── */

const STEPS = [
  { label: "Municipio", icon: "building" },
  { label: "Información\nGeneral", icon: "info" },
  { label: "Contacto", icon: "contact" },
  { label: "Anejos", icon: "doc" },
  { label: "Resumen", icon: "list" },
  { label: "Someter", icon: "send" },
];

const INITIAL_DATA: QuerellaFormData = {
  municipio: { municipio: "" },
  informacionGeneral: {
    motivo: "",
    tipoPermiso: "",
    tipoPermisoOtro: "",
    detallesViolaciones: "",
    diaHoraViolaciones: "",
    nombreCompania: "",
    horarioOperacion: "",
    comentariosGenerales: "",
  },
  contacto: {
    direccion1: "",
    direccion2: "",
    pais: "United States",
    estado: "Puerto Rico",
    ciudad: "",
    codigoPostal: "",
    numeroCatastro: "",
  },
  documentos: [],
};

const DEFAULT_DOCUMENTS: QuerellaDocumento[] = [
  { nombre: "Evidencia Fotográfica", descripcion: "Evidencia Fotográfica", requerido: true },
  { nombre: "Documentos de Apoyo", descripcion: "Documentos de Apoyo", requerido: false },
];

/* ───────────────── styles ───────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "3px",
  padding: "8px 10px",
  fontSize: "13px",
  fontFamily: "Arial",
  outline: "none",
  boxSizing: "border-box",
};

const errorInputStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "#c53030",
};

const errorTextStyle: React.CSSProperties = {
  color: "#c53030",
  fontSize: "11px",
  marginTop: "2px",
};

/* ───────────────── step ref type ───────────────── */

interface StepHandle {
  validate: () => Promise<boolean>;
}

interface StepProps<T> {
  data: T;
  onUpdate: (values: T) => void;
  stepRef: React.Ref<StepHandle>;
}

/* ───────────────── Step 1: Municipio ───────────────── */

const QStep1 = forwardRef<StepHandle, Omit<StepProps<QuerellaMunicipio>, "stepRef">>(
  function QStep1({ data, onUpdate }, ref) {
    const {
      register,
      formState: { errors },
      trigger,
      getValues,
    } = useForm<QuerellaMunicipio>({
      resolver: zodResolver(querellaMunicipioSchema),
      defaultValues: data,
      mode: "onBlur",
    });

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger();
        if (valid) onUpdate(getValues());
        return valid;
      },
    }));

    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ fontSize: "15px", fontWeight: 700 }}>Seleccionar Municipio</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px" }}>
            ¿En qué municipio se encuentra la propiedad de la querella?
          </span>
          <div>
            <select
              {...register("municipio")}
              style={errors.municipio ? errorInputStyle : inputStyle}
            >
              <option value="">Seleccione un municipio</option>
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.municipio && (
              <div style={errorTextStyle}>{errors.municipio.message}</div>
            )}
          </div>
        </div>
      </>
    );
  }
);

/* ───────────────── Step 2: Información General ───────────────── */

const QStep2 = forwardRef<StepHandle, Omit<StepProps<QuerellaInformacionGeneral>, "stepRef">>(
  function QStep2({ data, onUpdate }, ref) {
    const {
      register,
      formState: { errors },
      trigger,
      getValues,
      watch,
    } = useForm<QuerellaInformacionGeneral>({
      resolver: zodResolver(querellaInfoGeneralSchema) as AnyResolver,
      defaultValues: data,
      mode: "onBlur",
    });

    const tipoPermiso = watch("tipoPermiso");

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger();
        if (valid) onUpdate(getValues());
        return valid;
      },
    }));

    return (
      <>
        <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
          Información General de la Querella
        </h3>

        {/* Motivo */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            Motivo de la querella:<span style={{ color: "red" }}>*</span>
          </div>
          {MOTIVOS_QUERELLA.map((m) => (
            <label
              key={m}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                marginBottom: "6px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                value={m}
                {...register("motivo")}
                style={{ accentColor: "#2b8a7a" }}
              />
              {m}
            </label>
          ))}
          {errors.motivo && <div style={errorTextStyle}>{errors.motivo.message}</div>}
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
          {/* Tipo de Permiso */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              Tipo de Permiso
            </div>
            {TIPOS_PERMISO_QUERELLA.map((t) => (
              <label
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  marginBottom: "5px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  value={t}
                  {...register("tipoPermiso")}
                  style={{ accentColor: "#2b8a7a" }}
                />
                {t}
              </label>
            ))}
            {errors.tipoPermiso && (
              <div style={errorTextStyle}>{errors.tipoPermiso.message}</div>
            )}
            <input
              type="text"
              placeholder={tipoPermiso === "Otro" ? "Especifique el tipo de permiso..." : ""}
              {...register("tipoPermisoOtro")}
              style={{ ...inputStyle, marginTop: "4px" }}
              disabled={tipoPermiso !== "Otro"}
            />
          </div>

          {/* Detalles */}
          <div style={{ flex: 1 }}>
            <FField label="Detalles Breves sobre las Condiciones que se Violentan:" required>
              <textarea
                {...register("detallesViolaciones")}
                style={
                  errors.detallesViolaciones
                    ? { ...errorInputStyle, height: "80px", resize: "vertical" as const }
                    : { ...inputStyle, height: "80px", resize: "vertical" as const }
                }
              />
              {errors.detallesViolaciones && (
                <div style={errorTextStyle}>{errors.detallesViolaciones.message}</div>
              )}
            </FField>
            <FField
              label="Día y hora en donde aparentemente se realizan violaciones al código:"
              required
            >
              <textarea
                {...register("diaHoraViolaciones")}
                style={
                  errors.diaHoraViolaciones
                    ? { ...errorInputStyle, height: "80px", resize: "vertical" as const }
                    : { ...inputStyle, height: "80px", resize: "vertical" as const }
                }
              />
              {errors.diaHoraViolaciones && (
                <div style={errorTextStyle}>{errors.diaHoraViolaciones.message}</div>
              )}
            </FField>
          </div>
        </div>

        <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>
          Información adicional de la querella
        </h4>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <FField label="Nombre de la compañía o negocio:" style={{ flex: 1 }}>
            <input type="text" {...register("nombreCompania")} style={inputStyle} />
          </FField>
          <FField label="Horario de operación:" style={{ flex: 1 }}>
            <input type="text" {...register("horarioOperacion")} style={inputStyle} />
          </FField>
        </div>
        <FField label="Comentarios generales:" required>
          <textarea
            {...register("comentariosGenerales")}
            style={
              errors.comentariosGenerales
                ? { ...errorInputStyle, height: "80px", resize: "vertical" as const }
                : { ...inputStyle, height: "80px", resize: "vertical" as const }
            }
          />
          {errors.comentariosGenerales && (
            <div style={errorTextStyle}>{errors.comentariosGenerales.message}</div>
          )}
        </FField>
      </>
    );
  }
);

/* ───────────────── Step 3: Contacto ───────────────── */

const QStep3 = forwardRef<StepHandle, Omit<StepProps<QuerellaContacto>, "stepRef">>(
  function QStep3({ data, onUpdate }, ref) {
    const {
      register,
      formState: { errors },
      trigger,
      getValues,
    } = useForm<QuerellaContacto>({
      resolver: zodResolver(querellaContactoSchema) as AnyResolver,
      defaultValues: data,
      mode: "onBlur",
    });

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const valid = await trigger();
        if (valid) onUpdate(getValues());
        return valid;
      },
    }));

    return (
      <>
        <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
          Dirección física de la propiedad objeto de la querella: (Lugar donde aparentemente
          ocurrió la violación)
        </h3>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <FField label="Dirección 1:" required style={{ flex: 1 }}>
            <input
              type="text"
              {...register("direccion1")}
              style={errors.direccion1 ? errorInputStyle : inputStyle}
            />
            {errors.direccion1 && (
              <div style={errorTextStyle}>{errors.direccion1.message}</div>
            )}
          </FField>
          <FField label="Dirección 2:" style={{ flex: 1 }}>
            <input type="text" {...register("direccion2")} style={inputStyle} />
          </FField>
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <FField label="País:" required style={{ flex: 1 }}>
            <select
              {...register("pais")}
              style={errors.pais ? errorInputStyle : inputStyle}
            >
              <option value="United States">United States</option>
            </select>
            {errors.pais && <div style={errorTextStyle}>{errors.pais.message}</div>}
          </FField>
          <FField label="Estado:" required style={{ flex: 1 }}>
            <select
              {...register("estado")}
              style={errors.estado ? errorInputStyle : inputStyle}
            >
              <option value="Puerto Rico">Puerto Rico (PR)</option>
            </select>
            {errors.estado && <div style={errorTextStyle}>{errors.estado.message}</div>}
          </FField>
          <FField label="Ciudad:" style={{ flex: 1 }}>
            <select {...register("ciudad")} style={inputStyle}>
              <option value="">Seleccione...</option>
              {MUNICIPIOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </FField>
          <FField label="Código postal:" style={{ width: "120px" }}>
            <input type="text" {...register("codigoPostal")} style={inputStyle} />
          </FField>
        </div>

        <div
          style={{
            backgroundColor: "#e8f5e9",
            border: "1px solid #a5d6a7",
            borderRadius: "4px",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#333" }}>
            Identifique la localización con una (1) de las siguientes opciones:
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              fontSize: "12px",
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            <li>Número de catastro</li>
            <li>Coordenadas Geográficas o las coordenadas Lambert</li>
            <li>
              Seleccionando la ubicación o parcela en el mapa a continuación (buscar sobre el mapa)
            </li>
          </ul>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, width: "200px" }}>
            Número Catastro:
          </span>
          <input
            type="text"
            placeholder="000-000-000-00"
            {...register("numeroCatastro")}
            style={{ ...inputStyle, flex: 1 }}
          />
          <SBtn />
        </div>
      </>
    );
  }
);

/* ───────────────── Step 4: Anejos ───────────────── */

function QStep4({
  documentos,
  onUpdateDocumentos,
}: {
  documentos: QuerellaDocumento[];
  onUpdateDocumentos: (docs: QuerellaDocumento[]) => void;
}) {
  const docs = documentos.length > 0 ? documentos : DEFAULT_DOCUMENTS;

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleFileSelect = useCallback(
    (index: number) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const updated = [...docs];
          updated[index] = { ...updated[index], archivo: file };
          onUpdateDocumentos(updated);
        }
      };
      input.click();
      setOpenMenu(null);
    },
    [docs, onUpdateDocumentos]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updated = [...docs];
      updated[index] = { ...updated[index], archivo: undefined };
      onUpdateDocumentos(updated);
      setOpenMenu(null);
    },
    [docs, onUpdateDocumentos]
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Anejos</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Tipo de Anejo", "Nombre del Anejo", "Requerido", "Acciones"].map((h) => (
              <th
                key={h}
                style={{
                  color: "#fff",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, i) => (
            <tr key={doc.nombre} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px", fontSize: "13px" }}>{doc.nombre}</td>
              <td style={{ padding: "12px", fontSize: "13px", color: doc.archivo ? "#333" : "#999" }}>
                {doc.archivo ? doc.archivo.name : "Pending"}
              </td>
              <td style={{ padding: "12px" }}>
                {doc.requerido ? (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#38a169",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                    }}
                  />
                )}
              </td>
              <td style={{ padding: "12px", position: "relative" }}>
                <button
                  onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                    backgroundColor: "#fff",
                    padding: "4px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "Arial",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Acciones
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openMenu === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "38px",
                      left: "12px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      zIndex: 10,
                      minWidth: "160px",
                    }}
                  >
                    <button
                      onClick={() => handleFileSelect(i)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        backgroundColor: "transparent",
                        padding: "8px 14px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "Arial",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f4f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      Cargar Archivo
                    </button>
                    {doc.archivo && (
                      <button
                        onClick={() => handleRemoveFile(i)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          padding: "8px 14px",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontFamily: "Arial",
                          color: "#c53030",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        Eliminar Archivo
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ───────────────── Step 5: Resumen ───────────────── */

function QStep5({ data }: { data: QuerellaFormData }) {
  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1a3c34",
    marginBottom: "10px",
    paddingBottom: "6px",
    borderBottom: "2px solid #2b8a7a",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "16px 20px",
    marginBottom: "16px",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    marginBottom: "6px",
    lineHeight: 1.5,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    color: "#333",
    minWidth: "220px",
    flexShrink: 0,
  };

  const valueStyle: React.CSSProperties = {
    color: "#555",
  };

  const docs = data.documentos.length > 0 ? data.documentos : DEFAULT_DOCUMENTS;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Resumen de la Querella</span>
      </div>

      {/* Municipio */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Municipio</div>
        <div style={rowStyle}>
          <span style={labelStyle}>Municipio:</span>
          <span style={valueStyle}>{data.municipio.municipio || "—"}</span>
        </div>
      </div>

      {/* Información General */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Información General</div>
        <div style={rowStyle}>
          <span style={labelStyle}>Motivo de la querella:</span>
          <span style={valueStyle}>{data.informacionGeneral.motivo || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Tipo de Permiso:</span>
          <span style={valueStyle}>
            {data.informacionGeneral.tipoPermiso === "Otro" && data.informacionGeneral.tipoPermisoOtro
              ? `Otro — ${data.informacionGeneral.tipoPermisoOtro}`
              : data.informacionGeneral.tipoPermiso || "—"}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Detalles de violaciones:</span>
          <span style={valueStyle}>{data.informacionGeneral.detallesViolaciones || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Día y hora de violaciones:</span>
          <span style={valueStyle}>{data.informacionGeneral.diaHoraViolaciones || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Nombre de compañía o negocio:</span>
          <span style={valueStyle}>{data.informacionGeneral.nombreCompania || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Horario de operación:</span>
          <span style={valueStyle}>{data.informacionGeneral.horarioOperacion || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Comentarios generales:</span>
          <span style={valueStyle}>{data.informacionGeneral.comentariosGenerales || "—"}</span>
        </div>
      </div>

      {/* Contacto */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Contacto / Dirección</div>
        <div style={rowStyle}>
          <span style={labelStyle}>Dirección 1:</span>
          <span style={valueStyle}>{data.contacto.direccion1 || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Dirección 2:</span>
          <span style={valueStyle}>{data.contacto.direccion2 || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>País:</span>
          <span style={valueStyle}>{data.contacto.pais || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Estado:</span>
          <span style={valueStyle}>{data.contacto.estado || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Ciudad:</span>
          <span style={valueStyle}>{data.contacto.ciudad || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Código postal:</span>
          <span style={valueStyle}>{data.contacto.codigoPostal || "—"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Número Catastro:</span>
          <span style={valueStyle}>{data.contacto.numeroCatastro || "—"}</span>
        </div>
      </div>

      {/* Documentos */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Documentos Adjuntos</div>
        {docs.map((doc) => (
          <div key={doc.nombre} style={rowStyle}>
            <span style={labelStyle}>
              {doc.nombre}
              {doc.requerido && (
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#38a169",
                    marginLeft: "6px",
                    verticalAlign: "middle",
                  }}
                />
              )}
              :
            </span>
            <span style={{ ...valueStyle, color: doc.archivo ? "#2b8a7a" : "#999" }}>
              {doc.archivo ? doc.archivo.name : "No adjuntado"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ───────────────── Step 6: Someter ───────────────── */

function QStep6({
  submitted,
  onSubmit,
}: {
  submitted: boolean;
  onSubmit: () => void;
}) {
  const [certified, setCertified] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#38a169",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a3c34", marginBottom: "8px" }}>
          Su querella ha sido radicada exitosamente
        </h3>
        <p style={{ fontSize: "13px", color: "#666", maxWidth: "480px", margin: "0 auto" }}>
          Se le notificará el progreso de su querella a través del sistema. Puede verificar el
          estado en su bandeja de trámites.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          strokeWidth="2"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span style={{ fontSize: "15px", fontWeight: 700 }}>Someter Querella</span>
      </div>

      {/* Legal disclaimer */}
      <div
        style={{
          backgroundColor: "#fff8e1",
          border: "1px solid #ffe082",
          borderRadius: "6px",
          padding: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>
            Aviso Legal
          </span>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "#78350f",
            lineHeight: 1.6,
            margin: "0 0 8px",
          }}
        >
          De conformidad con la Ley núm. 161-2009, conocida como la &ldquo;Ley para la Reforma del
          Proceso de Permisos de Puerto Rico&rdquo;, se le informa que:
        </p>
        <ul
          style={{
            margin: "0",
            paddingLeft: "20px",
            fontSize: "13px",
            color: "#78350f",
            lineHeight: 1.6,
          }}
        >
          <li>
            <strong>No se permiten querellas anónimas.</strong> Toda querella debe incluir la
            identificación completa del querellante.
          </li>
          <li>
            El querellante debe cumplir con los requisitos de la <strong>Ley de legitimación
            activa</strong> vigente.
          </li>
          <li>
            La información provista será utilizada exclusivamente para los fines de la investigación
            de la querella radicada.
          </li>
          <li>
            Proveer información falsa o incompleta puede resultar en el archivo de la querella y
            posibles consecuencias legales.
          </li>
        </ul>
      </div>

      {/* Certification checkbox */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            cursor: "pointer",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          <input
            type="checkbox"
            checked={certified}
            onChange={(e) => setCertified(e.target.checked)}
            style={{
              accentColor: "#2b8a7a",
              marginTop: "3px",
              width: "16px",
              height: "16px",
              flexShrink: 0,
            }}
          />
          <span>
            Certifico que la información provista es correcta y verdadera. Entiendo que proveer
            información falsa puede conllevar consecuencias legales de acuerdo con las leyes del
            Estado Libre Asociado de Puerto Rico.
          </span>
        </label>
      </div>

      {/* Submit button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onSubmit}
          disabled={!certified}
          style={{
            color: "#fff",
            backgroundColor: certified ? "#2D6A4F" : "#a0aec0",
            border: "none",
            borderRadius: "4px",
            padding: "12px 32px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: certified ? "pointer" : "not-allowed",
            fontFamily: "Arial",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: certified ? 1 : 0.7,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Someter Querella
        </button>
      </div>
    </>
  );
}

/* ───────────────── Main Wizard ───────────────── */

export default function QuerellaWizard() {
  const wizard = useWizard<QuerellaFormData & Record<string, unknown>>({
    totalSteps: 6,
    initialData: INITIAL_DATA as QuerellaFormData & Record<string, unknown>,
    storageKey: "querella-wizard",
  });

  const step1Ref = useRef<StepHandle>(null);
  const step2Ref = useRef<StepHandle>(null);
  const step3Ref = useRef<StepHandle>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleNext = useCallback(async () => {
    let valid = true;

    if (wizard.currentStep === 0 && step1Ref.current) {
      valid = await step1Ref.current.validate();
    } else if (wizard.currentStep === 1 && step2Ref.current) {
      valid = await step2Ref.current.validate();
    } else if (wizard.currentStep === 2 && step3Ref.current) {
      valid = await step3Ref.current.validate();
    }

    if (valid) {
      wizard.goNext();
    }
  }, [wizard]);

  const handleSave = useCallback(async () => {
    if (wizard.currentStep === 0 && step1Ref.current) {
      await step1Ref.current.validate();
    } else if (wizard.currentStep === 1 && step2Ref.current) {
      await step2Ref.current.validate();
    } else if (wizard.currentStep === 2 && step3Ref.current) {
      await step3Ref.current.validate();
    }
  }, [wizard]);

  const handleSaveAndContinue = useCallback(async () => {
    let valid = true;

    if (wizard.currentStep === 0 && step1Ref.current) {
      valid = await step1Ref.current.validate();
    } else if (wizard.currentStep === 1 && step2Ref.current) {
      valid = await step2Ref.current.validate();
    } else if (wizard.currentStep === 2 && step3Ref.current) {
      valid = await step3Ref.current.validate();
    }

    if (valid) {
      wizard.goNext();
    }
  }, [wizard]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    wizard.clearStorage();
  }, [wizard]);

  const handleCancel = useCallback(() => {
    wizard.reset();
    setSubmitted(false);
  }, [wizard]);

  const showNavButtons = !submitted;

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
          </svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Solicitud de Radicación de Querellas -
          </span>
        </div>
      </div>

      <QStepper currentStep={wizard.currentStep} steps={STEPS} />

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          margin: "0 24px",
          backgroundColor: "#fff",
          padding: "20px 24px",
        }}
      >
        {wizard.currentStep === 0 && (
          <QStep1
            ref={step1Ref}
            data={wizard.data.municipio}
            onUpdate={(values) => wizard.setStepData("municipio", values)}
          />
        )}
        {wizard.currentStep === 1 && (
          <QStep2
            ref={step2Ref}
            data={wizard.data.informacionGeneral}
            onUpdate={(values) => wizard.setStepData("informacionGeneral", values)}
          />
        )}
        {wizard.currentStep === 2 && (
          <QStep3
            ref={step3Ref}
            data={wizard.data.contacto}
            onUpdate={(values) => wizard.setStepData("contacto", values)}
          />
        )}
        {wizard.currentStep === 3 && (
          <QStep4
            documentos={wizard.data.documentos}
            onUpdateDocumentos={(docs) => wizard.setStepData("documentos", docs)}
          />
        )}
        {wizard.currentStep === 4 && <QStep5 data={wizard.data} />}
        {wizard.currentStep === 5 && (
          <QStep6 submitted={submitted} onSubmit={handleSubmit} />
        )}
      </div>

      {showNavButtons && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "20px 0",
          }}
        >
          {wizard.currentStep > 0 && (
            <Btn color="#2D6A4F" onClick={wizard.goPrev}>
              <LeftArrow /> Paso Anterior
            </Btn>
          )}
          <Btn color="#2b8a7a" onClick={handleSave}>
            <SaveIcon /> Guardar
          </Btn>
          <Btn color="#2b8a7a" onClick={handleSaveAndContinue}>
            <SaveIcon /> Guardar y Continuar
          </Btn>
          <Btn color="#c53030" onClick={handleCancel}>
            <XIcon /> Cancelar
          </Btn>
          {wizard.currentStep < 5 && (
            <Btn color="#718096" onClick={handleNext}>
              Siguiente Paso <RightArrow />
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────────── Shared components ───────────────── */

function QStepper({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: typeof STEPS;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "20px 0",
      }}
    >
      {steps.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: i <= currentStep ? "#2b8a7a" : "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
            <div
              style={{
                fontSize: "10px",
                textAlign: "center",
                marginTop: "6px",
                fontWeight: i === currentStep ? 700 : 400,
                color: i <= currentStep ? "#333" : "#999",
                whiteSpace: "pre-line",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc",
                marginTop: "20px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FField({
  label,
  required,
  children,
  style: extra,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: "10px", ...extra }}>
      {label && (
        <label style={{ display: "block", fontSize: "13px", color: "#333", marginBottom: "3px" }}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Btn({
  color,
  onClick,
  children,
}: {
  color: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        color: "#fff",
        backgroundColor: color,
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Arial",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {children}
    </button>
  );
}

function SBtn() {
  return (
    <button
      style={{
        backgroundColor: "#2b8a7a",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        width: "34px",
        height: "34px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}

function LeftArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function RightArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 12h8" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
