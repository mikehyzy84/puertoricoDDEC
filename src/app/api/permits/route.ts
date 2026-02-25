import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const estado = searchParams.get("estado");
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {};
  if (estado) where.estado = estado;
  if (search) {
    where.OR = [
      { numero: { contains: search, mode: "insensitive" } },
      { nombre: { contains: search, mode: "insensitive" } },
    ];
  }

  const permits = await prisma.permit.findMany({
    where,
    include: { project: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(permits);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const permit = await prisma.permit.create({
    data: {
      nombre: body.nombre,
      tipoZona: body.tipoZona,
      tipoProyecto: body.tipoProyecto,
      fondosFederales: body.fondosFederales,
      designacion: body.designacion,
      descripcion: body.descripcion,
      tipoDueno: body.tipoDueno,
      numeroCatastro: body.numeroCatastro,
      municipio: body.municipio,
      projectId: body.projectId || null,
    },
  });
  return NextResponse.json(permit, { status: 201 });
}
