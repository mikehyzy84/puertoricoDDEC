import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { numero: { contains: search, mode: "insensitive" } },
    ];
  }
  if (desde || hasta) {
    where.fechaCreacion = {
      ...(desde ? { gte: new Date(desde) } : {}),
      ...(hasta ? { lte: new Date(hasta) } : {}),
    };
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { fechaCreacion: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await prisma.project.create({
    data: {
      nombre: body.nombre,
      duenoProyecto: body.duenoProyecto,
      duenoSolar: body.duenoSolar || null,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
