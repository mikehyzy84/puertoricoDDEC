# DDEC Gerencia de Permisos — Permit Management System

## Overview
A full-stack web application that recreates and enhances Puerto Rico's **Gerencia de Permisos** (Permit Management Office) portal — the government system used by citizens, professionals, and companies to file permits, solicitudes, consultas, querellas, and incentives for construction and land use in Puerto Rico.

The key differentiator: an integrated **ElevenLabs Conversational AI Voice Agent** that can guide users through the entire process, answer questions about permit requirements, and even fill out forms on the user's behalf via voice commands.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + useReducer for multi-step form wizards
- **Database**: PostgreSQL via Prisma ORM
- **Maps**: ArcGIS/Esri JavaScript SDK (Puerto Rico parcel/catastro lookup)
- **Voice Agent**: ElevenLabs Conversational AI (@elevenlabs/react SDK)
- **Deployment**: Vercel
- **Language**: Spanish-language UI throughout (all labels, buttons, placeholders, validation messages in Spanish)

## Project Structure
```
src/
├── app/
│   ├── layout.tsx                    # Root layout with nav, ElevenLabs widget
│   ├── page.tsx                      # Main dashboard (Mi Bandeja)
│   ├── permisos/
│   │   └── nuevo/
│   │       └── page.tsx              # Multi-step Permiso wizard
│   ├── solicitudes/
│   │   ├── page.tsx                  # Solicitudes listing
│   │   └── [tipo]/
│   │       └── page.tsx              # APA, APS, ASP, CER, CIR flows
│   ├── consultas/
│   │   ├── page.tsx                  # Consultas listing
│   │   └── [tipo]/
│   │       └── page.tsx              # PCA, PCD, PCE, PCI, Discrecionales
│   ├── querellas/
│   │   └── page.tsx                  # Querella filing flow
│   ├── incentivos/
│   │   ├── page.tsx                  # Incentivos listing / selection
│   │   └── [tipo]/
│   │       └── page.tsx              # Specific incentive decree application flows
│   └── api/
│       ├── projects/                 # Project CRUD
│       ├── permits/                  # Permit CRUD
│       ├── catastro/                 # Catastro/parcel lookup proxy
│       └── elevenlabs/               # ElevenLabs signed URL generation
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Top nav: Mi Bandeja, Help Desk, Menú, Solicitante, Salir
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── RadicarButtons.tsx        # Permisos, Solicitudes, Consultas, Querellas, Incentivos, Todos
│   │   ├── SolicitudesTramites.tsx   # Filter tabs + data table
│   │   └── PerfilesProyectos.tsx     # Projects table with search
│   ├── wizards/
│   │   ├── Stepper.tsx               # Reusable step indicator component
│   │   ├── WizardLayout.tsx          # Shared wizard layout wrapper
│   │   ├── permiso/                  # 8-step Permiso wizard steps
│   │   │   ├── ProyectoActividad.tsx
│   │   │   ├── DuenoProyecto.tsx
│   │   │   ├── Localizacion.tsx
│   │   │   ├── CatastrosAdicionales.tsx
│   │   │   ├── DuenoSolar.tsx
│   │   │   ├── Arrendatario.tsx
│   │   │   ├── Documentos.tsx
│   │   │   └── Finish.tsx
│   │   ├── solicitud/                # Solicitud-specific wizard steps
│   │   │   ├── Municipio.tsx
│   │   │   ├── InformacionGeneral.tsx
│   │   │   ├── Anejos.tsx
│   │   │   ├── Resumen.tsx
│   │   │   └── Someter.tsx
│   │   ├── querella/                 # Querella-specific wizard steps
│   │   │   ├── Municipio.tsx
│   │   │   ├── InformacionGeneral.tsx
│   │   │   ├── Contacto.tsx
│   │   │   ├── Anejos.tsx
│   │   │   ├── Resumen.tsx
│   │   │   └── Someter.tsx
│   │   └── incentivo/                # Incentivo decree application wizard steps
│   │       ├── TipoIncentivo.tsx
│   │       ├── InformacionSolicitante.tsx
│   │       ├── InformacionNegocio.tsx
│   │       ├── DetallesProyecto.tsx
│   │       ├── Documentos.tsx
│   │       ├── Resumen.tsx
│   │       └── Someter.tsx
│   ├── maps/
│   │   ├── CatastroMap.tsx           # Esri/ArcGIS map for parcel lookup
│   │   └── LocationPicker.tsx        # Coordinate + catastro number search
│   ├── voice/
│   │   ├── VoiceAgentProvider.tsx    # ElevenLabs context provider
│   │   ├── VoiceAgentWidget.tsx      # Floating voice agent button/UI
│   │   ├── VoiceAgentPanel.tsx       # Expanded conversation panel
│   │   └── useFormFiller.ts          # Hook: voice agent → form field bridge
│   ├── ui/                           # shadcn/ui components
│   └── shared/
│       ├── SearchModal.tsx           # Búsqueda de Permisos modal
│       ├── DateRangePicker.tsx
│       └── DataTable.tsx
├── lib/
│   ├── db.ts                         # Prisma client
│   ├── elevenlabs.ts                 # ElevenLabs API helpers
│   ├── catastro.ts                   # Catastro/GIS utilities
│   └── validations/                  # Zod schemas for all forms
├── hooks/
│   ├── useWizard.ts                  # Multi-step wizard state management
│   ├── useVoiceFormFill.ts           # Bridge between voice agent and form fields
│   └── useCatastroLookup.ts          # Catastro search hook
├── types/
│   ├── permit.ts
│   ├── project.ts
│   ├── solicitud.ts
│   ├── querella.ts
│   ├── incentivo.ts
│   └── catastro.ts
└── constants/
    ├── municipios.ts                 # All 78 PR municipalities
    ├── zonas.ts                      # Rural, Urbano
    ├── tiposProyecto.ts              # Privado, Público, Alianza Público-Privada, etc.
    ├── profesiones.ts                # Arquitecto/a, Ingeniero/a
    ├── motivosQuerella.ts            # Complaint reason types
    └── tiposIncentivo.ts             # Ley 60 incentive decree types
```

