"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useConversation } from "@elevenlabs/react";
import { PAGE_ROUTES } from "@/constants/fieldMappings";

// ── Types ────────────────────────────────────────────────────────

export interface TranscriptEntry {
  id: number;
  role: "user" | "agent";
  text: string;
  timestamp: number;
}

export interface FormFillerHandle {
  fillField: (fieldKey: string, value: string) => boolean;
  highlightField: (fieldKey: string) => void;
  scrollFormIntoView: () => void;
}

export interface NavigatorHandle {
  navigate: (path: string) => void;
  getCurrentPath: () => string;
}

export interface WizardControlHandle {
  goNext: () => Promise<string>;
  goPrev: () => string;
  goToStep: (step: number) => string;
  getCurrentStep: () => { step: number; total: number; label: string };
  getFormState: () => string;
}

export type VoiceLanguage =
  | "es" | "en" | "fr" | "pt" | "zh" | "ko"
  | "ja" | "ar" | "hi" | "de" | "it" | "ru" | "ht";

export const LANGUAGE_LABELS: Record<VoiceLanguage, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  pt: "Português",
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
  ar: "العربية",
  hi: "हिन्दी",
  de: "Deutsch",
  it: "Italiano",
  ru: "Русский",
  ht: "Kreyòl Ayisyen",
};

interface VoiceAgentState {
  /** Whether the panel is open */
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;

  /** Conversation lifecycle */
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  status: "disconnected" | "connecting" | "connected" | "disconnecting";
  isSpeaking: boolean;

  /** Language */
  language: VoiceLanguage;
  setLanguage: (lang: VoiceLanguage) => void;

  /** Transcript */
  transcript: TranscriptEntry[];
  clearTranscript: () => void;

  /** Error state */
  error: string | null;
  clearError: () => void;

  /** Form filler registration (used by useFormFiller hook) */
  registerForm: (formId: string, handle: FormFillerHandle) => void;
  unregisterForm: (formId: string) => void;

  /** Navigator registration (used by VoiceNavigatorBridge) */
  registerNavigator: (handle: NavigatorHandle) => void;
  unregisterNavigator: () => void;

  /** Wizard control registration (used by wizard pages) */
  registerWizardControl: (id: string, handle: WizardControlHandle) => void;
  unregisterWizardControl: (id: string) => void;

  /** Direct fill — used by demo button and tests */
  fillField: (fieldKey: string, value: string) => string;

  /** First visit pulse — set to false after first interaction */
  showPulse: boolean;
  dismissPulse: () => void;
}

// ── Context ──────────────────────────────────────────────────────

const VoiceAgentContext = createContext<VoiceAgentState | null>(null);

