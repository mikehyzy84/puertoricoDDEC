import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");

  const where: Record<string, unknown> = {};
  if (tipo) where.tipo = tipo;

  const consultas = await prisma.consulta.findMany({
    where,
    include: { documentos: true, project: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(consultas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const consulta = await prisma.consulta.create({
    data: {
      tipo: body.tipo,
      subTipo: body.subTipo || null,
      municipio: body.municipio,
      descripcion: body.descripcion,
      datos: body.datos || null,
      projectId: body.projectId || null,
    },
  });
  return NextResponse.json(consulta, { status: 201 });
}