## Key Features & Flows

### 1. Main Dashboard (Mi Bandeja)
- **Top navbar**: Mi Bandeja, Help Desk (HDS), Menú, Solicitante dropdown, Salir, user email, Gerencia de Permisos logo
- **Radicar section**: 6 colored buttons — Permisos (orange folder), Solicitudes (teal), Consultas (teal), Querellas (orange), Incentivos (teal), Todos (orange). Each opens a search/selection modal.
- **Solicitudes de Trámites**: Filter buttons (Todos, Trámites Personales, Trámites de Compañía, Trámites de Terceros), date range (Desde/Hasta), Número de Trámite search. Tab bar: No Pagados/No Sometidos, Pagados/Sometidos, Continuación de Operación, Querellas Radicadas, Pendientes, Casos Aprot.
- **Perfiles de Proyectos**: Date range + Proyecto search, table with Nombre del Proyecto, Número de Proyecto, Fecha de Creación, Dueño del Proyecto, Dueño del Solar. Green "Crear Proyecto" button.

### 2. Permiso Flow (8-step wizard)
Steps shown in horizontal stepper with icons:
1. **Proyecto o Actividad**: Nombre*, Tipo de Zona* (Rural/Urbano), Tipo de Proyecto* (Privado, Público, Alianza Público-Privada, Público con Contratación Privada), federal funding radio (Fondos CDBG-DR / Fondos COR3/FEMA / No aplica), designations (Crítico / Estratégico / No aplica), Descripción*
2. **Dueño del Proyecto**: Radio select — Usted (auto-fills from profile), De otra persona (Ciudadanía + Tipo ID + search), De una compañía (company dropdown + Agregar Compañías + decreto question)
3. **Localización**: Catastro search by: Número Catastro, Coordenadas Geográficas (Lat/Long), Coordenadas Lambert (X/Y), or map click. Esri map of Puerto Rico. Auto-populates: Número de catastro, catastro ext, Zona inundable, Floodway, Área aproximada, Calificación, Municipio, Calificación sobrepuesto, Barrio, Clasificación, Zona o sitio histórico, Coordenadas, Usos de permiso, Coordenadas Nad83, Suelo geológico, Calificaciones efectivas
4. **Catastros Adicionales**: Cabida de propiedad según escritura, Municipio dropdown, Dirección Física (read-only), Tipo de Dirección (Urbana/Rural), Código postal, Estado (Puerto Rico default), Punto de referencia
5. **Dueño del Solar**: Nombre*, Inicial, Apellido*, Teléfono*, Email*, Dirección Línea 1*, Dirección Línea 2, País* (default US), Estado*, Ciudad*, Código Postal*
6. **Arrendatario**: Question "¿Su proyecto tiene Arrendatario?" (Sí/No). If managing for another person → Sí. If renting → Sí. If owner → No.
7. **Documentos**: Table with Tipo de Anejo, Nombre del Anejo, Requerido indicator (green dot), Acciones dropdown. Required: Evidencia de Titularidad.
8. **Finish**: Success message "El proyecto ha sido creado correctamente" with Retroceder and "Ir a crear el permiso" buttons