export function useVoiceAgent() {
  const ctx = useContext(VoiceAgentContext);
  if (!ctx) {
    throw new Error("useVoiceAgent must be used within VoiceAgentProvider");
  }
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────

export function VoiceAgentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguageState] = useState<VoiceLanguage>("es");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPulse, setShowPulse] = useState(true);

  const nextIdRef = useRef(0);
  const formsRef = useRef<Map<string, FormFillerHandle>>(new Map());
  const navigatorRef = useRef<NavigatorHandle | null>(null);
  const wizardControlsRef = useRef<Map<string, WizardControlHandle>>(new Map());

  // ── Form filler registry ───────────────────────────────────────

  const registerForm = useCallback((formId: string, handle: FormFillerHandle) => {
    formsRef.current.set(formId, handle);
  }, []);

  const unregisterForm = useCallback((formId: string) => {
    formsRef.current.delete(formId);
  }, []);

  // ── Navigator registry ─────────────────────────────────────────

  const registerNavigator = useCallback((handle: NavigatorHandle) => {
    navigatorRef.current = handle;
  }, []);

  const unregisterNavigator = useCallback(() => {
    navigatorRef.current = null;
  }, []);

  // ── Wizard control registry ────────────────────────────────────

  const registerWizardControl = useCallback((id: string, handle: WizardControlHandle) => {
    wizardControlsRef.current.set(id, handle);
  }, []);

  const unregisterWizardControl = useCallback((id: string) => {
    wizardControlsRef.current.delete(id);
  }, []);

  // ── Client tool implementations ────────────────────────────────

  /** Attempt to fill a field on whichever form is currently registered. */
  const fillFormField = useCallback(
    (fieldKey: string, value: string): string => {
      const handles = Array.from(formsRef.current.values());
      for (let i = 0; i < handles.length; i++) {
        if (handles[i].fillField(fieldKey, value)) {
          return `Campo ${fieldKey} actualizado con: ${value}`;
        }
      }
      return `No se encontró el campo ${fieldKey} en el formulario actual.`;
    },
    [],
  );

  const highlightField = useCallback((fieldKey: string): string => {
    const handles = Array.from(formsRef.current.values());
    for (let i = 0; i < handles.length; i++) {
      handles[i].highlightField(fieldKey);
    }
    return `Resaltando campo ${fieldKey}`;
  }, []);

  const showFormSummary = useCallback((): string => {
    const handles = Array.from(formsRef.current.values());
    for (let i = 0; i < handles.length; i++) {
      handles[i].scrollFormIntoView();
    }
    return "Mostrando resumen del formulario";
  }, []);

  const navigateToPage = useCallback((page: string): string => {
    const nav = navigatorRef.current;
    if (!nav) return "Navegación no disponible.";

    const route = PAGE_ROUTES[page.toLowerCase()];
    if (!route) {
      return `Página "${page}" no reconocida. Páginas disponibles: ${Object.keys(PAGE_ROUTES).join(", ")}`;
    }

    nav.navigate(route);
    return `Navegando a ${page} (${route})`;
  }, []);

  const getActiveWizard = useCallback((): WizardControlHandle | null => {
    const entries = Array.from(wizardControlsRef.current.values());
    return entries.length > 0 ? entries[0] : null;
  }, []);

  // ── Transcript helpers ─────────────────────────────────────────

  const addTranscriptEntry = useCallback(
    (role: "user" | "agent", text: string) => {
      setTranscript((prev) => [
        ...prev,
        { id: nextIdRef.current++, role, text, timestamp: Date.now() },
      ]);
    },
    [],
  );

  const clearTranscript = useCallback(() => setTranscript([]), []);

  // ── ElevenLabs conversation ────────────────────────────────────

  const conversation = useConversation({
    onMessage: ({ message, role }) => {
      addTranscriptEntry(role, message);
    },
    onError: (message) => {
      setError(message);
    },
    onDisconnect: () => {
      // No-op — status is tracked via conversation.status
    },
    clientTools: {
      fill_form_field: async (params: { field_key: string; value: string }) => {
        return fillFormField(params.field_key, params.value);
      },
      highlight_field: async (params: { field_key: string }) => {
        return highlightField(params.field_key);
      },
      show_form_summary: async () => {
        return showFormSummary();
      },
      navigate_to_page: async (params: { page: string }) => {
        return navigateToPage(params.page);
      },
      go_to_next_step: async () => {
        const wiz = getActiveWizard();
        if (!wiz) return "No hay formulario de pasos activo.";
        return wiz.goNext();
      },
      go_to_previous_step: async () => {
        const wiz = getActiveWizard();
        if (!wiz) return "No hay formulario de pasos activo.";
        return wiz.goPrev();
      },
      go_to_step: async (params: { step_number: number }) => {
        const wiz = getActiveWizard();
        if (!wiz) return "No hay formulario de pasos activo.";
        return wiz.goToStep(params.step_number);
      },
      get_current_step: async () => {
        const wiz = getActiveWizard();
        if (!wiz) return "No hay formulario de pasos activo.";
        const info = wiz.getCurrentStep();
        return `Paso ${info.step + 1} de ${info.total}: ${info.label}`;
      },
      get_form_state: async () => {
        const wiz = getActiveWizard();
        if (!wiz) return "No hay formulario activo.";
        return wiz.getFormState();
      },
    },
  });

  // ── Public actions ─────────────────────────────────────────────

  const startConversation = useCallback(async () => {
    setError(null);
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId) {
      setError("No se encontró el ID del agente. Verifique la configuración.");
      return;
    }
    try {
      await conversation.startSession({
        agentId,
        connectionType: "webrtc",
        dynamicVariables: {
          language,
        },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Error al conectar con el agente de voz.",
      );
    }
  }, [conversation, language]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // Swallow — session may already be ended
    }
  }, [conversation]);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    setShowPulse(false);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setShowPulse(false);
      return !prev;
    });
  }, []);

  const setLanguage = useCallback((lang: VoiceLanguage) => {
    setLanguageState(lang);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const dismissPulse = useCallback(() => setShowPulse(false), []);

  return (
    <VoiceAgentContext.Provider
      value={{
        isOpen,
        openPanel,
        closePanel,
        togglePanel,
        startConversation,
        endConversation,
        status: conversation.status,
        isSpeaking: conversation.isSpeaking,
        language,
        setLanguage,
        transcript,
        clearTranscript,
        error,
        clearError,
        registerForm,
        unregisterForm,
        registerNavigator,
        unregisterNavigator,
        registerWizardControl,
        unregisterWizardControl,
        fillField: fillFormField,
        showPulse,
        dismissPulse,
      }}
    >
      {children}
    </VoiceAgentContext.Provider>
  );
}
