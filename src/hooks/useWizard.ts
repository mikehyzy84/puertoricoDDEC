"use client";

import { useState, useCallback, useEffect } from "react";

interface UseWizardOptions<T> {
  totalSteps: number;
  initialData: T;
  storageKey?: string;
  onComplete?: (data: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWizard<T extends Record<string, any>>({
  totalSteps,
  initialData,
  storageKey,
  onComplete,
}: UseWizardOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<T>(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try { return JSON.parse(saved) as T; } catch { /* ignore */ }
      }
    }
    return initialData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Persist to localStorage
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey]);

  const updateStepData = useCallback(<K extends keyof T>(stepKey: K, stepData: Partial<T[K]>) => {
    setData((prev) => ({
      ...prev,
      [stepKey]: { ...(prev[stepKey] as Record<string, unknown>), ...stepData },
    }));
  }, []);

  const setStepData = useCallback(<K extends keyof T>(stepKey: K, stepData: T[K]) => {
    setData((prev) => ({ ...prev, [stepKey]: stepData }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      setErrors({});
    }
  }, [totalSteps]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      setErrors({});
    } else if (onComplete) {
      onComplete(data);
    }
  }, [currentStep, totalSteps, onComplete, data]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setErrors({});
    }
  }, [currentStep]);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearStorage = useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData(initialData);
    setErrors({});
    clearStorage();
  }, [initialData, clearStorage]);

  return {
    currentStep,
    data,
    errors,
    totalSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    updateStepData,
    setStepData,
    goToStep,
    goNext,
    goPrev,
    setFieldError,
    clearErrors,
    clearStorage,
    reset,
  };
}