**Navigation buttons on each step**: Paso Anterior (green), Guardar (teal), Guardar y Continuar (teal), Cancelar (red), Siguiente Paso (gray/teal)

### 3. Solicitudes Flow
Types available (shown in search modal):
- **APA** — Autorización para emitir un Permiso Automático
- **APS** — Aprobación de Planos Seguros
- **ASP** — Aprobación de Sistema o Producto
- **CER** — Certificación de Equipos de Energía Renovable
- **CIR** — Certificado Instalador Renovable

APA flow wizard steps: Municipio → Información General (Licencia, Profesión [Arquitecto/a, Ingeniero/a], colegiación dates, licencia dates, certification checkbox) → Anejos (documents table: Evidencia Colegiación, Licencia) → Resumen → Someter

### 4. Consultas Flow
Types available:
- **Consultas Discrecionales** (CCO, CUB, LOT)
- **PCA** — Pre-Consulta Arqueología Conservación Histórica
- **PCD** — Pre-Consulta Departamento de Evaluación de Cumplimiento Ambiental
- **PCE** — Pre-Consulta Edificabilidad
- **PCI** — Pre-Consulta Infraestructura

Each requires project selection (dropdown or Crear Proyecto). Flow: Tipo de Trámite selection → Project selection → Continue with specific form.

### 5. Querellas Flow
Steps: Municipio → Información General → Contacto → Anejos → Resumen → Someter

**Información General** includes:
- Motivo de la querella: Ausencia de Permiso Requerido, Incumplimiento con los términos del Permiso, Permiso en incumplimiento con la ley y/o reglamento, Con respecto al Profesional o Inspector Autorizado
- Tipo de Permiso: Permiso de Uso, Permiso de Construccion, Permiso Uso y Construccion, Permiso Rotulos Anuncio, Permiso Antenas y Torres, Movimiento Tierra, Otro
- Detalles Breves sobre las Condiciones que se Violentan*
- Día y hora donde aparentemente se realizan violaciones al código*
- Nombre de compañía o negocio, Horario de operación, Comentarios generales*
- Physical address with catastro lookup (same map component as Permiso)

**Legal basis**: Ley núm. 161-2009. Anonymous complaints not permitted. Must comply with Ley de legitimación.

### 6. Incentivos Flow (Tax Incentive Decree Applications)
The Incentivos section connects to the DDEC's incentive programs under **Ley 60-2019 (Código de Incentivos de Puerto Rico)**. This is the Single Business Portal (SBP) functionality that allows businesses and individuals to apply for tax exemption decrees (decretos de exención contributiva).

**Incentive types available** (shown in Incentivos search modal):
- **Joven Empresario** — Young Entrepreneur tax exemption (ages 16-35, 100% income tax exemption up to $500K, 3-year decree)
- **Residente Inversionista Individual** — Individual Investor Resident (Act 60 Ch. 2, Subtitle B)
- **Exportación de Servicios** — Export of Services (Sec. 2031.01)
- **Manufactura** — Manufacturing tax incentives
- **Energía Renovable** — Renewable Energy incentives
- **Turismo** — Tourism Development (tax credits, property tax exemptions)
- **Agricultura** — Agriculture incentives
- **Industria Cinematográfica** — Film Industry tax credits
- **Investigadores y Científicos** — Researchers and Scientists (Sec. 2021.04)
- **Profesional de Difícil Reclutamiento** — Hard-to-Recruit Professionals (Sec. 2021.02)
- **Entidades Financieras Internacionales** — International Financial Entities (Sec. 2041.01)
- **Fondos de Capital Privado** — Private Capital Funds (Sec. 2041.03)
- **Zonas de Oportunidad** — Opportunity Zones (Sec. 6070.60)

