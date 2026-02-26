"use client";

import { useEffect, useCallback, useRef } from "react";
import { useVoiceAgent } from "@/components/voice/VoiceAgentProvider";
import type { UseFormSetValue, FieldValues } from "react-hook-form";
import type { FieldMapping } from "@/constants/fieldMappings";

interface UseFormFillerOptions<T extends FieldValues> {
  /** Unique ID for this form (e.g. "permiso", "querella") */
  formId: string;
  /** React Hook Form setValue function */
  setValue: UseFormSetValue<T>;
  /** Map of agent field keys → React Hook Form field paths */
  fieldMapping: FieldMapping;
}

/**
 * Registers the current page's form with the voice agent so Benito
 * can fill fields or highlight them via client tools.
 *
 * Call this hook in any form page that should be voice-controllable.
 */
export function useFormFiller<T extends FieldValues>({
  formId,
  setValue,
  fieldMapping,
}: UseFormFillerOptions<T>) {
  const { registerForm, unregisterForm } = useVoiceAgent();

  // Keep a stable ref so the registration callbacks always use the
  // latest setValue / fieldMapping without re-registering on every render.
  const setValueRef = useRef(setValue);
  const mappingRef = useRef(fieldMapping);
  useEffect(() => {
    setValueRef.current = setValue;
    mappingRef.current = fieldMapping;
  }, [setValue, fieldMapping]);

  const fillField = useCallback((fieldKey: string, value: string) => {
    const formPath = mappingRef.current[fieldKey];
    if (!formPath) {
      console.warn(`[useFormFiller] No mapping for field key "${fieldKey}"`);
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValueRef.current(formPath as any, value as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
    highlightElement(formPath);
    return true;
  }, []);

  const highlightField = useCallback((fieldKey: string) => {
    const formPath = mappingRef.current[fieldKey];
    if (!formPath) return;
    highlightElement(formPath);
    scrollToElement(formPath);
  }, []);

  const scrollFormIntoView = useCallback(() => {
    const form = document.querySelector("form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Register this form with the provider on mount, unregister on unmount.
  useEffect(() => {
    registerForm(formId, { fillField, highlightField, scrollFormIntoView });
    return () => unregisterForm(formId);
  }, [formId, fillField, highlightField, scrollFormIntoView, registerForm, unregisterForm]);
}

// ── DOM helpers ──────────────────────────────────────────────────

function findInputElement(formPath: string): HTMLElement | null {
  // Try by name (React Hook Form sets name attr on inputs)
  const byName = document.querySelector<HTMLElement>(`[name="${formPath}"]`);
  if (byName) return byName;

  // Try by id
  const byId = document.getElementById(formPath) ?? document.getElementById(formPath.replace(/\./g, "-"));
  if (byId) return byId;

  // Try by aria-label or data attribute
  return document.querySelector<HTMLElement>(`[data-field="${formPath}"]`);
}

function highlightElement(formPath: string) {
  const el = findInputElement(formPath);
  if (!el) return;

  el.classList.add("voice-field-highlight");
  setTimeout(() => {
    el.classList.remove("voice-field-highlight");
  }, 1500);
}

function scrollToElement(formPath: string) {
  const el = findInputElement(formPath);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}
