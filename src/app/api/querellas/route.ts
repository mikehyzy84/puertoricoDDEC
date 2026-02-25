import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const querellas = await prisma.querella.findMany({
    orderBy: { createdAt: "desc" },
    include: { documentos: true },
  });
  return NextResponse.json(querellas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const querella = await prisma.querella.create({
    data: {
      municipio: body.municipio,
      motivo: body.motivo,
      tipoPermiso: body.tipoPermiso,
      detallesViolaciones: body.detallesViolaciones,
      diaHoraViolaciones: body.diaHoraViolaciones,
      nombreCompania: body.nombreCompania,
      horarioOperacion: body.horarioOperacion,
      comentariosGenerales: body.comentariosGenerales,
      direccion1: body.direccion1,
      direccion2: body.direccion2,
      pais: body.pais,
      estadoDireccion: body.estadoDireccion,
      ciudad: body.ciudad,
      codigoPostal: body.codigoPostal,
      numeroCatastro: body.numeroCatastro,
    },
  });
  return NextResponse.json(querella, { status: 201 });
}