**Incentivo wizard steps**: Tipo de Incentivo → Información del Solicitante (personal/company info, ciudadanía, contact) → Información del Negocio (business name, NAICS code, Registro de Comerciante, municipality, date established, number of employees, annual sales volume) → Detalles del Proyecto (project description, expected economic impact, job creation, investment amount) → Documentos (required attachments vary by type, typically: Certificación No-Deuda Hacienda, Certificación Radicación Planillas, Registro de Comerciante IVU, Certificación No-Deuda CRIM, Certificación No-Deuda Fondo del Seguro del Estado, Certificación No-Deuda Departamento del Trabajo) → Resumen → Someter

**Key requirements across incentive types**:
- No outstanding debts with Puerto Rico government agencies (Hacienda, CRIM, ASUME, etc.)
- Valid Registro de Comerciante
- Tax returns filed for last 5 years
- Business must be operating or new (depending on program)
- All applications submitted digitally through the portal
- Once approved, a decreto (decree) is issued with specific terms and duration

**Informes Anuales (IANE)**: Decree holders must file annual compliance reports through the portal. The system should show status of filed IANEs and upcoming deadlines.

**Capital Semilla (Seed Capital)**: PyMEs with annual sales under $3M and ≤25 employees can apply for economic incentives up to $35,000 (existing) or seed funding (new businesses). DDEC reimburses 50-75% of eligible investment costs.

## ElevenLabs Voice Agent Integration

### Architecture
The voice agent serves as an AI-powered assistant that helps users navigate the permit system. It should:
- **Guide users** through each step of any wizard, explaining what each field means
- **Fill out forms** by voice command (e.g., "El nombre del proyecto es Centro Comercial Plaza")
- **Answer questions** about permit requirements, documents needed, costs, and timelines
- **Navigate** users to the correct section (e.g., "Necesito radicar una querella")
- **Speak Spanish** as the primary language (Puerto Rican Spanish)

### Technical Implementation
```
@elevenlabs/react SDK (useConversation hook)
```

**Key packages**:
- `@elevenlabs/react` — React hooks for conversation management
- `@elevenlabs/client` — Core TypeScript client

**Integration pattern**:
```tsx
import { useConversation } from "@elevenlabs/react";

const conversation = useConversation({
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
});

// Start with WebRTC for best quality
conversation.startSession({
  connectionType: 'webrtc',
  clientTools: {
    fillFormField: async ({ fieldName, value }) => {
      // Bridge to form state
      updateFormField(fieldName, value);
      return `Campo ${fieldName} actualizado con: ${value}`;
    },
    navigateToSection: async ({ section }) => {
      router.push(`/${section}`);
      return `Navegando a ${section}`;
    },
    getCurrentFormState: async () => {
      return JSON.stringify(currentFormState);
    },
    getFieldOptions: async ({ fieldName }) => {
      // Return dropdown options for a given field
      return JSON.stringify(fieldOptions[fieldName]);
    },
  },
});
```

### Client Tools for the Voice Agent
The agent needs these **client tools** registered:
1. **fillFormField(fieldName, value)** — Sets a form field value. The agent says "setting Tipo de Zona to Rural" and the form updates.
2. **navigateToSection(section)** — Navigates to Permisos, Solicitudes, Consultas, Querellas, or specific wizard steps.
3. **getCurrentFormState()** — Returns the current form data so the agent knows what's filled and what's missing.
4. **getFieldOptions(fieldName)** — Returns available options for dropdowns (municipios, tipos de zona, etc.) so the agent can present choices.
5. **submitForm()** — Triggers form save/submit actions (Guardar, Guardar y Continuar, Someter).
6. **goToNextStep() / goToPreviousStep()** — Wizard navigation.
7. **uploadDocument(tipoAnejo)** — Triggers the file upload dialog for a specific document type.

### Agent Configuration (in ElevenLabs Dashboard)
- **Voice**: Select a Spanish-speaking voice (natural, professional tone)
- **LLM**: Claude or GPT-4 as the backing model
- **System prompt** should include:
  - Full knowledge of the permit system, all form fields, required documents
  - Puerto Rico municipal codes, catastro system basics
  - Ley 161-2009 querella requirements
  - Ley 60-2019 (Código de Incentivos) — all incentive types, requirements, decree process
  - Available permit types and their requirements
  - Ability to walk through forms step by step
  - Knowledge of no-debt certification requirements for incentive applications
- **Knowledge Base**: Upload permit system documentation, FAQ, requirements lists
- **Language**: Spanish (primary), English (secondary/fallback)

### UI for Voice Agent
- **Floating button** in bottom-right corner (always visible)
- **Expandable panel** showing conversation transcript
- **Visual indicators**: agent speaking, user speaking, processing
- **Text input fallback** for users who prefer typing
- **Form highlight**: when agent references a field, briefly highlight it in the UI
- **Microphone permission**: request with clear Spanish explanation before first use

