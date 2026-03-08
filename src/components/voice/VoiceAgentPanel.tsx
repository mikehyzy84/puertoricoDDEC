"use client";

import { useEffect, useRef, useState } from "react";
import {
  useVoiceAgent,
  LANGUAGE_LABELS,
  type VoiceLanguage,
} from "./VoiceAgentProvider";

export default function VoiceAgentPanel() {
  const {
    isOpen,
    closePanel,
    startConversation,
    endConversation,
    status,
    isSpeaking,
    language,
    setLanguage,
    transcript,
    error,
    clearError,
  } = useVoiceAgent();

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Escape key closes the panel
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closePanel]);

  if (!isOpen) return null;

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isDisconnecting = status === "disconnecting";

  return (
    <div
      role="dialog"
      aria-label="Asistente de voz Benito"
      aria-modal="false"
      className="voice-panel"
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="voice-panel-header">
        <div className="voice-panel-header-left">
          <div className="voice-panel-avatar" aria-hidden="true">
            B
          </div>
          <div>
            <div className="voice-panel-name">Benito</div>
            <div className="voice-panel-status">
              {status === "connected"
                ? isSpeaking
                  ? "Hablando..."
                  : "Escuchando..."
                : status === "connecting"
                  ? "Conectando..."
                  : status === "disconnecting"
                    ? "Desconectando..."
                    : "Desconectado"}
            </div>
          </div>
        </div>
        <button
          onClick={closePanel}
          className="voice-panel-close"
          aria-label="Minimizar asistente de voz"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 14L14 2M2 2l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ── Language picker ──────────────────────────────────────── */}
      <div className="voice-panel-lang">
        <label htmlFor="voice-language-select" className="voice-panel-lang-label">
          Idioma:
        </label>
        <select
          id="voice-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as VoiceLanguage)}
          disabled={isConnected || isConnecting}
          className="voice-panel-lang-select"
        >
          {(Object.entries(LANGUAGE_LABELS) as [VoiceLanguage, string][]).map(
            ([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      {/* ── Visual state indicator ──────────────────────────────── */}
      {isConnected && (
        <div className="voice-panel-indicator" aria-live="polite">
          <div
            className={`voice-panel-waveform ${
              isSpeaking ? "voice-waveform-speaking" : "voice-waveform-listening"
            }`}
          >
            <span /><span /><span /><span /><span />
          </div>
          <span className="voice-panel-indicator-text">
            {isSpeaking ? "Benito está hablando" : "Escuchando..."}
          </span>
        </div>
      )}

      {/* ── Error banner ────────────────────────────────────────── */}
      {error && (
        <div className="voice-panel-error" role="alert">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Cerrar error" className="voice-panel-error-close">
            &times;
          </button>
        </div>
      )}

      {/* ── Transcript ──────────────────────────────────────────── */}
      <div className="voice-panel-transcript" aria-label="Transcripción de la conversación" role="log">
        {transcript.length === 0 && !isConnected && (
          <p className="voice-panel-placeholder">
            Presiona el micrófono para iniciar una conversación con Benito.
          </p>
        )}
        {transcript.length === 0 && isConnected && (
          <p className="voice-panel-placeholder">
            Habla con Benito — tu asistente te guiará por el proceso.
          </p>
        )}
        {transcript.map((entry) => (
          <div
            key={entry.id}
            className={`voice-transcript-entry ${
              entry.role === "user"
                ? "voice-transcript-user"
                : "voice-transcript-agent"
            }`}
          >
            <span className="voice-transcript-role">
              {entry.role === "user" ? "Tú" : "Benito"}
            </span>
            <span className="voice-transcript-text">{entry.text}</span>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      {/* ── Demo: simulate agent filling a field ─────────────── */}
      <DemoFillButton />

      {/* ── Controls ────────────────────────────────────────────── */}
      <div className="voice-panel-controls">
        {!isConnected && !isConnecting && !isDisconnecting && (
          <button
            onClick={startConversation}
            className="voice-btn voice-btn-start"
            aria-label="Iniciar conversación con Benito"
          >
            <MicIcon />
            <span>Iniciar</span>
          </button>
        )}
        {isConnecting && (
          <button disabled className="voice-btn voice-btn-connecting" aria-label="Conectando...">
            <SpinnerIcon />
            <span>Conectando...</span>
          </button>
        )}
        {isConnected && (
          <button
            onClick={endConversation}
            className="voice-btn voice-btn-end"
            aria-label="Terminar conversación"
          >
            <PhoneOffIcon />
            <span>Terminar</span>
          </button>
        )}
        {isDisconnecting && (
          <button disabled className="voice-btn voice-btn-connecting" aria-label="Desconectando...">
            <SpinnerIcon />
            <span>Cerrando...</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Inline SVG icons ─────────────────────────────────────────────

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="voice-spinner" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ── Demo button — simulates agent filling a form field ───────────

const DEMO_STEPS = [
  { key: "project_name", value: "Centro Comercial Plaza del Sol", label: "Nombre del Proyecto" },
  { key: "zone_type", value: "Urbano", label: "Tipo de Zona" },
  { key: "project_type", value: "Privado", label: "Tipo de Proyecto" },
  { key: "federal_funds", value: "No aplica", label: "Fondos Federales" },
  { key: "designation", value: "No aplica", label: "Designación" },
  { key: "description", value: "Construcción de un centro comercial de 3 niveles con estacionamiento subterráneo en el municipio de San Juan.", label: "Descripción" },
] as const;

function DemoFillButton() {
  const { fillField } = useVoiceAgent();
  const [demoIndex, setDemoIndex] = useState(0);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleDemo = () => {
    const step = DEMO_STEPS[demoIndex];
    const result = fillField(step.key, step.value);
    setLastResult(result);
    setDemoIndex((prev) => (prev + 1) % DEMO_STEPS.length);
  };

  return (
    <div style={{
      padding: "8px 16px",
      borderTop: "1px solid #e2e8f0",
      fontSize: "12px",
    }}>
      <button
        onClick={handleDemo}
        style={{
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "#2b8a7a",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Demo: Llenar &quot;{DEMO_STEPS[demoIndex].label}&quot;
      </button>
      {lastResult && (
        <div style={{ marginTop: "4px", color: "#666", textAlign: "center" }}>
          {lastResult}
        </div>
      )}
    </div>
  );
}
