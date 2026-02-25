import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const permit = await prisma.permit.findUnique({
    where: { id },
    include: { documentos: true, project: true },
  });
  if (!permit) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(permit);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const permit = await prisma.permit.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(permit);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.permit.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
