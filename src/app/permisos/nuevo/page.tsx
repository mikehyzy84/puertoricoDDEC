"use client";

import { useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import React from "react";
import dynamic from "next/dynamic";
import { useForm, FieldErrors, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizard } from "@/hooks/useWizard";
import { ZONAS } from "@/constants/zonas";
import { TIPOS_PROYECTO, FONDOS_FEDERALES, DESIGNACIONES } from "@/constants/tiposProyecto";
import { MUNICIPIOS } from "@/constants/municipios";
import {
  proyectoActividadSchema,
  duenoProyectoSchema,
  localizacionSchema,
  catastrosAdicionalesSchema,
  duenoSolarSchema,
  arrendatarioSchema,
} from "@/lib/validations/permit";
import type {
  PermisoFormData,
  PermisoProyectoActividad,
  PermisoDuenoProyecto,
  PermisoCatastrosAdicionales,
  PermisoDuenoSolar,
  PermisoArrendatario,
  PermisoLocalizacion,
} from "@/types/permit";
import type { CatastroResult } from "@/types/catastro";

// Dynamically import LocationPicker to avoid SSR issues with ArcGIS
const LocationPicker = dynamic(() => import("@/components/maps/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "300px", backgroundColor: "#e0e8e4",
      borderRadius: "4px", border: "1px solid #ccc",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#666", fontSize: "14px",
    }}>
      Cargando mapa...
    </div>
  ),
});

// ---------- Initial data ----------

const INITIAL_DATA: PermisoFormData = {
  proyectoActividad: { nombre: "", tipoZona: "", tipoProyecto: "", fondosFederales: "", designacion: "", descripcion: "" },
  duenoProyecto: { tipoDueno: "usted", ciudadania: "United States", tipoId: "Número de Seguro Social", identificacion: "", compania: "", tieneDecreto: "" },
  localizacion: { numeroCatastro: "", latitud: "", longitud: "", lambertX: "", lambertY: "", catastroExt: "", zonaInundable: "", floodway: "", areaAproximada: "", calificacion: "", municipio: "", calificacionSobrepuesto: "", barrio: "", clasificacion: "", zonaSitioHistorico: "", coordenadas: "", usosPermiso: "", coordenadasNad83: "", sueloGeologico: "", calificacionesEfectivas: "" },
  catastrosAdicionales: { cabidaPropiedad: "", unidadCabida: "", municipio: "", direccionFisica: "", tipoDireccion: "", codigoPostal: "", estado: "Puerto Rico", puntoReferencia: "" },
  duenoSolar: { nombre: "", inicial: "", apellido: "", telefono: "", email: "", direccionLinea1: "", direccionLinea2: "", pais: "United States", estado: "", ciudad: "", codigoPostal: "" },
  arrendatario: { tieneArrendatario: "" },
  documentos: [{ tipoAnejo: "Evidencia de Titularidad", nombreAnejo: "", requerido: true }],
};

// ---------- Step handle interface ----------

export interface StepHandle {
  validate: () => Promise<boolean>;
  getValues: () => Record<string, unknown>;
}

// ---------- Style constants (unchanged from original) ----------

const STEPS = [
  { label: "Proyecto o\nActividad", icon: "building" },
  { label: "Dueño del\nProyecto", icon: "user" },
  { label: "Localización", icon: "pin" },
  { label: "Catastros\nAdicionales", icon: "check" },
  { label: "Dueño del Solar", icon: "users" },
  { label: "Arrendatario", icon: "home" },
  { label: "Documentos", icon: "doc" },
  { label: "Finish", icon: "checkmark" },
] as const;

type IconType = (typeof STEPS)[number]["icon"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "3px",
  padding: "8px 10px",
  fontSize: "13px",
  fontFamily: "Arial, Helvetica, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "red",
};

const btnStyle: React.CSSProperties = {
  color: "#fff", border: "none", borderRadius: "4px",
  padding: "8px 16px", fontSize: "13px", fontWeight: 600,
  cursor: "pointer", fontFamily: "Arial", display: "flex",
  alignItems: "center", gap: "6px",
};

