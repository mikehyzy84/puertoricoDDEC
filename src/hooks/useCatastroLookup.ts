"use client";

import { useState, useCallback } from "react";
import type { CatastroResult, CatastroSearchParams } from "@/types/catastro";

interface UseCatastroLookupReturn {
  result: CatastroResult | null;
  loading: boolean;
  error: string | null;
  search: (params: CatastroSearchParams) => Promise<CatastroResult | null>;
  clear: () => void;
}

export function useCatastroLookup(): UseCatastroLookupReturn {
  const [result, setResult] = useState<CatastroResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: CatastroSearchParams): Promise<CatastroResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (params.numeroCatastro) query.set("numeroCatastro", params.numeroCatastro);
      if (params.latitud) query.set("latitud", params.latitud);
      if (params.longitud) query.set("longitud", params.longitud);
      if (params.lambertX) query.set("lambertX", params.lambertX);
      if (params.lambertY) query.set("lambertY", params.lambertY);

      const res = await fetch(`/api/catastro?${query.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error en la búsqueda de catastro");
      }

      const data: CatastroResult = await res.json();
      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, search, clear };
}