## Design System

### Colors (from screenshots)
- **Primary teal/dark green**: `#2D6A4F` or similar (navbar, headers, table headers)
- **Orange accent**: `#E76F51` (Permisos button, Querellas button, Cancelar)
- **Teal buttons**: `#2A9D8F` (Solicitudes, Consultas, Incentivos, Guardar, Guardar y Continuar)
- **Dark navbar**: `#1B4332` or dark teal
- **Light background**: `#F8F9FA`
- **Table header**: Dark teal/green with white text
- **Required indicator**: Green dot `●`
- **Step icons**: Circular with connecting lines, filled teal when complete, outlined when pending

### Typography
- Clean sans-serif (system font or similar)
- Form labels: Regular weight, dark gray
- Required fields marked with `*`
- Section headers: Bold with icon prefix (🏢, 📍, 📄 etc. or Font Awesome style icons)

### Components Pattern
- **Stepper**: Horizontal, circular icons connected by lines. Active step highlighted. Labels below icons.
- **Form sections**: Card-style containers with padding
- **Button bar**: Centered at bottom of each wizard step. Color-coded: green (Paso Anterior), teal (Guardar, Guardar y Continuar), red (Cancelar), gray→teal (Siguiente Paso)
- **Search modal**: Overlay with tabs (Permisos, Solicitudes, Consultas, Incentivos, Todos), search bar, list items with icons and RADICAR buttons
- **Data tables**: Striped or clean with teal headers

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- All UI text in Spanish — no English in user-facing strings
- Use Zod for form validation schemas
- Use React Hook Form for form management
- Keep wizard state in context, persist to localStorage for resume capability
- All API routes in `/app/api/` using Next.js Route Handlers
- Use server components where possible, client components for interactive forms

### Form Validation
- Required fields: validate on blur and on step navigation
- Show inline Spanish error messages (e.g., "Este campo es requerido")
- Prevent step advancement if current step has validation errors
- Allow "Guardar" (save draft) even with incomplete data

### Accessibility
- ARIA labels on all form controls (in Spanish)
- Keyboard navigation through wizard steps
- Screen reader support for stepper progress
- Voice agent as an additional accessibility layer

### Environment Variables
```env
# Database
DATABASE_URL=

# ElevenLabs
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
ELEVENLABS_API_KEY=

# ArcGIS/Esri
NEXT_PUBLIC_ARCGIS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Build Order (Recommended)
1. **Project scaffolding**: Next.js + Tailwind + shadcn/ui setup
2. **Layout & Navbar**: Top navigation bar matching screenshots
3. **Main Dashboard**: Radicar buttons, Solicitudes de Trámites section, Perfiles de Proyectos section
4. **Search Modal**: Búsqueda de Permisos overlay with tabs
5. **Stepper component**: Reusable multi-step wizard
6. **Permiso wizard**: All 8 steps with form validation
7. **Catastro/Map integration**: Esri map + parcel lookup
8. **Solicitudes flows**: APA and other types
9. **Consultas flows**: Pre-consultas
10. **Querellas flow**: Full complaint filing
11. **Incentivos flow**: Decree application wizard with all incentive types
12. **ElevenLabs Voice Agent**: Widget + client tools + form bridge
13. **API routes & database**: Persistence layer
14. **Polish**: Error handling, loading states, responsive design

## Notes
- The original system is at the Gerencia de Permisos website run by the Puerto Rico government
- Catastro numbers follow format: `###-###-###-##`
- Puerto Rico has 78 municipalities — all must be available in dropdowns
- The system uses "Radicar" (to file/submit) as the primary action verb
- "Someter" means to submit the final application
- "Trámite" = procedure/process, "Anejo" = attachment/annex
- "Decreto" = tax exemption decree issued under Ley 60-2019
- Incentivos portal is the Single Business Portal (SBP) — originally at incentives.ddec.pr.gov
- Ley 60-2019 (Código de Incentivos de Puerto Rico) consolidates all PR tax incentive programs
- "IANE" = Informe Anual de Negocio Exento (annual compliance report for decree holders)
- "PyME" = Pequeña y Mediana Empresa (small/medium business, ≤$3M sales, ≤25 employees)
- No authentication/login system is needed at this stage — assume user is already logged in
- All monetary amounts should be in USD