const errorTextStyle: React.CSSProperties = {
  color: "red",
  fontSize: "11px",
  marginTop: "2px",
};

// ---------- Reusable sub-components (visual unchanged) ----------

function StepIcon({ type, active, completed }: { type: IconType; active: boolean; completed: boolean }) {
  const bg = completed ? "#2b8a7a" : active ? "#2b8a7a" : "#ccc";
  const icons: Record<IconType, React.ReactNode> = {
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    doc: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    checkmark: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return (
    <div style={{
      width: "40px", height: "40px", borderRadius: "50%",
      backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icons[type]}
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0", gap: "0" }}>
      {STEPS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
            <StepIcon type={step.icon} active={i === currentStep} completed={i < currentStep} />
            <div style={{
              fontSize: "10px", textAlign: "center", marginTop: "6px",
              fontWeight: i === currentStep ? 700 : 400,
              color: i <= currentStep ? "#333" : "#999",
              lineHeight: 1.3, whiteSpace: "pre-line",
            }}>{step.label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: "40px", height: "2px", backgroundColor: i < currentStep ? "#2b8a7a" : "#ccc",
              marginTop: "20px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function FormField({ label, required, children, style: extraStyle }: { label: string; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: "12px", ...extraStyle }}>
      {label && (
        <label style={{ display: "block", fontSize: "13px", fontWeight: 400, color: "#333", marginBottom: "4px" }}>
          {label}{required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function RadioOption({ label, name, value, checked, onChange, inputRef }: {
  label: string; name: string; value?: string; checked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", cursor: "pointer" }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        ref={inputRef}
        style={{ accentColor: "#2b8a7a" }}
      />
      {label}
    </label>
  );
}

function SearchBtn() {
  return (
    <button type="button" style={{
      backgroundColor: "#2b8a7a", color: "#fff", border: "none",
      borderRadius: "4px", width: "34px", height: "34px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span style={errorTextStyle}>{message}</span>;
}

// ---------- Step 1: Proyecto o Actividad ----------

interface Step1Props {
  data: PermisoProyectoActividad;
  onUpdate: (d: Partial<PermisoProyectoActividad>) => void;
}

const Step1 = forwardRef<StepHandle, Step1Props>(function Step1({ data, onUpdate }, ref) {
  const { register, formState: { errors }, trigger, getValues, setValue, watch } = useForm<PermisoProyectoActividad>({
    resolver: zodResolver(proyectoActividadSchema) as Resolver<PermisoProyectoActividad>,
    defaultValues: data,
    mode: "onBlur",
  });

  // Sync form changes back to wizard state
  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoProyectoActividad>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  const fondosFederalesValue = watch("fondosFederales");
  const designacionValue = watch("designacion");

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Proyecto o Actividad</span>
      </div>

      <FormField label="Nombre:" required>
        <input type="text" style={errors.nombre ? inputErrorStyle : inputStyle} {...register("nombre")} />
        <FieldError message={errors.nombre?.message} />
      </FormField>

      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FormField label="Tipo de Zona:" required style={{ flex: 1 }}>
          <select style={errors.tipoZona ? inputErrorStyle : inputStyle} {...register("tipoZona")}>
            <option value="">Seleccione una zona...</option>
            {ZONAS.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <FieldError message={errors.tipoZona?.message} />
        </FormField>
        <FormField label="Tipo de Proyecto:" required style={{ flex: 1 }}>
          <select style={errors.tipoProyecto ? inputErrorStyle : inputStyle} {...register("tipoProyecto")}>
            <option value="">Seleccione un tipo...</option>
            {TIPOS_PROYECTO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <FieldError message={errors.tipoProyecto?.message} />
        </FormField>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: "#333", marginBottom: "8px" }}>
          ¿Su proyecto está subvencionado con fondos federales bajo estos programas?<span style={{ color: "red" }}>*</span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {FONDOS_FEDERALES.map((f) => (
            <RadioOption
              key={f}
              label={f}
              name="fondosFederales"
              value={f}
              checked={fondosFederalesValue === f}
              onChange={() => setValue("fondosFederales", f, { shouldValidate: true })}
            />
          ))}
        </div>
        <FieldError message={errors.fondosFederales?.message} />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: "#333", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
          ¿Su proyecto cuenta con una de las siguientes designaciones?<span style={{ color: "red" }}>*</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2b8a7a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {DESIGNACIONES.map((d) => (
            <RadioOption
              key={d}
              label={d}
              name="designacion"
              value={d}
              checked={designacionValue === d}
              onChange={() => setValue("designacion", d, { shouldValidate: true })}
            />
          ))}
        </div>
        <FieldError message={errors.designacion?.message} />
      </div>

      <FormField label="Descripción:" required>
        <textarea style={{ ...(errors.descripcion ? inputErrorStyle : inputStyle), height: "100px", resize: "vertical" }} {...register("descripcion")} />
        <FieldError message={errors.descripcion?.message} />
      </FormField>
    </div>
  );
});

// ---------- Step 2: Dueño del Proyecto ----------

interface Step2Props {
  data: PermisoDuenoProyecto;
  onUpdate: (d: Partial<PermisoDuenoProyecto>) => void;
}

const Step2 = forwardRef<StepHandle, Step2Props>(function Step2({ data, onUpdate }, ref) {
  const { register, formState: { errors }, trigger, getValues, setValue, watch } = useForm<PermisoDuenoProyecto>({
    resolver: zodResolver(duenoProyectoSchema) as Resolver<PermisoDuenoProyecto>,
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoDuenoProyecto>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  const owner = watch("tipoDueno");
  const tieneDecretoValue = watch("tieneDecreto");

  const setOwner = (val: "usted" | "otra" | "company") => {
    setValue("tipoDueno", val, { shouldValidate: true });
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Dueño del Proyecto</span>
      </div>

      <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>
        ¿A nombre de quién deben salir los trámites de este proyecto?
      </div>

      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        <RadioOption label="Usted" name="owner" value="usted" checked={owner === "usted"} onChange={() => setOwner("usted")} />
        <RadioOption label="De otra persona" name="owner" value="otra" checked={owner === "otra"} onChange={() => setOwner("otra")} />
        <RadioOption label="De una compañía" name="owner" value="company" checked={owner === "company"} onChange={() => setOwner("company")} />
      </div>

      {owner === "usted" && (
        <div style={{ fontSize: "14px", color: "#333" }}>
          <strong>Nombre y Apellido del dueño del Proyecto:</strong> Antonio Pavía
        </div>
      )}

      {owner === "otra" && (
        <div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
            <FormField label="Ciudadanía:" required style={{ flex: 1 }}>
              <select style={errors.ciudadania ? inputErrorStyle : inputStyle} {...register("ciudadania")}>
                <option value="United States">United States</option>
              </select>
              <FieldError message={errors.ciudadania?.message} />
            </FormField>
            <FormField label="Tipo:" required style={{ flex: 1 }}>
              <select style={errors.tipoId ? inputErrorStyle : inputStyle} {...register("tipoId")}>
                <option value="Número de Seguro Social">Número de Seguro Social</option>
              </select>
              <FieldError message={errors.tipoId?.message} />
            </FormField>
            <div style={{ flex: 1, marginBottom: "12px" }}>
              <input type="text" style={errors.identificacion ? inputErrorStyle : inputStyle} {...register("identificacion")} />
              <FieldError message={errors.identificacion?.message} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <SearchBtn />
            </div>
          </div>
        </div>
      )}

      {owner === "company" && (
        <>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "16px" }}>
            <FormField label="Compañías:" required style={{ flex: 1 }}>
              <select style={errors.compania ? inputErrorStyle : inputStyle} {...register("compania")}>
                <option value="">Seleccione una Compañía...</option>
              </select>
              <FieldError message={errors.compania?.message} />
            </FormField>
            <button type="button" style={{ backgroundColor: "#1a3c34", color: "#fff", border: "none", borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Arial", marginBottom: "12px" }}>
              Agregar Compañías
            </button>
          </div>
          <div style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "12px" }}>
            <strong>¿Cuenta la empresa con Decreto otorgado por el Gobierno de Puerto Rico?</strong>
            <RadioOption
              label="Sí"
              name="decreto"
              value="si"
              checked={tieneDecretoValue === "si"}
              onChange={() => setValue("tieneDecreto", "si", { shouldValidate: true })}
            />
            <RadioOption
              label="No"
              name="decreto"
              value="no"
              checked={tieneDecretoValue === "no"}
              onChange={() => setValue("tieneDecreto", "no", { shouldValidate: true })}
            />
          </div>
          <FieldError message={(errors as FieldErrors<{ tieneDecreto: string }>).tieneDecreto?.message} />
        </>
      )}
    </div>
  );
});

// ---------- Step 3: Localización ----------

interface Step3Props {
  data: PermisoLocalizacion;
  onUpdate: (d: Partial<PermisoLocalizacion>) => void;
}

const Step3 = forwardRef<StepHandle, Step3Props>(function Step3({ data, onUpdate }, ref) {
  const { register, trigger, getValues, setValue, watch } = useForm<PermisoLocalizacion>({
    resolver: zodResolver(localizacionSchema) as Resolver<PermisoLocalizacion>,
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoLocalizacion>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  // When catastro lookup returns a result, populate all read-only detail fields
  const handleCatastroResult = useCallback(
    (result: CatastroResult) => {
      const fields: (keyof CatastroResult)[] = [
        "numeroCatastro", "catastroExt", "zonaInundable", "floodway",
        "areaAproximada", "calificacion", "municipio", "calificacionSobrepuesto",
        "barrio", "clasificacion", "zonaSitioHistorico", "coordenadas",
        "usosPermiso", "coordenadasNad83", "sueloGeologico", "calificacionesEfectivas",
      ];
      fields.forEach((f) => {
        setValue(f, result[f] || "", { shouldDirty: true });
      });
    },
    [setValue]
  );

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setValue(field as keyof PermisoLocalizacion, value, { shouldDirty: true });
    },
    [setValue]
  );

  const currentValues = watch();

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Localización:</span>
      </div>
      <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Búsqueda por Catastro</div>

      <LocationPicker
        onResult={handleCatastroResult}
        numeroCatastro={currentValues.numeroCatastro}
        latitud={currentValues.latitud}
        longitud={currentValues.longitud}
        lambertX={currentValues.lambertX}
        lambertY={currentValues.lambertY}
        onInputChange={handleInputChange}
      />

      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "20px 0 12px" }}>Detalles del Catastro</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {([
          { label: "Número de catastro", field: "numeroCatastro" as const },
          { label: "Zona inundable", field: "zonaInundable" as const },
          { label: "Número de catastro ext", field: "catastroExt" as const },
          { label: "Floodway", field: "floodway" as const },
          { label: "Área aproximada", field: "areaAproximada" as const },
          { label: "Calificación", field: "calificacion" as const },
          { label: "Municipio", field: "municipio" as const },
          { label: "Calificación sobrepuesto", field: "calificacionSobrepuesto" as const },
          { label: "Barrio", field: "barrio" as const },
          { label: "Clasificación", field: "clasificacion" as const },
          { label: "Zona o sitio histórico", field: "zonaSitioHistorico" as const },
          { label: "Coordenadas", field: "coordenadas" as const },
          { label: "Usos de permiso", field: "usosPermiso" as const },
          { label: "Coordenadas Nad83", field: "coordenadasNad83" as const },
          { label: "Suelo geológico", field: "sueloGeologico" as const },
          { label: "Calificaciones efectivas", field: "calificacionesEfectivas" as const },
        ]).map(({ label, field }) => (
          <FormField key={field} label={`${label}:`} required={field !== "usosPermiso" && field !== "calificacionesEfectivas"}>
            <input type="text" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly {...register(field)} />
          </FormField>
        ))}
      </div>
    </div>
  );
});

// ---------- Step 4: Catastros Adicionales ----------

interface Step4Props {
  data: PermisoCatastrosAdicionales;
  onUpdate: (d: Partial<PermisoCatastrosAdicionales>) => void;
}

const Step4 = forwardRef<StepHandle, Step4Props>(function Step4({ data, onUpdate }, ref) {
  const { register, formState: { errors }, trigger, getValues, setValue, watch } = useForm<PermisoCatastrosAdicionales>({
    resolver: zodResolver(catastrosAdicionalesSchema) as Resolver<PermisoCatastrosAdicionales>,
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoCatastrosAdicionales>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  const tipoDireccionValue = watch("tipoDireccion");

  return (
    <div style={{ padding: "20px 24px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px" }}>Detalles Adicionales del Catastro</h3>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <FormField label="Cabida de la propiedad según escritura:" required style={{ width: "200px" }}>
          <input type="text" style={errors.cabidaPropiedad ? inputErrorStyle : inputStyle} {...register("cabidaPropiedad")} />
          <FieldError message={errors.cabidaPropiedad?.message} />
        </FormField>
        <FormField label="" style={{ width: "180px" }}>
          <select style={inputStyle} {...register("unidadCabida")}>
            <option value="">Seleccione un valor...</option>
            <option value="metros">Metros cuadrados</option>
            <option value="cuerdas">Cuerdas</option>
            <option value="acres">Acres</option>
          </select>
        </FormField>
        <FormField label="Municipio:" required style={{ flex: 1 }}>
          <select style={errors.municipio ? inputErrorStyle : inputStyle} {...register("municipio")}>
            <option value="">Seleccione el municipio...</option>
            {MUNICIPIOS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <FieldError message={errors.municipio?.message} />
        </FormField>
      </div>
      <FormField label="Dirección Física (solo lectura):" required>
        <input type="text" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly {...register("direccionFisica")} />
      </FormField>
      <div style={{ marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700 }}>Tipo de Dirección:<span style={{ color: "red" }}>*</span></span>
        <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
          <RadioOption
            label="Urbana"
            name="tipoDireccion"
            value="Urbana"
            checked={tipoDireccionValue === "Urbana"}
            onChange={() => setValue("tipoDireccion", "Urbana", { shouldValidate: true })}
          />
          <RadioOption
            label="Rural"
            name="tipoDireccion"
            value="Rural"
            checked={tipoDireccionValue === "Rural"}
            onChange={() => setValue("tipoDireccion", "Rural", { shouldValidate: true })}
          />
        </div>
        <FieldError message={errors.tipoDireccion?.message} />
      </div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <FormField label="Código postal:" required style={{ flex: 1 }}>
          <input type="text" style={errors.codigoPostal ? inputErrorStyle : inputStyle} {...register("codigoPostal")} />
          <FieldError message={errors.codigoPostal?.message} />
        </FormField>
        <FormField label="Estado:" required style={{ flex: 1 }}>
          <input type="text" value="Puerto Rico" style={{ ...inputStyle, backgroundColor: "#f0f4f2" }} readOnly {...register("estado")} />
        </FormField>
      </div>
      <FormField label="Punto de referencia de cómo llegar:">
        <textarea style={{ ...inputStyle, height: "80px", resize: "vertical" }} {...register("puntoReferencia")} />
      </FormField>
    </div>
  );
});

// ---------- Step 5: Dueño del Solar ----------

interface Step5Props {
  data: PermisoDuenoSolar;
  onUpdate: (d: Partial<PermisoDuenoSolar>) => void;
}

const Step5 = forwardRef<StepHandle, Step5Props>(function Step5({ data, onUpdate }, ref) {
  const { register, formState: { errors }, trigger, getValues, watch } = useForm<PermisoDuenoSolar>({
    resolver: zodResolver(duenoSolarSchema) as Resolver<PermisoDuenoSolar>,
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoDuenoSolar>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Dueño del Solar</span>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Nombre:" required style={{ flex: 1 }}>
          <input type="text" style={errors.nombre ? inputErrorStyle : inputStyle} {...register("nombre")} />
          <FieldError message={errors.nombre?.message} />
        </FormField>
        <FormField label="Inicial:" style={{ width: "80px" }}>
          <input type="text" style={inputStyle} {...register("inicial")} />
        </FormField>
        <FormField label="Apellido:" required style={{ flex: 1 }}>
          <input type="text" style={errors.apellido ? inputErrorStyle : inputStyle} {...register("apellido")} />
          <FieldError message={errors.apellido?.message} />
        </FormField>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Teléfono:" required style={{ flex: 1 }}>
          <input type="text" style={errors.telefono ? inputErrorStyle : inputStyle} {...register("telefono")} />
          <FieldError message={errors.telefono?.message} />
        </FormField>
        <FormField label="Email:" required style={{ flex: 1 }}>
          <input type="text" style={errors.email ? inputErrorStyle : inputStyle} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </FormField>
      </div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <FormField label="Dirección Línea 1:" required style={{ flex: 1 }}>
          <input type="text" style={errors.direccionLinea1 ? inputErrorStyle : inputStyle} {...register("direccionLinea1")} />
          <FieldError message={errors.direccionLinea1?.message} />
        </FormField>
        <FormField label="Dirección Línea 2:" style={{ flex: 1 }}>
          <input type="text" style={inputStyle} {...register("direccionLinea2")} />
        </FormField>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <FormField label="País:" required style={{ flex: 1 }}>
          <select style={errors.pais ? inputErrorStyle : inputStyle} {...register("pais")}>
            <option value="United States">United States</option>
          </select>
          <FieldError message={errors.pais?.message} />
        </FormField>
        <FormField label="Estado:" required style={{ flex: 1 }}>
          <select style={errors.estado ? inputErrorStyle : inputStyle} {...register("estado")}>
            <option value="">Seleccione el estado</option>
            <option value="PR">Puerto Rico</option>
          </select>
          <FieldError message={errors.estado?.message} />
        </FormField>
        <FormField label="Ciudad:" required style={{ flex: 1 }}>
          <input type="text" style={errors.ciudad ? inputErrorStyle : inputStyle} {...register("ciudad")} />
          <FieldError message={errors.ciudad?.message} />
        </FormField>
        <FormField label="Código Postal:" required style={{ width: "120px" }}>
          <input type="text" style={errors.codigoPostal ? inputErrorStyle : inputStyle} {...register("codigoPostal")} />
          <FieldError message={errors.codigoPostal?.message} />
        </FormField>
      </div>
    </div>
  );
});

// ---------- Step 6: Arrendatario ----------

interface Step6Props {
  data: PermisoArrendatario;
  onUpdate: (d: Partial<PermisoArrendatario>) => void;
}

const Step6 = forwardRef<StepHandle, Step6Props>(function Step6({ data, onUpdate }, ref) {
  const { formState: { errors }, trigger, getValues, setValue, watch } = useForm<PermisoArrendatario>({
    resolver: zodResolver(arrendatarioSchema) as Resolver<PermisoArrendatario>,
    defaultValues: data,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate(values as Partial<PermisoArrendatario>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
    getValues: () => getValues() as unknown as Record<string, unknown>,
  }));

  const tieneArrendatarioValue = watch("tieneArrendatario");

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Arrendatario</span>
      </div>
      <div style={{ fontSize: "13px", lineHeight: 1.8, marginBottom: "20px" }}>
        <div>Si usted está gestionando un trámite para otra persona, <strong>debe</strong> contestar <strong>Sí</strong></div>
        <div>Si usted está arrendando/alquilando un local o el solar, <strong>debe</strong> contestar <strong>Sí</strong></div>
        <div>Si es el Dueño del Proyecto del Local, marque <strong>No</strong></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "13px" }}>¿Su proyecto tiene Arrendatario?</span>
        <RadioOption
          label="Sí"
          name="arrendatario"
          value="si"
          checked={tieneArrendatarioValue === "si"}
          onChange={() => setValue("tieneArrendatario", "si", { shouldValidate: true })}
        />
        <RadioOption
          label="No"
          name="arrendatario"
          value="no"
          checked={tieneArrendatarioValue === "no"}
          onChange={() => setValue("tieneArrendatario", "no", { shouldValidate: true })}
        />
      </div>
      <FieldError message={errors.tieneArrendatario?.message} />
    </div>
  );
});

// ---------- Step 7: Documentos (no validation) ----------

interface Step7Props {
  data: PermisoFormData["documentos"];
}

const Step7 = forwardRef<StepHandle, Step7Props>(function Step7({ data }, ref) {
  useImperativeHandle(ref, () => ({
    validate: async () => true, // No field validation for documents step
    getValues: () => ({ documentos: data }) as unknown as Record<string, unknown>,
  }));

  return (
    <div style={{ padding: "20px 24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#1a3c34" }}>
            {["Tipo de Anejo", "Nombre del Anejo", "Requerido", "Acciones"].map((h) => (
              <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: "12px", fontWeight: 700, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((doc, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>{doc.tipoAnejo}</td>
              <td style={{ padding: "12px", color: doc.nombreAnejo ? "#333" : "#999" }}>{doc.nombreAnejo || "Pending"}</td>
              <td style={{ padding: "12px" }}>
                {doc.requerido && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#38a169" }} />}
              </td>
              <td style={{ padding: "12px" }}>
                <button type="button" style={{ border: "1px solid #ccc", borderRadius: "3px", backgroundColor: "#fff", padding: "4px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Arial", display: "flex", alignItems: "center", gap: "4px" }}>
                  Acciones
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// ---------- Step 8: Finish (no validation) ----------

interface Step8Props {
  onBack: () => void;
}

const Step8 = forwardRef<StepHandle, Step8Props>(function Step8({ onBack }, ref) {
  useImperativeHandle(ref, () => ({
    validate: async () => true,
    getValues: () => ({}) as Record<string, unknown>,
  }));

  return (
    <div style={{ padding: "40px 24px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start", marginBottom: "30px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Terminar</span>
      </div>
      <div style={{ backgroundColor: "#f0f4f2", borderRadius: "8px", padding: "40px", marginBottom: "24px" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>El proyecto ha sido creado correctamente</p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button type="button" onClick={onBack} style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Retroceder
        </button>
        <button type="button" style={{ ...btnStyle, backgroundColor: "#1a3c34" }}>
          Ir a crear el permiso
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </button>
      </div>
    </div>
  );
});

// ---------- Wizard Buttons ----------

function WizardButtons({ currentStep, onPrev, onNext, onSave, onSaveAndContinue, onCancel }: {
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "20px 0", flexWrap: "wrap" }}>
      {currentStep > 0 && (
        <button type="button" onClick={onPrev} style={{ ...btnStyle, backgroundColor: "#2D6A4F" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Paso Anterior
        </button>
      )}
      <button type="button" onClick={onSave} style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>
        Guardar
      </button>
      <button type="button" onClick={onSaveAndContinue} style={{ ...btnStyle, backgroundColor: "#2b8a7a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>
        Guardar y Continuar
      </button>
      <button type="button" onClick={onCancel} style={{ ...btnStyle, backgroundColor: "#c53030" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Cancelar
      </button>
      <button type="button" onClick={onNext} style={{ ...btnStyle, backgroundColor: "#718096" }}>
        Siguiente Paso
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

// ---------- Main Wizard ----------

export default function PermisoWizard() {
  const wizard = useWizard<PermisoFormData>({
    totalSteps: 8,
    initialData: INITIAL_DATA,
    storageKey: "permiso-wizard-draft",
  });

  const { goNext, goPrev, reset, updateStepData, currentStep, data: wizardData } = wizard;

  const stepRef = useRef<StepHandle>(null);

  // Validate current step before advancing
  const handleNext = useCallback(async () => {
    if (stepRef.current) {
      const valid = await stepRef.current.validate();
      if (!valid) return;
    }
    goNext();
  }, [goNext]);

  // Save draft without validation — sync current form values into wizard state
  const handleSave = useCallback(() => {
    // Data is already synced via watch subscriptions, just trigger localStorage persist
    // which happens automatically when wizard.data changes via the useEffect in useWizard
  }, []);

  // Save and continue: validate first, then advance
  const handleSaveAndContinue = useCallback(async () => {
    if (stepRef.current) {
      const valid = await stepRef.current.validate();
      if (!valid) return;
    }
    goNext();
  }, [goNext]);

  // Cancel: reset wizard state
  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  // Stable callbacks for each step's onUpdate
  const updateProyectoActividad = useCallback(
    (d: Partial<PermisoProyectoActividad>) => updateStepData("proyectoActividad", d),
    [updateStepData]
  );
  const updateDuenoProyecto = useCallback(
    (d: Partial<PermisoDuenoProyecto>) => updateStepData("duenoProyecto", d),
    [updateStepData]
  );
  const updateLocalizacion = useCallback(
    (d: Partial<PermisoLocalizacion>) => updateStepData("localizacion", d),
    [updateStepData]
  );
  const updateCatastrosAdicionales = useCallback(
    (d: Partial<PermisoCatastrosAdicionales>) => updateStepData("catastrosAdicionales", d),
    [updateStepData]
  );
  const updateDuenoSolar = useCallback(
    (d: Partial<PermisoDuenoSolar>) => updateStepData("duenoSolar", d),
    [updateStepData]
  );
  const updateArrendatario = useCallback(
    (d: Partial<PermisoArrendatario>) => updateStepData("arrendatario", d),
    [updateStepData]
  );

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1
            ref={stepRef}
            data={wizardData.proyectoActividad}
            onUpdate={updateProyectoActividad}
          />
        );
      case 1:
        return (
          <Step2
            ref={stepRef}
            data={wizardData.duenoProyecto}
            onUpdate={updateDuenoProyecto}
          />
        );
      case 2:
        return (
          <Step3
            ref={stepRef}
            data={wizardData.localizacion}
            onUpdate={updateLocalizacion}
          />
        );
      case 3:
        return (
          <Step4
            ref={stepRef}
            data={wizardData.catastrosAdicionales}
            onUpdate={updateCatastrosAdicionales}
          />
        );
      case 4:
        return (
          <Step5
            ref={stepRef}
            data={wizardData.duenoSolar}
            onUpdate={updateDuenoSolar}
          />
        );
      case 5:
        return (
          <Step6
            ref={stepRef}
            data={wizardData.arrendatario}
            onUpdate={updateArrendatario}
          />
        );
      case 6:
        return (
          <Step7
            ref={stepRef}
            data={wizardData.documentos}
          />
        );
      case 7:
        return (
          <Step8
            ref={stepRef}
            onBack={goPrev}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>Proyecto</span>
        </div>
      </div>

      <Stepper currentStep={currentStep} />

      <div style={{ border: "1px solid #ddd", borderRadius: "4px", margin: "0 24px", backgroundColor: "#fff" }}>
        {renderStep()}
      </div>

      {currentStep < 7 ? (
        <WizardButtons
          currentStep={currentStep}
          onPrev={goPrev}
          onNext={handleNext}
          onSave={handleSave}
          onSaveAndContinue={handleSaveAndContinue}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
}
