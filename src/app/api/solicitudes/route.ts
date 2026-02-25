import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");

  const where: Record<string, unknown> = {};
  if (tipo) where.tipo = tipo;

  const solicitudes = await prisma.solicitud.findMany({
    where,
    include: { documentos: true, project: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(solicitudes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const solicitud = await prisma.solicitud.create({
    data: {
      tipo: body.tipo,
      municipio: body.municipio,
      licencia: body.licencia,
      profesion: body.profesion,
      expedicionColegiacion: body.expedicionColegiacion,
      expiracionColegiacion: body.expiracionColegiacion,
      expedicionLicencia: body.expedicionLicencia,
      expiracionLicencia: body.expiracionLicencia,
      descripcion: body.descripcion,
      datos: body.datos || null,
      projectId: body.projectId || null,
    },
  });
  return NextResponse.json(solicitud, { status: 201 });
}
