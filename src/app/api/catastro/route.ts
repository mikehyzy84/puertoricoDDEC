import { NextRequest, NextResponse } from "next/server";
import { searchCatastro } from "@/lib/catastro";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = {
    numeroCatastro: searchParams.get("numeroCatastro") || undefined,
    latitud: searchParams.get("latitud") || undefined,
    longitud: searchParams.get("longitud") || undefined,
    lambertX: searchParams.get("lambertX") || undefined,
    lambertY: searchParams.get("lambertY") || undefined,
  };

  // Validate that at least one search method is provided
  const hasCatastro = !!params.numeroCatastro;
  const hasGeo = !!params.latitud && !!params.longitud;
  const hasLambert = !!params.lambertX && !!params.lambertY;

  if (!hasCatastro && !hasGeo && !hasLambert) {
    return NextResponse.json(
      { error: "Debe proveer número de catastro, coordenadas geográficas, o coordenadas Lambert" },
      { status: 400 }
    );
  }

  try {
    const result = await searchCatastro(params);
    if (!result) {
      return NextResponse.json(
        { error: "No se encontró parcela con los parámetros proporcionados" },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Error al consultar el servicio de catastro" },
      { status: 500 }
    );
  }
}
