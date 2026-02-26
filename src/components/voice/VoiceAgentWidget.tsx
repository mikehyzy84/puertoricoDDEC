"use client";

import { useVoiceAgent } from "./VoiceAgentProvider";
import VoiceAgentPanel from "./VoiceAgentPanel";

/**
 * Floating voice agent widget — launcher button + expandable panel.
 * Renders in bottom-right corner on every page.
 */
export default function VoiceAgentWidget() {
  const { isOpen, togglePanel, status, showPulse } = useVoiceAgent();

  const isConnected = status === "connected";

  return (
    <div className="voice-widget-root">
      {/* Expanded panel */}
      <VoiceAgentPanel />

      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={togglePanel}
          className={`voice-launcher ${showPulse ? "voice-launcher-pulse" : ""} ${
            isConnected ? "voice-launcher-active" : ""
          }`}
          aria-label="Abrir asistente de voz Benito"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}
    </div>
  );
}
