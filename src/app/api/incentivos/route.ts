import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const incentivos = await prisma.incentivo.findMany({
    orderBy: { createdAt: "desc" },
    include: { documentos: true },
  });
  return NextResponse.json(incentivos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const incentivo = await prisma.incentivo.create({
    data: {
      tipoIncentivo: body.tipoIncentivo,
      nombre: body.nombre,
      apellido: body.apellido,
      ciudadania: body.ciudadania,
      identificacion: body.identificacion,
      telefono: body.telefono,
      email: body.email,
      direccion: body.direccion,
      municipio: body.municipio,
      codigoPostal: body.codigoPostal,
      nombreNegocio: body.nombreNegocio,
      codigoNAICS: body.codigoNAICS,
      registroComerciante: body.registroComerciante,
      municipioNegocio: body.municipioNegocio,
      fechaEstablecimiento: body.fechaEstablecimiento,
      numeroEmpleados: body.numeroEmpleados ? parseInt(body.numeroEmpleados) : null,
      volumenVentasAnuales: body.volumenVentasAnuales ? parseFloat(body.volumenVentasAnuales) : null,
      descripcionProyecto: body.descripcionProyecto,
      impactoEconomico: body.impactoEconomico,
      empleosCrear: body.empleosCrear ? parseInt(body.empleosCrear) : null,
      montoInversion: body.montoInversion ? parseFloat(body.montoInversion) : null,
    },
  });
  return NextResponse.json(incentivo, { status: 201 });
}
